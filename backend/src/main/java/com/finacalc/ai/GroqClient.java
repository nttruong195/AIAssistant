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
 * Groq — LLaMA 3.3 70B
 * Docs: https://console.groq.com/docs/openai
 * Free: 30 req/phút, 6,000 req/ngày
 * API tương thích OpenAI format
 */
@Component
public class GroqClient implements AiClient {

    private static final Logger log = LoggerFactory.getLogger(GroqClient.class);
    private static final String BASE_URL = "https://api.groq.com";
    private static final String MODEL = "llama-3.3-70b-versatile";

    @Value("${ai.groq.api-key:}")
    private String apiKey;

    private final WebClient webClient;

    public GroqClient(WebClient.Builder builder) {
        this.webClient = builder.baseUrl(BASE_URL).build();
    }

    @Override
    public AiProvider getProvider() { return AiProvider.GROQ; }

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
                .uri("/openai/v1/chat/completions")
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
            var first = (Map<?, ?>) choices.get(0);
            var message = (Map<?, ?>) first.get("message");
            return (String) message.get("content");
        } catch (Exception e) {
            log.error("Groq parse error: {}", response);
            throw new RuntimeException("Groq response parse failed");
        }
    }
}
