package analiseClimatica.infra.web.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;
import org.locationtech.jts.geom.MultiPolygon;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AreaAgricolaReduzidoDTO {
    private UUID id;
    private String nome;
    private String cidade;
    private String estado;
    private MultiPolygon geometria;
    private Double hectares;
}
