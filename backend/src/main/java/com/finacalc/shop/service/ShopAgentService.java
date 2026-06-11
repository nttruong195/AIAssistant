package com.finacalc.shop.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.finacalc.ai.AiFallbackService;
import com.finacalc.shop.model.Conversation;
import com.finacalc.shop.model.ShopPlatform;
import com.finacalc.shop.repository.ConversationRepository;
import com.finacalc.shop.repository.ShopRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.concurrent.Executor;

@Service
public class ShopAgentService {

    private static final Logger log = LoggerFactory.getLogger(ShopAgentService.class);

    private final AiFallbackService aiFallbackService;
    private final MockShopDataService mockData;
    private final ConversationRepository conversationRepo;
    private final ShopRepository shopRepo;
    private final ObjectMapper objectMapper;
    private final Executor aiExecutor;

    public ShopAgentService(AiFallbackService aiFallbackService, MockShopDataService mockData,
                            ConversationRepository conversationRepo, ShopRepository shopRepo,
                            ObjectMapper objectMapper, Executor aiExecutor) {
        this.aiFallbackService = aiFallbackService;
        this.mockData = mockData;
        this.conversationRepo = conversationRepo;
        this.shopRepo = shopRepo;
        this.objectMapper = objectMapper;
        this.aiExecutor = aiExecutor;
    }

    public SseEmitter chat(Long shopId, String userMessage) {
        SseEmitter emitter = new SseEmitter(120_000L);

        saveMessage(shopId, Conversation.MessageRole.USER, userMessage);

        aiExecutor.execute(() -> {
            try {
                ShopPlatform platform = shopRepo.findById(shopId)
                        .map(s -> s.getPlatform())
                        .orElse(ShopPlatform.SHOPEE);

                // Lấy dữ liệu thực từ mock (sau thay bằng API thật)
                String dataContext = buildDataContext(shopId, platform, userMessage);

                // Tạo prompt đầy đủ cho AI
                String prompt = buildPrompt(platform, dataContext, userMessage);

                // Gọi AI fallback chain (Gemini → Groq → OpenRouter...)
                String response = aiFallbackService.completeText(prompt);

                saveMessage(shopId, Conversation.MessageRole.ASSISTANT, response);

                for (String line : response.split("\n")) {
                    emitter.send(SseEmitter.event().data(line + "\n"));
                }
                emitter.send(SseEmitter.event().name("done").data("[DONE]"));
                emitter.complete();

            } catch (Exception e) {
                log.error("ShopAgent error", e);
                try {
                    emitter.send(SseEmitter.event().name("error").data("Lỗi: " + e.getMessage()));
                    emitter.complete();
                } catch (IOException ex) {
                    emitter.completeWithError(ex);
                }
            }
        });

        return emitter;
    }

    private String buildDataContext(Long shopId, ShopPlatform platform, String message) {
        try {
            String msg = message.toLowerCase();
            StringBuilder ctx = new StringBuilder();

            if (msg.contains("đơn") || msg.contains("order")) {
                ctx.append("ĐƠN HÀNG: ").append(toJson(mockData.getOrders(shopId, platform, "", "2026-06-01", "2026-06-11"))).append("\n");
            }
            if (msg.contains("doanh thu") || msg.contains("revenue") || msg.contains("bán được")) {
                ctx.append("DOANH THU: ").append(toJson(mockData.getRevenue(shopId, platform, "this_month"))).append("\n");
            }
            if (msg.contains("sản phẩm") || msg.contains("product") || msg.contains("bán chạy")) {
                ctx.append("SẢN PHẨM: ").append(toJson(mockData.getTopProducts(shopId, platform, "this_month"))).append("\n");
            }
            if (msg.contains("tồn kho") || msg.contains("hàng") || msg.contains("stock")) {
                ctx.append("TỒN KHO: ").append(toJson(mockData.getInventory(shopId, platform, ""))).append("\n");
            }

            // Nếu không match gì, lấy tổng quan
            if (ctx.isEmpty()) {
                ctx.append("DOANH THU: ").append(toJson(mockData.getRevenue(shopId, platform, "today"))).append("\n");
                ctx.append("TỒN KHO: ").append(toJson(mockData.getInventory(shopId, platform, ""))).append("\n");
            }

            return ctx.toString();
        } catch (Exception e) {
            return "";
        }
    }

    private String buildPrompt(ShopPlatform platform, String dataContext, String userMessage) {
        return """
                Bạn là trợ lý AI quản lý shop %s. Trả lời bằng tiếng Việt, ngắn gọn, dùng emoji cho dễ đọc.

                DỮ LIỆU HIỆN TẠI CỦA SHOP:
                %s

                CÂU HỎI CỦA CHỦ SHOP: %s

                Hãy phân tích dữ liệu trên và trả lời câu hỏi một cách súc tích, có số liệu cụ thể.
                """.formatted(platform.name(), dataContext, userMessage);
    }

    private void saveMessage(Long shopId, Conversation.MessageRole role, String content) {
        Conversation msg = new Conversation();
        msg.setShopId(shopId);
        msg.setRole(role);
        msg.setContent(content);
        conversationRepo.save(msg);
    }

    private String toJson(Object obj) {
        try { return objectMapper.writeValueAsString(obj); }
        catch (Exception e) { return obj.toString(); }
    }
}
