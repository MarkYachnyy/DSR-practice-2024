package ru.iachnyi.dsr.practice.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import ru.iachnyi.dsr.practice.entity.Spending;
import ru.iachnyi.dsr.practice.repository.SpendingRepository;
import ru.iachnyi.dsr.practice.repository.UserRepository;
import ru.iachnyi.dsr.practice.response_classes.SpendingResponse;
import ru.iachnyi.dsr.practice.security.SecurityUtils;
import ru.iachnyi.dsr.practice.service.SpendingService;
import ru.iachnyi.dsr.practice.service.UserService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@RestController
public class SpendingsController {

    @Autowired
    SecurityUtils securityUtils;

    @Autowired
    SpendingService spendingService;

    @Autowired
    UserRepository userRepository;

    @GetMapping("/api/spendings/all")
    public List<SpendingResponse> getAllSpendings() {
        return spendingService.getAllSpendingsByUserId(securityUtils.getCurrentUserId()).
                stream().map(this::boxSpending).collect(Collectors.toList());
    }

    @GetMapping("/api/spendings/{id}")
    public SpendingResponse getSpendingById(@PathVariable int id) {
        return null;
    }

    private SpendingResponse boxSpending(Spending spending) {
        SpendingResponse spendingResponse = new SpendingResponse();
        spendingResponse.setId(spending.getId());
        spendingResponse.setCreatorName(userRepository.findById(spending.getCreatorId()).get().getName());
        spendingResponse.setPayerName(userRepository.findById(spending.getPayerId()).get().getName());
        spendingResponse.setDate(spending.getDate().toString());
        spendingResponse.setName(spending.getName());
        Map<String, Integer> debts = new HashMap<>();
        spending.getDebts().forEach(debt -> debts.put(userRepository.findById(debt.getId().getUserId()).get().getName(), debt.getAmount()));
        spendingResponse.setDebts(debts);
        return spendingResponse;
    }
}
