package com.fintech.banking.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ChangePasswordRequest {

    @NotBlank(message = "Senha atual \u00e9 obrigat\u00f3ria")
    private String currentPassword;

    @NotBlank(message = "Nova senha \u00e9 obrigat\u00f3ria")
    @Size(min = 6, message = "Nova senha deve ter no m\u00ednimo 6 caracteres")
    private String newPassword;
}
