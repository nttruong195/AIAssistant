package com.finacalc.shop.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "shops")
public class Shop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String ownerEmail;

    @Column(nullable = false)
    private String shopName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ShopPlatform platform;

    private String platformShopId;   // shop_id từ Shopee/TikTok

    @Column(columnDefinition = "TEXT")
    private String accessToken;

    @Column(columnDefinition = "TEXT")
    private String refreshToken;

    private Instant tokenExpiresAt;

    private Instant createdAt = Instant.now();

    // Getters & Setters
    public Long getId() { return id; }
    public String getOwnerEmail() { return ownerEmail; }
    public void setOwnerEmail(String ownerEmail) { this.ownerEmail = ownerEmail; }
    public String getShopName() { return shopName; }
    public void setShopName(String shopName) { this.shopName = shopName; }
    public ShopPlatform getPlatform() { return platform; }
    public void setPlatform(ShopPlatform platform) { this.platform = platform; }
    public String getPlatformShopId() { return platformShopId; }
    public void setPlatformShopId(String platformShopId) { this.platformShopId = platformShopId; }
    public String getAccessToken() { return accessToken; }
    public void setAccessToken(String accessToken) { this.accessToken = accessToken; }
    public String getRefreshToken() { return refreshToken; }
    public void setRefreshToken(String refreshToken) { this.refreshToken = refreshToken; }
    public Instant getTokenExpiresAt() { return tokenExpiresAt; }
    public void setTokenExpiresAt(Instant tokenExpiresAt) { this.tokenExpiresAt = tokenExpiresAt; }
    public Instant getCreatedAt() { return createdAt; }
}
