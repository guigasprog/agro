package analiseClimatica.domain.model.gestao_recurso;

import analiseClimatica.domain.enums.TipoLimite;
import lombok.Getter;

import java.util.Objects;
import java.util.UUID;

@Getter
public class Limite {
    private UUID id;
    private TipoLimite tipo;
    private Double valorMinimo;
    private Double valorMaximo;
    private Equipamento equipamento;

    public Limite(UUID id, TipoLimite tipo, Double valorMinimo, Double valorMaximo) {
        this.id = id;
        this.tipo = tipo;
        this.valorMinimo = valorMinimo;
        this.valorMaximo = valorMaximo;
        validarExistenciaDeValores();
    }
    private void validarExistenciaDeValores(){
        if (Objects.isNull(valorMaximo)&&Objects.isNull(valorMinimo)){
            throw new RuntimeException("O valor máximo ou minimo deve ser preenchido");
        }
    }
}
