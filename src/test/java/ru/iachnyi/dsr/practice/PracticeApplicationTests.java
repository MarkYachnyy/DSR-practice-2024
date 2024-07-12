package ru.iachnyi.dsr.practice;

import org.hibernate.mapping.Collection;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import ru.iachnyi.dsr.practice.entity.Spending;
import ru.iachnyi.dsr.practice.entity.debt.Debt;
import ru.iachnyi.dsr.practice.entity.debt.DebtId;
import ru.iachnyi.dsr.practice.repository.SpendingRepository;
import ru.iachnyi.dsr.practice.service.SpendingService;

import java.sql.Date;
import java.time.LocalDate;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import java.util.stream.Stream;

@SpringBootTest
class PracticeApplicationTests {

	@Autowired
	SpendingService spendingService;

	@Test
	void contextLoads() {
	}

	@Test
	void addSpendingFunny(){
		Spending spending = new Spending();
		spending.setDate(Date.valueOf(LocalDate.now()));
		spending.setName("Поход Марков");
		spending.setPayerId((long) 8);
		spending.setCreatorId((long) 8);
		spending.setDebts(new HashSet<>());
		spending.getDebts().addAll(List.of(new Debt(8L, 100), new Debt(9L, 200), new Debt(10L, 300), new Debt(12L, 500)));
		spendingService.save(spending);
	}

}
