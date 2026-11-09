package analiseClimatica.domain.model;

import analiseClimatica.domain.service.pulverizacao.CalcularBulboUmido;
import analiseClimatica.domain.service.pulverizacao.CalcularDelta;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
public class Clima {

    private LocalDateTime data;

    private Double umidade;

    private Double precipitacao;

    private Double probabilidadePrecipitacao;

    private Double pressaoSuperficie;

    private Double velocidadeVento;

    private Double umidadeVolumetrica;

    private Double visibilidade;

    private Double temperaturaBulboSeco;

    private Double temperaturaBulboUmido;

    private Double deltaT;

    private Double capacidadeSuporteSolo;
    private List<Ocorrencia> ocorrenciaList;

    public Clima(String data, Double temperaturaBulboSeco, Double umidade, Double precipitacao, Double probabilidadePrecipitacao,
                 Double velocidadeVento, Double visibilidade, Double pressaoSuperficie, Double umidadeVolumetrica) {
        this.data = LocalDateTime.parse(data);
        this.temperaturaBulboSeco = temperaturaBulboSeco;
        this.umidade = umidade;
        this.precipitacao = precipitacao;
        this.probabilidadePrecipitacao = probabilidadePrecipitacao;
        this.velocidadeVento = velocidadeVento;
        this.visibilidade = visibilidade;
        this.pressaoSuperficie = pressaoSuperficie;
        this.umidadeVolumetrica = umidadeVolumetrica;
        if(temperaturaBulboSeco != null && umidade != null && pressaoSuperficie != null) {
            this.temperaturaBulboUmido = CalcularBulboUmido.execute(temperaturaBulboSeco, umidade, pressaoSuperficie);
            deltaT = CalcularDelta.execute(temperaturaBulboSeco,temperaturaBulboUmido);
        }
        this.ocorrenciaList = new ArrayList<>();
    }

    public Clima(String data, Double temperaturaBulboSeco, Double temperaturaBulboUmido, Double deltaT,
                 Double umidade, Double precipitacao, Double probabilidadePrecipitacao,
                 Double velocidadeVento, Double visibilidade, Double pressaoSuperficie,
                 Double umidadeVolumetrica, Double capacidadeSuporteSolo) {
        this.data = LocalDateTime.parse(data);
        this.temperaturaBulboSeco = temperaturaBulboSeco;
        this.temperaturaBulboUmido = temperaturaBulboUmido;
        this.deltaT = deltaT;
        this.umidade = umidade;
        this.precipitacao = precipitacao;
        this.probabilidadePrecipitacao = probabilidadePrecipitacao;
        this.velocidadeVento = velocidadeVento;
        this.visibilidade = visibilidade;
        this.pressaoSuperficie = pressaoSuperficie;
        this.umidadeVolumetrica = umidadeVolumetrica;
        this.capacidadeSuporteSolo = capacidadeSuporteSolo;
        this.ocorrenciaList = new ArrayList<>();
    }
}
