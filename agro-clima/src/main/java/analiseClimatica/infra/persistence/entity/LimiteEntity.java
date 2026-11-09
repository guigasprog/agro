package analiseClimatica.infra.persistence.entity;

import analiseClimatica.domain.enums.TipoLimite;
import analiseClimatica.infra.persistence.entity.equipamento.EquipamentoEntity;
import analiseClimatica.infra.web.response.LimiteDTO;
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
@Table(name = "limite")
public class LimiteEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Enumerated(EnumType.STRING)
    private TipoLimite tipo;

    private Double valorMinimo;
    private Double valorMaximo;

   @ManyToOne(fetch = FetchType.LAZY)
   @JoinColumn(name = "equipamento_id")
   private EquipamentoEntity equipamento;

   public  LimiteEntity(LimiteDTO dto) {
        this.id = dto.getId();
        this.tipo = dto.getTipo();
        this.valorMinimo = dto.getValorMinimo();
        this.valorMaximo = dto.getValorMaximo();
   }
}