package analiseClimatica.domain.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum TipoLimite {

    TEMPERATURA("T","Temperatura","°C"),
    UMIDADE("U","Umidade","%"),
    VENTO("V","Vento","km/h"),
    VISIBILIDADE("L","Iluminação","");

    private final String TipoLimite;
    private final String descricao;
    private final String unidadeMedida;

}
