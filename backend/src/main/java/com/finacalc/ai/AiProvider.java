package com.finacalc.ai;

public enum AiProvider {
    GEMINI,      // Google Gemini 2.0 Flash     — 1,500 req/ngày
    GROQ,        // Groq LLaMA 3.3 70B          — 6,000 req/ngày
    TOGETHER,    // Together AI Llama 3.3 70B   — free model :free
    HUGGINGFACE, // HuggingFace Qwen 2.5 72B    — free inference API
    COHERE,      // Cohere Command R7B           — 1,000 req/tháng
    OPENROUTER   // OpenRouter Gemma 3 27B       — backup cuối
}
