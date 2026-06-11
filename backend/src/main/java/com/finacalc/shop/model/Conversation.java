package com.finacalc.shop.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "conversations")
public class Conversation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long shopId;

    @Enumerated(EnumType.STRING)
    private MessageRole role; // USER, ASSISTANT

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    private Instant createdAt = Instant.now();

    public enum MessageRole { USER, ASSISTANT }

    // Getters & Setters
    public Long getId() { return id; }
    public Long getShopId() { return shopId; }
    public void setShopId(Long shopId) { this.shopId = shopId; }
    public MessageRole getRole() { return role; }
    public void setRole(MessageRole role) { this.role = role; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public Instant getCreatedAt() { return createdAt; }
}
