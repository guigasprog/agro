package analiseClimatica.infra.web.response.equipamento;

import analiseClimatica.infra.persistence.entity.LimiteEntity;
import analiseClimatica.infra.persistence.entity.equipamento.EquipamentoEntity;
import analiseClimatica.infra.web.response.LimiteDTO;
import analiseClimatica.domain.enums.TipoEquipamento;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
// 1. Diz ao Jackson para olhar para a propriedade "tipoEquipamento" no JSON
@JsonTypeInfo(
        use = JsonTypeInfo.Id.NAME,
        include = JsonTypeInfo.As.EXISTING_PROPERTY,
        property = "tipoEquipamento",
        visible = true,
        defaultImpl = EquipamentoDTO.class
)
// 2. Mapeia a palavra do JSON para a classe Java correspondente
@JsonSubTypes({
        @JsonSubTypes.Type(value = TratorDTO.class, name = "TRATOR"),
        @JsonSubTypes.Type(value = ImplementoDTO.class, name = "IMPLEMENTO")
})
@Getter
@Setter
@NoArgsConstructor
public class EquipamentoDTO {

    private UUID id;
    private String nome;
    private String nomeFabricante;
    private Double pesoTotal;
    private TipoEquipamento tipoEquipamento;
    private List<LimiteDTO> limiteList;

    public EquipamentoDTO(EquipamentoEntity entity){
        this.id = entity.getId();
        this.nome = entity.getNome();
        this.nomeFabricante = entity.getNomeFabricante();
        this.pesoTotal = entity.getPesoTotal();
        this.tipoEquipamento = entity.getTipoEquipamento();
        this.limiteList = entity.getLimites().stream().map(LimiteDTO::new).collect(Collectors.toList());
    }

    public EquipamentoDTO(UUID id, String nome, String nomeFabricante, Double pesoTotal, TipoEquipamento tipoEquipamento, List<LimiteEntity> limiteList) {
        this.id = id;
        this.nome = nome;
        this.nomeFabricante = nomeFabricante;
        this.pesoTotal = pesoTotal;
        this.tipoEquipamento = tipoEquipamento;
        this.limiteList = limiteList.stream().map(LimiteDTO::new).collect(Collectors.toList());
    }
    public EquipamentoDTO(UUID id, String nome, String nomeFabricante, Double pesoTotal, TipoEquipamento tipoEquipamento) {
        this.id = id;
        this.nome = nome;
        this.nomeFabricante = nomeFabricante;
        this.pesoTotal = pesoTotal;
        this.tipoEquipamento = tipoEquipamento;
    }
}
