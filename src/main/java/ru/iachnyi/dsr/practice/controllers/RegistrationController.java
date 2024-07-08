package ru.iachnyi.dsr.practice.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

import jakarta.validation.Valid;
import ru.iachnyi.dsr.practice.entity.User;
import ru.iachnyi.dsr.practice.service.UserService;
import ru.iachnyi.dsr.practice.validator.UserValidator;

@Controller
public class RegistrationController {
	
	@Autowired
	UserService userService;
	
	@Autowired
	UserValidator userValidator;
	
	@PostMapping("/register")
	public String registerUser(@ModelAttribute("user") @Valid User user, BindingResult result) {
		userValidator.validate(user, result);
		if(result.hasErrors()) return "register";
		
		if(!userService.saveUser(user)) {
			result.rejectValue("name", null, "Пользователь с таким именем уже существует");
			return "register";
		}
		return "redirect:/login";
	}
	
	@GetMapping("/register")
	public String getRegisterPage(Model model) {
		model.addAttribute("user", new User());
		return "register";
	}
}
