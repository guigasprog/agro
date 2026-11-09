package analiseClimatica.infra.climaTempo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class ForecastData {

    private String date;
    @JsonProperty("date_br")
    private String dateBr;

    private Humidity humidity;
    private Rain rain;
    private Wind wind;
    private ThermalSensation thermalSensation;
    private Temperature temperature;

    @Getter
    @Setter
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Humidity {
        private Double value;
    }
    @Getter
    @Setter
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Rain {
        private Double precipitation;

    }
    @Getter
    @Setter
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Temperature {
        private Double value;

    }
    @Getter
    @Setter
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class ThermalSensation {
        private Double value;

    }
    @Getter
    @Setter
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Wind {
        private Double velocity;
        private String direction;
        @JsonProperty("direction_degrees")
        private Double directiondegrees;
    }

}