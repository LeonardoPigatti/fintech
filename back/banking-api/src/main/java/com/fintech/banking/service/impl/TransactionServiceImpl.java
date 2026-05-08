package com.fintech.banking.service.impl;

import com.fintech.banking.domain.entity.Account;
import com.fintech.banking.domain.entity.Transaction;
import com.fintech.banking.domain.enums.TransactionStatus;
import com.fintech.banking.domain.enums.TransactionType;
import com.fintech.banking.dto.request.TransactionRequest;
import com.fintech.banking.dto.response.TransactionResponse;
import com.fintech.banking.repository.AccountRepository;
import com.fintech.banking.repository.TransactionRepository;
import com.fintech.banking.repository.UserRepository;
import com.fintech.banking.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransactionServiceImpl implements TransactionService {

    private final TransactionRepository transactionRepository;
    private final AccountRepository accountRepository;
    private final UserRepository userRepository;

    private Account getAccountByEmail(String email) {
        var user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));
        var accounts = accountRepository.findByUserId(user.getId());
        if (accounts.isEmpty()) throw new IllegalArgumentException("Conta não encontrada");
        return accounts.get(0);
    }

    private TransactionResponse toResponse(Transaction t) {
        return TransactionResponse.builder()
                .id(t.getId())
                .amount(t.getAmount())
                .type(t.getType())
                .status(t.getStatus())
                .description(t.getDescription())
                .sourceAccountNumber(t.getSourceAccount() != null ? t.getSourceAccount().getNumber() : null)
                .targetAccountNumber(t.getTargetAccount() != null ? t.getTargetAccount().getNumber() : null)
                .createdAt(t.getCreatedAt())
                .build();
    }

    @Override
    @Transactional
    public TransactionResponse deposit(String email, TransactionRequest request) {
        Account account = getAccountByEmail(email);
        account.credit(request.getAmount());
        accountRepository.save(account);

        Transaction transaction = Transaction.builder()
                .targetAccount(account)
                .amount(request.getAmount())
                .type(TransactionType.DEPOSIT)
                .status(TransactionStatus.COMPLETED)
                .description(request.getDescription())
                .build();

        return toResponse(transactionRepository.save(transaction));
    }

    @Override
    @Transactional
    public TransactionResponse withdraw(String email, TransactionRequest request) {
        Account account = getAccountByEmail(email);
        account.debit(request.getAmount());
        accountRepository.save(account);

        Transaction transaction = Transaction.builder()
                .sourceAccount(account)
                .amount(request.getAmount())
                .type(TransactionType.WITHDRAWAL)
                .status(TransactionStatus.COMPLETED)
                .description(request.getDescription())
                .build();

        return toResponse(transactionRepository.save(transaction));
    }

    @Override
    @Transactional
    public TransactionResponse transfer(String email, TransactionRequest request) {
        Account source = getAccountByEmail(email);
        Account target = accountRepository.findByNumber(request.getTargetAccountNumber())
                .orElseThrow(() -> new IllegalArgumentException("Conta destino não encontrada"));

        source.debit(request.getAmount());
        target.credit(request.getAmount());
        accountRepository.save(source);
        accountRepository.save(target);

        Transaction transaction = Transaction.builder()
                .sourceAccount(source)
                .targetAccount(target)
                .amount(request.getAmount())
                .type(TransactionType.TRANSFER)
                .status(TransactionStatus.COMPLETED)
                .description(request.getDescription())
                .build();

        return toResponse(transactionRepository.save(transaction));
    }

    @Override
    public List<TransactionResponse> getHistory(String email) {
        Account account = getAccountByEmail(email);
        return transactionRepository.findAllByAccountId(account.getId())
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }
}
