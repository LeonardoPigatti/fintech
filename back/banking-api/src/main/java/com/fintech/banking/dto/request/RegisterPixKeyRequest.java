package com.fintech.banking.dto.request;

import com.fintech.banking.domain.enums.PixKeyType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RegisterPixKeyRequest {

    @NotNull(message = "Tipo de chave é obrigatório")
    private PixKeyType keyType;

    @NotBlank(message = "Valor da chave é obrigatório")
    private String keyValue;
}
