package com.finacalc.controller;

import com.finacalc.service.ContactService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/contact")
public class ContactController {

    private final ContactService contactService;

    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    @PostMapping
    public ResponseEntity<Void> send(@Valid @RequestBody ContactRequest request) {
        contactService.send(request.name(), request.email(), request.subject(), request.message());
        return ResponseEntity.ok().build();
    }

    record ContactRequest(
            @NotBlank @Size(max = 100) String name,
            @NotBlank @Email String email,
            @NotBlank @Size(max = 200) String subject,
            @NotBlank @Size(max = 2000) String message
    ) {}
}
