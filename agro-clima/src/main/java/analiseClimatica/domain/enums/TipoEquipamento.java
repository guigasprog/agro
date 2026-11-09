package analiseClimatica.domain.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum TipoEquipamento {

    DRONE("DRONE","Drone"),
    TRATOR("TRATOR","Trator"),
    AVIAO("AVIAO","Aviao"),
    IMPLEMENTO("IMPLEMENTO","Implemento");

    private final String tipoEquipamento;
    private final String descricao;

    public static TipoEquipamento fromCodigo(String codigo) {
        for (TipoEquipamento tipo : values()) {
            if (tipo.getTipoEquipamento().equals(codigo)) {
                return tipo;
            }
        }
        throw new IllegalArgumentException("Código inválido: " + codigo);
    }

}
