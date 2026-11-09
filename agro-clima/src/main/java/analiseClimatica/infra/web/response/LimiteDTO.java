package analiseClimatica.infra.web.response;

import analiseClimatica.domain.enums.TipoLimite;
import analiseClimatica.infra.persistence.entity.LimiteEntity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LimiteDTO{
    private UUID id;
    private TipoLimite tipo;
    private Double valorMinimo;
    private Double valorMaximo;
    public LimiteDTO(LimiteEntity entity) {
        this.id = entity.getId();
        this.tipo = entity.getTipo();
        this.valorMaximo = entity.getValorMaximo();
        this.valorMinimo = entity.getValorMinimo();
    }
}
