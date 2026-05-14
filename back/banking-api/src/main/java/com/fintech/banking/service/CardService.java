package com.fintech.banking.service;

import com.fintech.banking.dto.request.CreateCardRequest;
import com.fintech.banking.dto.response.CardResponse;

import java.util.List;
import java.util.UUID;

public interface CardService {
    List<CardResponse> getMyCards(String email);
    CardResponse createCard(String email, CreateCardRequest request);
    void deleteCard(String email, UUID cardId);
}
