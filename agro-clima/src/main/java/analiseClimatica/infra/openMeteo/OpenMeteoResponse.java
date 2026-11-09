package analiseClimatica.infra.openMeteo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import java.util.List;

@Getter
@JsonIgnoreProperties(ignoreUnknown = true)
public class OpenMeteoResponse {
    private Hourly hourly;

    @Getter
    public static class Hourly {
        private List<String> time;
        @JsonProperty("temperature_2m")
        private List<Double> temperatures;
        @JsonProperty("relative_humidity_2m")
        private List<Double> humidities;
        @JsonProperty("wind_speed_10m")
        private List<Double> windSpeeds;
        @JsonProperty("wind_direction_10m")
        private List<Double> windDirections;
        @JsonProperty("precipitation")
        private List<Double> precipitations;
        @JsonProperty("precipitation_probability")
        private List<Double> precipitationProbabilities;
        @JsonProperty("visibility")
        private List<Double> visibilities;
        @JsonProperty("surface_pressure")
        private List<Double> surfacePressures;
        @JsonProperty("soil_moisture_9_to_27cm")
        private List<Double> soilMoistures;
    }
}