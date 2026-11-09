package analiseClimatica.infra.persistence.entity.equipamento;

import analiseClimatica.infra.persistence.entity.LimiteEntity;
import analiseClimatica.infra.web.response.equipamento.ImplementoDTO;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "implemento")
@DiscriminatorValue("IMPLEMENTO")
@PrimaryKeyJoinColumn(name = "id")
@NoArgsConstructor
public class ImplementoEntity extends EquipamentoEntity {

    @Column(name = "tipo_implemento", length = 100)
    private String tipoImplemento;

    public ImplementoEntity(UUID id, String nome, String nomeFabricante, Double pesoTotal, String tipoImplemento, List<LimiteEntity> limiteList) {
        super(id, nome, nomeFabricante, pesoTotal);
        this.tipoImplemento = tipoImplemento;
        adicionarLimite(limiteList);
    }
    public ImplementoEntity(ImplementoDTO dto) {
        super(dto.getId(), dto.getNome(), dto.getNomeFabricante(), dto.getPesoTotal());
        this.tipoImplemento = dto.getTipoImplemento();
        adicionarLimiteDTO(dto.getLimiteList());
    }
}
