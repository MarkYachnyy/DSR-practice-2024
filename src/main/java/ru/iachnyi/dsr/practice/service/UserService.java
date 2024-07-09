package ru.iachnyi.dsr.practice.service;

import java.util.Collections;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import ru.iachnyi.dsr.practice.entity.Role;
import ru.iachnyi.dsr.practice.entity.User;
import ru.iachnyi.dsr.practice.repository.UserRepository;

@Service
public class UserService implements UserDetailsService{

    private static final Logger log = LoggerFactory.getLogger(UserService.class);
    @Autowired
	UserRepository userRepository;
	
	@Autowired
	BCryptPasswordEncoder bCryptPasswordEncoder;
	
	public boolean saveUser(User user) {
        User userFromDB = userRepository.findByName(user.getUsername()).orElse(null);
        if (userFromDB != null) {
            return false;
        }

        user.setRoles(Collections.singleton(new Role(1L, "ROLE_USER")));
        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        userRepository.save(user);
        return true;
    }

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		return userRepository.findByName(username).orElseThrow(() -> new UsernameNotFoundException(username));
	}
}
