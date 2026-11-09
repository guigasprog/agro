package analiseClimatica.infra.climaTempo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
//https://apiadvisor.climatempo.com.br/doc/index.html#api-GeorefForecast-V2-Forecast168HoursByLatLon-V2
// Anotação para ignorar campos no JSON que não existem na nossa classe.
// Isso torna nosso código mais robusto a futuras mudanças na API.
@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class ForecastResponse {
    private int id;
    private String name;
    private String state;
    private String country;
    private List<ForecastData> data;
}
