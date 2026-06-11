package com.finacalc.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class ContactService {

    private static final Logger log = LoggerFactory.getLogger(ContactService.class);

    private final JavaMailSender mailSender;

    @Value("${app.mail.to}")
    private String mailTo;

    @Value("${spring.mail.username:}")
    private String mailFrom;

    public ContactService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void send(String senderName, String senderEmail, String subject, String message) {
        SimpleMailMessage mail = new SimpleMailMessage();
        mail.setFrom(mailFrom);
        mail.setTo(mailTo);
        mail.setReplyTo(senderEmail);
        mail.setSubject("[CareerAI] " + subject);
        mail.setText("""
                Góp ý từ: %s <%s>

                %s
                """.formatted(senderName, senderEmail, message));

        mailSender.send(mail);
        log.info("Contact email sent from {} <{}>", senderName, senderEmail);
    }
}
