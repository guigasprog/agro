package analiseClimatica.infra.persistence.entity;

import analiseClimatica.domain.enums.TexturaSolo;
import analiseClimatica.domain.model.Solo;
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
@Entity
@Table(name = "solo")
public class SoloEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;
    private String nome;
    private TexturaSolo texturaSolo;
    private Double resistenciaMaximaEstruturalSolo;//(MPa)
    private Double taxaDecaimentoSolo;//(MPa)
    private Double limiarDureza;//(Mg m-³)
    private Double limiarPlasticidade;//(Mg m-³)
    private Double densidade;// (g/cm³)
    public SoloEntity(Solo solo) {
        this.id = solo.getId();
        this.nome = solo.getNome();
        this.texturaSolo = solo.getTextutaSolo();
        this.resistenciaMaximaEstruturalSolo = solo.getResistenciaMaximaEstruturalSolo();
        this.taxaDecaimentoSolo = solo.getTaxaDecaimentoSolo();
        this.limiarDureza = solo.getLimiarDureza();
        this.limiarPlasticidade = solo.getLimiarPlasticidade();
        this.densidade = solo.getDensidade();
    }
}
