package analiseClimatica.infra.web.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.locationtech.jts.geom.MultiPolygon;

import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AreaAgricolaDTO {
    private UUID id;
    private String nome;
    private String cidade;
    private String estado;
    private MultiPolygon geometria;
    private double hectares;
    private LocalDate ultimaAtualizacaoClima;
    private LocalDate ultimaAtualizacaoPulverizacao;
    private LocalDate ultimaAtualizacaoCompactacao;
    private UUID idSolo;
    private String nomeSolo;
}
