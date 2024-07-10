package ru.iachnyi.dsr.practice.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.iachnyi.dsr.practice.security.SecurityUtils;

@RestController
public class AuthController {

    @Autowired
    private SecurityUtils securityUtils;

    @GetMapping("/api/auth/name")
    public String getAuthName() {
        return securityUtils.getCurrentUserName();
    }
}
