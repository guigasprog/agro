package analiseClimatica.infra.persistence.entity.equipamento;

import analiseClimatica.infra.web.response.equipamento.EquipamentoDTO;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "drone")
@DiscriminatorValue("DRONE")
@Getter
@Setter
@NoArgsConstructor
public class DroneEntity extends EquipamentoEntity{
    public DroneEntity(EquipamentoDTO dto) {
        super(dto);
    }
}
