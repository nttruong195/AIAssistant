package com.finacalc.shop.service;

import com.finacalc.shop.model.ShopPlatform;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 * Mock data service — dùng khi chưa có Shopee/TikTok Partner key thật
 * Sau khi có API key thật → thay thế bằng ShopeeApiService / TikTokApiService
 */
@Service
public class MockShopDataService {

    public Map<String, Object> getOrders(Long shopId, ShopPlatform platform, String status, String fromDate, String toDate) {
        return Map.of(
            "total", 12,
            "orders", List.of(
                Map.of("id", "ORD001", "product", "Áo thun basic", "qty", 2, "amount", 280000, "status", "PENDING", "buyer", "Nguyễn Văn A"),
                Map.of("id", "ORD002", "product", "Quần jean slim", "qty", 1, "amount", 450000, "status", "SHIPPED", "buyer", "Trần Thị B"),
                Map.of("id", "ORD003", "product", "Áo polo nam", "qty", 3, "amount", 510000, "status", "DELIVERED", "buyer", "Lê Văn C"),
                Map.of("id", "ORD004", "product", "Váy hoa nhí", "qty", 1, "amount", 320000, "status", "PENDING", "buyer", "Phạm Thị D"),
                Map.of("id", "ORD005", "product", "Áo thun basic", "qty", 5, "amount", 700000, "status", "PROCESSING", "buyer", "Hoàng Văn E")
            ),
            "platform", platform.name(),
            "period", fromDate + " → " + toDate
        );
    }

    public Map<String, Object> getRevenue(Long shopId, ShopPlatform platform, String period) {
        return Map.of(
            "platform", platform.name(),
            "period", period,
            "totalRevenue", 45_600_000,
            "totalOrders", 142,
            "avgOrderValue", 321_127,
            "growth", "+12.5% so với kỳ trước",
            "byDay", List.of(
                Map.of("date", "2026-06-09", "revenue", 6_200_000, "orders", 19),
                Map.of("date", "2026-06-10", "revenue", 7_800_000, "orders", 24),
                Map.of("date", "2026-06-11", "revenue", 5_400_000, "orders", 17)
            )
        );
    }

    public Map<String, Object> getProducts(Long shopId, ShopPlatform platform, String query) {
        return Map.of(
            "platform", platform.name(),
            "total", 28,
            "products", List.of(
                Map.of("id", "P001", "name", "Áo thun basic unisex", "price", 140000, "stock", 45, "sold", 312, "rating", 4.8),
                Map.of("id", "P002", "name", "Quần jean slim fit nam", "price", 450000, "stock", 12, "sold", 98, "rating", 4.6),
                Map.of("id", "P003", "name", "Váy hoa nhí nữ", "price", 320000, "stock", 0, "sold", 67, "rating", 4.7),
                Map.of("id", "P004", "name", "Áo polo nam cao cấp", "price", 220000, "stock", 30, "sold", 201, "rating", 4.9),
                Map.of("id", "P005", "name", "Set đồ thể thao nữ", "price", 380000, "stock", 8, "sold", 55, "rating", 4.5)
            )
        );
    }

    public Map<String, Object> getInventory(Long shopId, ShopPlatform platform, String productId) {
        return Map.of(
            "productId", productId,
            "platform", platform.name(),
            "lowStock", List.of(
                Map.of("id", "P003", "name", "Váy hoa nhí nữ", "stock", 0, "alert", "HẾT HÀNG"),
                Map.of("id", "P005", "name", "Set đồ thể thao nữ", "stock", 8, "alert", "SắP HẾT"),
                Map.of("id", "P002", "name", "Quần jean slim fit nam", "stock", 12, "alert", "SắP HẾT")
            ),
            "totalProducts", 28,
            "outOfStock", 1,
            "lowStockCount", 3
        );
    }

    public Map<String, Object> getTopProducts(Long shopId, ShopPlatform platform, String period) {
        return Map.of(
            "platform", platform.name(),
            "period", period,
            "topByRevenue", List.of(
                Map.of("rank", 1, "name", "Áo thun basic unisex", "revenue", 12_480_000, "sold", 312),
                Map.of("rank", 2, "name", "Áo polo nam cao cấp", "revenue", 9_660_000, "sold", 201),
                Map.of("rank", 3, "name", "Quần jean slim fit nam", "revenue", 8_820_000, "sold", 98)
            )
        );
    }
}
