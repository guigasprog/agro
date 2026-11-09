package analiseClimatica.domain.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum TipoOperacao {

    MAPEAMENTO("M"),
    PLANTIO("P"),
    COLHEITA("C"),
    APLICAR_INSUMO("A");

    private final String tipoOperacao;

}
