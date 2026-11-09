package analiseClimatica.infra.web.response;

import analiseClimatica.domain.model.Clima;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class AnaliseJanelaOperacionalDTO {
    private Long horasLivres;

    private LocalDate data;

    private Long qtProblemaCritico;
    private Long qtProblemaModerado;

    private Double umidadeMedia;

    private Double precipitacaoAcumulada;

    private Double probabilidadePrecipitacao;

    private Double velocidadeVentoMedia;

    private Double visibilidadeMedia;

    private Double temperaturaMedia;

    private List<Clima> climaList;

}

