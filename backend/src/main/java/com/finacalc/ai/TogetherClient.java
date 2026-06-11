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
 * Together AI — Llama 3.3 70B Instruct Turbo Free
 * Docs: https://docs.together.ai/docs/openai-api-compatibility
 * Free: model có tag :free, $25 credits khi đăng ký mới
 * API tương thích OpenAI format
 */
@Component
public class TogetherClient implements AiClient {

    private static final Logger log = LoggerFactory.getLogger(TogetherClient.class);
    private static final String BASE_URL = "https://api.together.xyz";
    private static final String MODEL = "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free";

    @Value("${ai.together.api-key:}")
    private String apiKey;

    private final WebClient webClient;

    public TogetherClient(WebClient.Builder builder) {
        this.webClient = builder.baseUrl(BASE_URL).build();
    }

    @Override
    public AiProvider getProvider() { return AiProvider.TOGETHER; }

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
            log.error("Together parse error: {}", response);
            throw new RuntimeException("Together response parse failed");
        }
    }
}
