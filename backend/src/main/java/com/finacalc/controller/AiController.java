package com.finacalc.controller;

import com.finacalc.ai.AiFallbackService;
import com.finacalc.service.FileTextExtractor;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.MediaType;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@RestController
@RequestMapping("/api/v1/ai")
@Validated
public class AiController {

    private final AiFallbackService aiFallbackService;
    private final FileTextExtractor fileTextExtractor;

    public AiController(AiFallbackService aiFallbackService, FileTextExtractor fileTextExtractor) {
        this.aiFallbackService = aiFallbackService;
        this.fileTextExtractor = fileTextExtractor;
    }

    /**
     * Phân tích CV (paste text)
     * POST /api/v1/ai/cv-analyze
     * Body: { "cvText": "..." }
     */
    @PostMapping(value = "/cv-analyze", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter analyzeCv(@RequestBody CvAnalyzeRequest request) {
        return aiFallbackService.analyzeCv(request.cvText());
    }

    /**
     * Phân tích CV (upload file PDF/DOCX/TXT)
     * POST /api/v1/ai/cv-analyze/upload
     * Form-data: file=...
     */
    @PostMapping(value = "/cv-analyze/upload",
                 consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
                 produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter analyzeCvFile(@RequestParam("file") MultipartFile file) throws Exception {
        String text = fileTextExtractor.extract(file);
        return aiFallbackService.analyzeCv(text);
    }

    /**
     * Tạo Cover Letter
     * POST /api/v1/ai/cover-letter
     * Body: { "jobDescription": "...", "candidateInfo": "..." }
     */
    @PostMapping(value = "/cover-letter", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter generateCoverLetter(@RequestBody CoverLetterRequest request) {
        return aiFallbackService.generateCoverLetter(request.jobDescription(), request.candidateInfo());
    }

    /**
     * Tạo Email
     * POST /api/v1/ai/email
     * Body: { "emailType": "xin nghỉ phép", "context": "..." }
     */
    @PostMapping(value = "/email", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter generateEmail(@RequestBody EmailRequest request) {
        return aiFallbackService.generateEmail(request.emailType(), request.context());
    }

    /**
     * Tạo Job Description
     * POST /api/v1/ai/jd
     * Body: { "position": "Senior Java Developer", "requirements": "..." }
     */
    @PostMapping(value = "/jd", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter generateJd(@RequestBody JdRequest request) {
        return aiFallbackService.generateJd(request.position(), request.requirements());
    }

    // ---- Request records ----

    record CvAnalyzeRequest(@NotBlank String cvText) {}

    record CoverLetterRequest(@NotBlank String jobDescription, @NotBlank String candidateInfo) {}

    record EmailRequest(@NotBlank String emailType, @NotBlank String context) {}

    record JdRequest(@NotBlank String position, String requirements) {}
}
