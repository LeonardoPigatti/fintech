package com.fintech.banking.dto.request;

import com.fintech.banking.domain.enums.InvestmentType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreateInvestmentRequest {

    @NotNull(message = "Tipo de investimento \u00e9 obrigat\u00f3rio")
    private InvestmentType investmentType;

    @NotNull(message = "Valor \u00e9 obrigat\u00f3rio")
    @DecimalMin(value = "1.00", message = "Valor m\u00ednimo \u00e9 R$ 1,00")
    private BigDecimal amount;
}
