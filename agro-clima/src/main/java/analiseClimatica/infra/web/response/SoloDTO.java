package analiseClimatica.infra.web.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SoloDTO {
    private UUID id;
    private String nome;
    private String texturaSolo;
    private Double resistenciaMaximaEstruturalSolo;
    private Double taxaDecaimentoSolo;
    private Double limiarDureza;
    private Double limiarPlasticidade;
    private Double densidade;

    public String getTexturaSolo() {
        return texturaSolo.toUpperCase();
    }
}
