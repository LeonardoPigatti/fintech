package com.fintech.banking.service.impl;

import com.fintech.banking.domain.entity.Account;
import com.fintech.banking.dto.response.AccountResponse;
import com.fintech.banking.repository.AccountRepository;
import com.fintech.banking.repository.UserRepository;
import com.fintech.banking.service.AccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AccountServiceImpl implements AccountService {

    private final AccountRepository accountRepository;
    private final UserRepository userRepository;

    @Override
    public AccountResponse getMyAccount(String email) {
        var user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));

        var accounts = accountRepository.findByUserId(user.getId());
        if (accounts.isEmpty()) {
            throw new IllegalArgumentException("Conta não encontrada");
        }

        Account account = accounts.get(0);

        return AccountResponse.builder()
                .id(account.getId())
                .agency(account.getAgency())
                .number(account.getNumber())
                .balance(account.getBalance())
                .status(account.getStatus())
                .ownerName(user.getName())
                .createdAt(account.getCreatedAt())
                .build();
    }
}
