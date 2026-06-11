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
 * OpenRouter — nhiều model free (Gemma, Mistral, Llama...)
 * Docs: https://openrouter.ai/docs
 * Free: một số model miễn phí không giới hạn (rate limit thấp hơn)
 * API tương thích OpenAI format
 */
@Component
public class OpenRouterClient implements AiClient {

    private static final Logger log = LoggerFactory.getLogger(OpenRouterClient.class);
    private static final String BASE_URL = "https://openrouter.ai";
    private static final String MODEL = "google/gemma-3-27b-it:free"; // model free trên OpenRouter

    @Value("${ai.openrouter.api-key:}")
    private String apiKey;

    private final WebClient webClient;

    public OpenRouterClient(WebClient.Builder builder) {
        this.webClient = builder.baseUrl(BASE_URL).build();
    }

    @Override
    public AiProvider getProvider() { return AiProvider.OPENROUTER; }

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
                .uri("/api/v1/chat/completions")
                .header("Authorization", "Bearer " + apiKey)
                .header("HTTP-Referer", "http://localhost:5173")
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
            var first = (Map<?, ?>) choices.get(0);
            var message = (Map<?, ?>) first.get("message");
            return (String) message.get("content");
        } catch (Exception e) {
            log.error("OpenRouter parse error: {}", response);
            throw new RuntimeException("OpenRouter response parse failed");
        }
    }
}
