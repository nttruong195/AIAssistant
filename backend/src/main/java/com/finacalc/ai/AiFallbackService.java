package com.finacalc.ai;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.Executor;

/**
 * Orchestrate fallback chain: Gemini → Groq → OpenRouter
 * Streams response to frontend via SSE
 */
@Service
public class AiFallbackService {

    private static final Logger log = LoggerFactory.getLogger(AiFallbackService.class);

    private final List<AiClient> clients;
    private final Executor aiExecutor;

    public AiFallbackService(GeminiClient gemini, GroqClient groq, TogetherClient together,
                              HuggingFaceClient huggingFace, CohereClient cohere,
                              OpenRouterClient openRouter, Executor aiExecutor) {
        // Priority: Gemini (1500/day) → Groq (6000/day) → Together → HuggingFace → Cohere → OpenRouter
        // Priority: Gemini → Groq → OpenRouter → Cohere → Together → HuggingFace
        this.clients = List.of(gemini, groq, openRouter, cohere, together, huggingFace);
        this.aiExecutor = aiExecutor;
    }

    /**
     * Gọi AI đồng bộ — trả về text, dùng cho Shop Agent
     */
    public String completeText(String prompt) {
        Exception lastError = null;
        for (AiClient client : clients) {
            if (!client.isAvailable()) continue;
            try {
                log.info("ShopAgent using provider: {}", client.getProvider());
                return client.complete(prompt);
            } catch (Exception e) {
                log.warn("Provider {} failed: {}", client.getProvider(), e.getMessage());
                lastError = e;
            }
        }
        throw new RuntimeException("Tất cả AI provider đều thất bại: " +
                (lastError != null ? lastError.getMessage() : "no providers available"));
    }

    /**
     * Stream AI response to SSE emitter
     */
    public SseEmitter streamComplete(String prompt) {
        SseEmitter emitter = new SseEmitter(120_000L); // 2 min timeout

        aiExecutor.execute(() -> {
            String result = null;
            Exception lastError = null;

            for (AiClient client : clients) {
                if (!client.isAvailable()) {
                    log.debug("Skipping {} — no API key", client.getProvider());
                    continue;
                }
                try {
                    log.info("Trying AI provider: {}", client.getProvider());
                    result = client.complete(prompt);
                    log.info("Success with provider: {}", client.getProvider());
                    break;
                } catch (Exception e) {
                    log.warn("Provider {} failed: {}", client.getProvider(), e.getMessage());
                    lastError = e;
                }
            }

            try {
                if (result != null) {
                    // Stream in chunks for better UX
                    String[] lines = result.split("\n");
                    for (String line : lines) {
                        emitter.send(SseEmitter.event().data(line + "\n"));
                    }
                    emitter.send(SseEmitter.event().name("done").data("[DONE]"));
                    emitter.complete();
                } else {
                    String errorMsg = lastError != null ? lastError.getMessage() : "No AI provider available";
                    emitter.send(SseEmitter.event().name("error").data(errorMsg));
                    emitter.complete();
                }
            } catch (IOException e) {
                log.error("SSE send error", e);
                emitter.completeWithError(e);
            }
        });

        return emitter;
    }

    // ===================== PROMPT TEMPLATES =====================

    public SseEmitter analyzeCv(String cvText) {
        String prompt = """
                Bạn là chuyên gia tuyển dụng và HR với 10 năm kinh nghiệm.
                Hãy phân tích CV sau và đưa ra nhận xét chi tiết bằng tiếng Việt:

                **CV:**
                %s

                **Yêu cầu phân tích:**
                1. Điểm mạnh của CV (3-5 điểm)
                2. Điểm cần cải thiện (3-5 điểm)
                3. Đánh giá tổng thể (thang điểm 10)
                4. Gợi ý cụ thể để cải thiện CV
                5. Các từ khóa quan trọng nên thêm vào
                """.formatted(cvText);
        return streamComplete(prompt);
    }

    public SseEmitter generateCoverLetter(String jobDescription, String candidateInfo) {
        String prompt = """
                Bạn là chuyên gia viết thư xin việc (cover letter) chuyên nghiệp.
                Hãy viết một cover letter hoàn chỉnh bằng tiếng Việt dựa trên thông tin sau:

                **Mô tả công việc (JD):**
                %s

                **Thông tin ứng viên:**
                %s

                **Yêu cầu:**
                - Phong cách chuyên nghiệp, nhiệt huyết
                - Nhấn mạnh điểm phù hợp với JD
                - Độ dài 300-400 từ
                - Có đầy đủ: mở đầu, nội dung chính, kết luận
                """.formatted(jobDescription, candidateInfo);
        return streamComplete(prompt);
    }

    public SseEmitter generateEmail(String emailType, String context) {
        String prompt = """
                Bạn là chuyên gia viết email chuyên nghiệp trong môi trường công sở.
                Hãy viết một email %s bằng tiếng Việt dựa trên ngữ cảnh sau:

                **Ngữ cảnh / Thông tin:**
                %s

                **Yêu cầu:**
                - Tiêu đề email rõ ràng, súc tích
                - Nội dung chuyên nghiệp, lịch sự
                - Đúng format email: Kính gửi... / Thân ái...
                - Ngắn gọn nhưng đủ ý
                """.formatted(emailType, context);
        return streamComplete(prompt);
    }

    public SseEmitter generateJd(String position, String requirements) {
        String prompt = """
                Bạn là chuyên gia HR với kinh nghiệm tuyển dụng tại Việt Nam.
                Hãy viết một Job Description (JD) hoàn chỉnh bằng tiếng Việt cho vị trí sau:

                **Vị trí tuyển dụng:** %s

                **Yêu cầu / Thông tin thêm:**
                %s

                **Cấu trúc JD cần có:**
                1. Mô tả công ty (brief)
                2. Mô tả công việc (5-8 bullet points)
                3. Yêu cầu ứng viên (kỹ năng cứng + mềm)
                4. Quyền lợi (5-7 điểm hấp dẫn)
                5. Thông tin ứng tuyển
                """.formatted(position, requirements);
        return streamComplete(prompt);
    }

    public SseEmitter optimizeLinkedin(String profileText) {
        String prompt = """
                Bạn là chuyên gia tối ưu hóa LinkedIn với kinh nghiệm giúp hàng trăm người đi làm tại Việt Nam.
                Hãy phân tích profile LinkedIn sau và đưa ra gợi ý cải thiện chi tiết bằng tiếng Việt:

                **Profile:**
                %s

                **Yêu cầu phân tích:**
                1. **Headline:** Gợi ý viết lại (3-5 phương án)
                2. **About/Summary:** Đánh giá và gợi ý cải thiện
                3. **Kinh nghiệm:** Cách mô tả impact bằng số liệu
                4. **Kỹ năng:** Top skills nên thêm vào
                5. **Tối ưu SEO LinkedIn:** Từ khóa quan trọng cần có
                6. **Điểm mạnh cần giữ lại**
                7. **Điểm yếu cần cải thiện ngay**
                8. **Điểm số tổng thể /100 và lộ trình cải thiện**
                """.formatted(profileText);
        return streamComplete(prompt);
    }

    public SseEmitter salaryNegotiation(String currentOffer, String candidateInfo, String marketInfo) {
        String prompt = """
                Bạn là chuyên gia đàm phán lương với kinh nghiệm tư vấn cho người đi làm tại Việt Nam.
                Hãy tư vấn chiến lược đàm phán lương cho tình huống sau bằng tiếng Việt:

                **Offer hiện tại:**
                %s

                **Thông tin ứng viên:**
                %s

                **Thông tin thị trường / kỳ vọng:**
                %s

                **Yêu cầu tư vấn:**
                1. **Đánh giá offer:** Có phù hợp thị trường không?
                2. **Mức lương nên đề xuất:** Khoảng và lý do
                3. **Kịch bản đàm phán:** Script cụ thể nên nói gì
                4. **Câu hỏi nên hỏi HR/nhà tuyển dụng**
                5. **Điểm mạnh để leverage trong đàm phán**
                6. **Những gì KHÔNG nên nói**
                7. **Thời điểm và cách thức đàm phán tốt nhất**
                """.formatted(currentOffer, candidateInfo, marketInfo);
        return streamComplete(prompt);
    }

    public SseEmitter interviewPrep(String jobDescription, String candidateBackground) {
        String prompt = """
                Bạn là chuyên gia luyện phỏng vấn với kinh nghiệm coaching tại Việt Nam.
                Hãy tạo bộ câu hỏi phỏng vấn và gợi ý trả lời dựa trên thông tin sau bằng tiếng Việt:

                **Job Description:**
                %s

                **Background ứng viên:**
                %s

                **Yêu cầu:**
                1. **5 câu hỏi kỹ thuật/chuyên môn** (kèm gợi ý trả lời)
                2. **5 câu hỏi behavioral** dạng STAR (kèm gợi ý)
                3. **3 câu hỏi tình huống** thường gặp trong ngành
                4. **Câu hỏi nên hỏi ngược lại nhà tuyển dụng** (3-5 câu)
                5. **Những điểm cần chuẩn bị kỹ nhất** dựa trên JD
                6. **Red flags cần tránh** trong phỏng vấn
                """.formatted(jobDescription, candidateBackground);
        return streamComplete(prompt);
    }

    public SseEmitter performanceReview(String achievements, String role, String period) {
        String prompt = """
                Bạn là chuyên gia viết performance review chuyên nghiệp tại môi trường doanh nghiệp Việt Nam.
                Hãy viết self-review hoàn chỉnh dựa trên thông tin sau bằng tiếng Việt:

                **Vị trí / Vai trò:** %s

                **Kỳ đánh giá:** %s

                **Thành tích / Công việc đã làm:**
                %s

                **Yêu cầu:**
                1. **Tóm tắt thành tích nổi bật** (có số liệu cụ thể nếu có)
                2. **Đóng góp cho team / công ty**
                3. **Kỹ năng đã phát triển trong kỳ**
                4. **Thách thức đã vượt qua**
                5. **Mục tiêu cho kỳ tiếp theo** (SMART goals)
                6. **Đề xuất / mong muốn phát triển**
                Viết theo phong cách tự tin, chuyên nghiệp, có dẫn chứng cụ thể.
                """.formatted(role, period, achievements);
        return streamComplete(prompt);
    }

    public SseEmitter summarizeContract(String contractText) {
        String prompt = """
                Bạn là chuyên gia luật lao động tại Việt Nam với kinh nghiệm tư vấn hợp đồng lao động.
                Hãy tóm tắt và phân tích hợp đồng sau bằng tiếng Việt:

                **Nội dung hợp đồng:**
                %s

                **Yêu cầu phân tích:**
                1. **Thông tin cơ bản:** Lương, thời hạn, loại hợp đồng
                2. **Quyền lợi chính:** BHXH, phép năm, thưởng, phụ cấp
                3. **Điều khoản cần chú ý:** Thử việc, thông báo nghỉ việc, cạnh tranh
                4. **Điều khoản bất lợi cho NLĐ** (nếu có)
                5. **So sánh với Luật Lao động 2019:** Có điều khoản nào vi phạm không?
                6. **Câu hỏi nên hỏi trước khi ký**
                7. **Đánh giá tổng thể:** Có nên ký không?
                ⚠️ Lưu ý: Đây là tham khảo, không thay thế tư vấn pháp lý chính thức.
                """.formatted(contractText);
        return streamComplete(prompt);
    }
}
