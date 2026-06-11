package com.finacalc.ai;

/**
 * Interface chung cho mọi AI provider
 */
public interface AiClient {

    AiProvider getProvider();

    /**
     * Gọi AI và trả về full text response
     * Ném exception nếu lỗi / hết quota
     */
    String complete(String prompt);

    /**
     * Kiểm tra provider còn khả dụng không (có API key)
     */
    boolean isAvailable();
}
