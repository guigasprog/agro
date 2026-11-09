package analiseClimatica.infra.web.response.equipamento;

import analiseClimatica.domain.enums.TipoEquipamento;
import analiseClimatica.infra.persistence.entity.equipamento.ImplementoEntity;
import analiseClimatica.infra.persistence.entity.equipamento.TratorEntity;
import analiseClimatica.infra.web.response.LimiteDTO;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
public class ImplementoDTO extends EquipamentoDTO {

    private String tipoImplemento;

    public ImplementoDTO(UUID id, String nome, String nomeFabricante, Double pesoTotal, TipoEquipamento tipoEquipamento, String tipoImplemento, List<LimiteDTO> limiteList) {
        super(id, nome, nomeFabricante, pesoTotal, tipoEquipamento);
        super.setLimiteList(limiteList);
        this.tipoImplemento = tipoImplemento;
    }
    public ImplementoDTO(ImplementoEntity entity) {
        super(entity.getId(), entity.getNome(), entity.getNomeFabricante(), entity.getPesoTotal(), entity.getTipoEquipamento(),entity.getLimites());
        this.tipoImplemento = entity.getTipoImplemento();
    }
}