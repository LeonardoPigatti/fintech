package com.fintech.banking.service.impl;

import com.fintech.banking.domain.entity.Account;
import com.fintech.banking.domain.entity.RefreshToken;
import com.fintech.banking.domain.entity.User;
import com.fintech.banking.dto.request.LoginRequest;
import com.fintech.banking.dto.request.RefreshTokenRequest;
import com.fintech.banking.dto.request.RegisterRequest;
import com.fintech.banking.dto.response.TokenResponse;
import com.fintech.banking.repository.AccountRepository;
import com.fintech.banking.repository.RefreshTokenRepository;
import com.fintech.banking.repository.UserRepository;
import com.fintech.banking.security.service.JwtService;
import com.fintech.banking.service.AuditLogService;
import com.fintech.banking.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.time.LocalDateTime;
import java.util.Random;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final AuditLogService auditLogService;

    private String getClientIp() {
        try {
            ServletRequestAttributes attrs = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attrs != null) {
                HttpServletRequest request = attrs.getRequest();
                String xff = request.getHeader("X-Forwarded-For");
                return xff != null ? xff.split(",")[0].trim() : request.getRemoteAddr();
            }
        } catch (Exception ignored) {}
        return "unknown";
    }

    private TokenResponse buildTokenResponse(User user) {
        String accessToken = jwtService.generateToken(user);
        String refreshTokenValue = UUID.randomUUID().toString();

        RefreshToken refreshToken = RefreshToken.builder()
                .user(user)
                .token(refreshTokenValue)
                .expiresAt(LocalDateTime.now().plusDays(7))
                .build();

        refreshTokenRepository.save(refreshToken);

        return TokenResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshTokenValue)
                .tokenType("Bearer")
                .expiresIn(86400000L)
                .build();
    }

    @Override
    @Transactional
    public TokenResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            auditLogService.logFailure(request.getEmail(), "REGISTER", "Email já cadastrado", getClientIp());
            throw new IllegalArgumentException("Email já cadastrado");
        }
        if (userRepository.existsByCpf(request.getCpf())) {
            auditLogService.logFailure(request.getEmail(), "REGISTER", "CPF já cadastrado", getClientIp());
            throw new IllegalArgumentException("CPF já cadastrado");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .cpf(request.getCpf())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();

        userRepository.save(user);

        Account account = Account.builder()
                .user(user)
                .agency("0001")
                .number(generateAccountNumber())
                .build();

        accountRepository.save(account);

        auditLogService.log(user.getEmail(), "REGISTER", "User", user.getId().toString(), "Novo usuário registrado", getClientIp());

        return buildTokenResponse(user);
    }

    @Override
    @Transactional
    public TokenResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
        } catch (Exception e) {
            auditLogService.logFailure(request.getEmail(), "LOGIN", "Credenciais inválidas", getClientIp());
            throw e;
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));

        refreshTokenRepository.revokeAllByUserId(user.getId());

        auditLogService.log(user.getEmail(), "LOGIN", "User", user.getId().toString(), "Login realizado", getClientIp());

        return buildTokenResponse(user);
    }

    @Override
    @Transactional
    public TokenResponse refresh(RefreshTokenRequest request) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(request.getRefreshToken())
                .orElseThrow(() -> new IllegalArgumentException("Refresh token inválido"));

        if (!refreshToken.isValid()) {
            auditLogService.logFailure(refreshToken.getUser().getEmail(), "REFRESH_TOKEN", "Token expirado ou revogado", getClientIp());
            throw new IllegalArgumentException("Refresh token expirado ou revogado");
        }

        refreshToken.setRevoked(true);
        refreshTokenRepository.save(refreshToken);

        User user = refreshToken.getUser();
        auditLogService.log(user.getEmail(), "REFRESH_TOKEN", "User", user.getId().toString(), "Token renovado", getClientIp());

        return buildTokenResponse(user);
    }

    @Override
    @Transactional
    public void logout(RefreshTokenRequest request) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(request.getRefreshToken())
                .orElseThrow(() -> new IllegalArgumentException("Refresh token inválido"));

        refreshToken.setRevoked(true);
        refreshTokenRepository.save(refreshToken);

        auditLogService.log(refreshToken.getUser().getEmail(), "LOGOUT", "User", refreshToken.getUser().getId().toString(), "Logout realizado", getClientIp());
    }

    private String generateAccountNumber() {
        Random random = new Random();
        return String.format("%08d", random.nextInt(99999999));
    }
}