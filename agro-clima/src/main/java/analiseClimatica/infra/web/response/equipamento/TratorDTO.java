package analiseClimatica.infra.web.response.equipamento;

import analiseClimatica.domain.enums.TipoEquipamento;
import analiseClimatica.infra.persistence.entity.LimiteEntity;
import analiseClimatica.infra.persistence.entity.equipamento.EquipamentoEntity;
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
public class TratorDTO extends EquipamentoDTO {

    private Double distribuicaoEstaticaTraseira;
    private Double pressaoPneuDianteiro;
    private Double pressaoPneuTraseiro;
    private Integer qtRodasDianteiras;
    private Integer qtRodasTraseiras;

    public TratorDTO(UUID id, String nome, String nomeFabricante, Double peso, TipoEquipamento tipoEquipamento, List<LimiteEntity> limiteList, Double distribuicaoEstaticaTraseira, Double pressaoPneuDianteiro, Double pressaoPneuTraseiro, Integer qtRodasDianteiras, Integer qtRodasTraseiras) {
        super(id, nome, nomeFabricante, peso, tipoEquipamento, limiteList);
        this.distribuicaoEstaticaTraseira = distribuicaoEstaticaTraseira;
        this.pressaoPneuDianteiro = pressaoPneuDianteiro;
        this.pressaoPneuTraseiro = pressaoPneuTraseiro;
        this.qtRodasDianteiras = qtRodasDianteiras;
        this.qtRodasTraseiras = qtRodasTraseiras;
    }

    public TratorDTO (TratorEntity entity) {
        super(entity.getId(), entity.getNome(), entity.getNomeFabricante(), entity.getPesoTotal(), entity.getTipoEquipamento(),entity.getLimites());
        this.distribuicaoEstaticaTraseira = entity.getDistribuicaoEstaticaTraseira();
        this.pressaoPneuDianteiro = entity.getPressaoPneuDianteiro();
        this.pressaoPneuTraseiro = entity.getPressaoPneuTraseiro();
        this.qtRodasDianteiras = entity.getQtRodasDianteiras();
        this.qtRodasTraseiras = entity.getQtRodasTraseiras();
    }
}