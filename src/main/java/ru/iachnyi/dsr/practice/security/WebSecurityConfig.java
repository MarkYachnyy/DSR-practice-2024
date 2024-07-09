package ru.iachnyi.dsr.practice.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig {
	
	@Autowired
	private CustomAuthenticationProvider authProvider;
	
	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		return http.anonymous(AbstractHttpConfigurer::disable).
				httpBasic(Customizer.withDefaults()).
				authorizeHttpRequests(auth -> auth
				/*.requestMatchers("/welcome", "/login", "/register").permitAll()
				.requestMatchers("/admin").hasAuthority("ROLE_ADMIN")
				.requestMatchers("/profile").authenticated()*/
						.anyRequest().permitAll())
				.csrf(AbstractHttpConfigurer::disable)
				.formLogin(form -> form.loginPage("/login").defaultSuccessUrl("/profile").permitAll()).build();
	}
	
	
	@Bean
    public AuthenticationManager authManager(HttpSecurity http) throws Exception {
        AuthenticationManagerBuilder authenticationManagerBuilder = 
            http.getSharedObject(AuthenticationManagerBuilder.class);
        authenticationManagerBuilder.authenticationProvider(authProvider);
        return authenticationManagerBuilder.build();
    }
}