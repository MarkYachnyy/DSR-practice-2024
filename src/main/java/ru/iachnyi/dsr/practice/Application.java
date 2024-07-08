package ru.iachnyi.dsr.practice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@EnableMethodSecurity
@EnableWebSecurity
@SpringBootApplication
public class Application {
	public static void main(String[] args) {SpringApplication.run(Application.class, args);}
}
