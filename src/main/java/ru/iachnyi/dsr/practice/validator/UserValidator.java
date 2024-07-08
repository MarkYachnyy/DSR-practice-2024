package ru.iachnyi.dsr.practice.validator;

import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.ValidationUtils;
import org.springframework.validation.Validator;

import ru.iachnyi.dsr.practice.entity.User;

@Component
public class UserValidator implements Validator{

	@Override
	public boolean supports(Class<?> clazz) {
		return clazz.equals(User.class);
	}

	@Override
	public void validate(Object target, Errors errors) {
		User to_val = (User) target;
		int name_len = to_val.getName().trim().length();
		if(name_len < 5 || name_len > 20) {
			errors.rejectValue("name", null, "Имя должно иметь длину от 5 до 20 символов");
		}
		int pass_len = to_val.getPassword().trim().length();
		if(pass_len < 8 || pass_len > 16) {
			errors.rejectValue("password", null, "Пароль должен иметь длину от 8 до 16 символов");
		}
		if(!to_val.getPassword().equals(to_val.getPasswordConfirm())) {
			errors.rejectValue("passwordConfirm", null, "Пароли не совпадают");
		}
	}
	
}
