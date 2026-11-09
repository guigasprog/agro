package analiseClimatica.infra.persistence.entity.equipamento;

import analiseClimatica.infra.web.response.equipamento.TratorDTO;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "trator")
// 1. Avisa ao JPA que, quando criar um trator, a palavra "TRATOR" deve ir para a coluna tipo_equipamento
@DiscriminatorValue("TRATOR")
// 2. Dizemos explicitamente que o ID desta tabela se liga ao ID da tabela pai
@PrimaryKeyJoinColumn(name = "id")
@NoArgsConstructor
public class TratorEntity extends EquipamentoEntity {

    // Herda automaticamente o id, nome, nomeFabricante e pesoTotal da classe Equipamento!

    @Column(name = "distribuicao_estatica_traseira")
    private Double distribuicaoEstaticaTraseira;

    @Column(name = "pressao_pneu_dianteiro")
    private Double pressaoPneuDianteiro;

    @Column(name = "pressao_pneu_traseiro")
    private Double pressaoPneuTraseiro;

    @Column(name = "qt_rodas_dianteiras")
    private Integer qtRodasDianteiras;

    @Column(name = "qt_rodas_traseiras")
    private Integer qtRodasTraseiras;

    public TratorEntity(TratorDTO dto) {
       super(dto.getId(), dto.getNome(), dto.getNomeFabricante(), dto.getPesoTotal());
       this.distribuicaoEstaticaTraseira = dto.getDistribuicaoEstaticaTraseira();
       this.pressaoPneuDianteiro = dto.getPressaoPneuDianteiro();
       this.pressaoPneuTraseiro = dto.getPressaoPneuTraseiro();
       this.qtRodasDianteiras = dto.getQtRodasDianteiras();
       this.qtRodasTraseiras = dto.getQtRodasTraseiras();
       this.adicionarLimiteDTO(dto.getLimiteList());
    }
}