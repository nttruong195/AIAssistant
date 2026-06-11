package com.finacalc.shop.controller;

import com.finacalc.shop.model.Shop;
import com.finacalc.shop.model.ShopPlatform;
import com.finacalc.shop.repository.ConversationRepository;
import com.finacalc.shop.repository.ShopRepository;
import com.finacalc.shop.service.ShopAgentService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;

@RestController
@RequestMapping("/api/v1/shop")
public class ShopController {

    private final ShopAgentService agentService;
    private final ShopRepository shopRepo;
    private final ConversationRepository conversationRepo;

    public ShopController(ShopAgentService agentService, ShopRepository shopRepo,
                          ConversationRepository conversationRepo) {
        this.agentService = agentService;
        this.shopRepo = shopRepo;
        this.conversationRepo = conversationRepo;
    }

    /** Đăng ký shop (tạm thời không cần OAuth) */
    @PostMapping("/register")
    public ResponseEntity<Shop> register(@RequestBody RegisterRequest req) {
        Shop shop = new Shop();
        shop.setOwnerEmail(req.ownerEmail());
        shop.setShopName(req.shopName());
        shop.setPlatform(ShopPlatform.valueOf(req.platform().toUpperCase()));
        shop.setPlatformShopId("MOCK-" + System.currentTimeMillis());
        return ResponseEntity.ok(shopRepo.save(shop));
    }

    /** Lấy danh sách shop của user */
    @GetMapping("/list")
    public List<Shop> list(@RequestParam String ownerEmail) {
        return shopRepo.findByOwnerEmail(ownerEmail);
    }

    /** Chat với AI agent */
    @PostMapping(value = "/{shopId}/chat", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter chat(@PathVariable Long shopId, @RequestBody ChatRequest req) {
        return agentService.chat(shopId, req.message());
    }

    /** Xóa lịch sử chat */
    @DeleteMapping("/{shopId}/chat")
    public ResponseEntity<Void> clearChat(@PathVariable Long shopId) {
        conversationRepo.deleteByShopId(shopId);
        return ResponseEntity.ok().build();
    }

    /** Lấy lịch sử chat */
    @GetMapping("/{shopId}/chat")
    public List<?> getHistory(@PathVariable Long shopId) {
        return conversationRepo.findByShopIdOrderByCreatedAtAsc(shopId);
    }

    record RegisterRequest(String ownerEmail, String shopName, String platform) {}
    record ChatRequest(String message) {}
}
