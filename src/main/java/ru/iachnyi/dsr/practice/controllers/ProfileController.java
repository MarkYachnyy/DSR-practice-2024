package ru.iachnyi.dsr.practice.controllers;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;

@Controller
public class ProfileController {
	@GetMapping("/profile")
	public String getProfilePage(Model model) {
		model.addAttribute("name", SecurityContextHolder.getContext().getAuthentication().getName());
		return "profile";
	}
}
