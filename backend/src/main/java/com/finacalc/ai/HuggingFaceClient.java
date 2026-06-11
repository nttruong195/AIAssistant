package com.finacalc.ai;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

/**
 * HuggingFace Inference API — Qwen 2.5 72B Instruct
 * Docs: https://huggingface.co/docs/api-inference
 * Free: miễn phí với HF token, rate limit thấp
 * API tương thích OpenAI format
 */
@Component
public class HuggingFaceClient implements AiClient {

    private static final Logger log = LoggerFactory.getLogger(HuggingFaceClient.class);
    private static final String BASE_URL = "https://api-inference.huggingface.co";
    private static final String MODEL = "Qwen/Qwen2.5-72B-Instruct";

    @Value("${ai.huggingface.api-key:}")
    private String apiKey;

    private final WebClient webClient;

    public HuggingFaceClient(WebClient.Builder builder) {
        this.webClient = builder.baseUrl(BASE_URL).build();
    }

    @Override
    public AiProvider getProvider() { return AiProvider.HUGGINGFACE; }

    @Override
    public boolean isAvailable() { return apiKey != null && !apiKey.isBlank(); }

    @Override
    public String complete(String prompt) {
        Map<String, Object> body = Map.of(
                "model", MODEL,
                "messages", List.of(Map.of("role", "user", "content", prompt)),
                "max_tokens", 2048
        );

        Map<?, ?> response = webClient.post()
                .uri("/v1/chat/completions")
                .header("Authorization", "Bearer " + apiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(body)
                .retrieve()
                .bodyToMono(Map.class)
                .block();

        return extractOpenAiText(response);
    }

    @SuppressWarnings("unchecked")
    private String extractOpenAiText(Map<?, ?> response) {
        try {
            var choices = (List<?>) response.get("choices");
            var first   = (Map<?, ?>) choices.get(0);
            var message = (Map<?, ?>) first.get("message");
            return (String) message.get("content");
        } catch (Exception e) {
            log.error("HuggingFace parse error: {}", response);
            throw new RuntimeException("HuggingFace response parse failed");
        }
    }
}
