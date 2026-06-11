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
 * Cohere — Command R7B
 * Docs: https://docs.cohere.com/reference/chat
 * Free: 1,000 req/tháng (trial key)
 * API tương thích OpenAI format (v2)
 */
@Component
public class CohereClient implements AiClient {

    private static final Logger log = LoggerFactory.getLogger(CohereClient.class);
    private static final String BASE_URL = "https://api.cohere.com";
    private static final String MODEL = "command-r7b-12-2024";

    @Value("${ai.cohere.api-key:}")
    private String apiKey;

    private final WebClient webClient;

    public CohereClient(WebClient.Builder builder) {
        this.webClient = builder.baseUrl(BASE_URL).build();
    }

    @Override
    public AiProvider getProvider() { return AiProvider.COHERE; }

    @Override
    public boolean isAvailable() { return apiKey != null && !apiKey.isBlank(); }

    @Override
    public String complete(String prompt) {
        Map<String, Object> body = Map.of(
                "model", MODEL,
                "messages", List.of(Map.of("role", "user", "content", prompt))
        );

        Map<?, ?> response = webClient.post()
                .uri("/v2/chat")
                .header("Authorization", "Bearer " + apiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(body)
                .retrieve()
                .bodyToMono(Map.class)
                .block();

        return extractCohereText(response);
    }

    @SuppressWarnings("unchecked")
    private String extractCohereText(Map<?, ?> response) {
        try {
            var message = (Map<?, ?>) response.get("message");
            var content = (List<?>) message.get("content");
            var first   = (Map<?, ?>) content.get(0);
            return (String) first.get("text");
        } catch (Exception e) {
            log.error("Cohere parse error: {}", response);
            throw new RuntimeException("Cohere response parse failed");
        }
    }
}
