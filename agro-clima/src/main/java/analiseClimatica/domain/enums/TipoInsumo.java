package analiseClimatica.domain.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum TipoInsumo {

    SEMENTE("S"),
    MUDA("M"),
    QUIMICO("Q");

    private final String tipoInsumo;

}
