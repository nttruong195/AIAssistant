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
 * Google Gemini 2.0 Flash
 * Docs: https://ai.google.dev/api/generate-content
 * Free: 1,500 req/ngày, 1M tokens/phút
 */
@Component
public class GeminiClient implements AiClient {

    private static final Logger log = LoggerFactory.getLogger(GeminiClient.class);
    private static final String BASE_URL = "https://generativelanguage.googleapis.com";
    private static final String MODEL = "gemini-2.0-flash";

    @Value("${ai.gemini.api-key:}")
    private String apiKey;

    private final WebClient webClient;

    public GeminiClient(WebClient.Builder builder) {
        this.webClient = builder.baseUrl(BASE_URL).build();
    }

    @Override
    public AiProvider getProvider() { return AiProvider.GEMINI; }

    @Override
    public boolean isAvailable() { return apiKey != null && !apiKey.isBlank(); }

    @Override
    public String complete(String prompt) {
        Map<String, Object> body = Map.of(
                "contents", List.of(
                        Map.of("parts", List.of(Map.of("text", prompt)))
                )
        );

        var response = webClient.post()
                .uri("/v1beta/models/" + MODEL + ":generateContent?key=" + apiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(body)
                .retrieve()
                .bodyToMono(Map.class)
                .block();

        return extractGeminiText(response);
    }

    @SuppressWarnings("unchecked")
    private String extractGeminiText(Map<?, ?> response) {
        try {
            var candidates = (List<?>) response.get("candidates");
            var first = (Map<?, ?>) candidates.get(0);
            var content = (Map<?, ?>) first.get("content");
            var parts = (List<?>) content.get("parts");
            var part = (Map<?, ?>) parts.get(0);
            return (String) part.get("text");
        } catch (Exception e) {
            log.error("Gemini parse error: {}", response);
            throw new RuntimeException("Gemini response parse failed");
        }
    }
}
