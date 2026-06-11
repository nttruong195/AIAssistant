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
}
