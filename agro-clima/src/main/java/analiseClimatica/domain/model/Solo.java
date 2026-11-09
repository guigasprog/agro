package analiseClimatica.domain.model;

import analiseClimatica.domain.enums.TexturaSolo;
import analiseClimatica.infra.persistence.entity.SoloEntity;
import analiseClimatica.infra.web.response.SoloDTO;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Solo {
    private UUID id;
    private String nome;
    private TexturaSolo textutaSolo;
    private Double resistenciaMaximaEstruturalSolo;
    private Double taxaDecaimentoSolo;
    private Double limiarDureza;
    private Double limiarPlasticidade;
    private Double densidade;

    public Solo(SoloEntity entity) {
        this.id = entity.getId();
        this.nome = entity.getNome();
        this.textutaSolo = entity.getTexturaSolo();
        this.resistenciaMaximaEstruturalSolo = entity.getResistenciaMaximaEstruturalSolo();
        this.taxaDecaimentoSolo = entity.getTaxaDecaimentoSolo();
        this.limiarDureza = entity.getLimiarDureza();
        this.limiarPlasticidade = entity.getLimiarPlasticidade();
        this.densidade = entity.getDensidade();
    }
    public Solo(SoloDTO dto) {
        this.id = dto.getId();
        this.nome = dto.getNome();
        this.textutaSolo = TexturaSolo.valueOf(dto.getTexturaSolo());
        this.resistenciaMaximaEstruturalSolo = dto.getResistenciaMaximaEstruturalSolo();
        this.taxaDecaimentoSolo = dto.getTaxaDecaimentoSolo();
        this.limiarDureza = dto.getLimiarDureza();
        this.limiarPlasticidade = dto.getLimiarPlasticidade();
        this.densidade = dto.getDensidade();
    }
}
