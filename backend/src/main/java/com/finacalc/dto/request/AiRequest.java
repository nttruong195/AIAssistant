package com.finacalc.dto.request;

import jakarta.validation.constraints.NotBlank;

public record AiRequest(
        @NotBlank String content  // CV text / JD yêu cầu / email context
) {}
