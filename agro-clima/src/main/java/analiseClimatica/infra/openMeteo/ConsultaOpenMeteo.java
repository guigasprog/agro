package analiseClimatica.infra.openMeteo;

import analiseClimatica.domain.model.AreaAgricola;
import analiseClimatica.domain.model.Clima;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.ArrayList;
import java.util.List;

public class ConsultaOpenMeteo {

    public static List<Clima> execute(AreaAgricola areaAgricola) {
        List<Clima> climasList = new ArrayList<>();
        try {
            String url = String.format(
                    "https://api.open-meteo.com/v1/forecast?latitude=%s&longitude=%s&hourly=temperature_2m,relative_humidity_2m,precipitation,precipitation_probability,wind_speed_10m,visibility,surface_pressure,soil_moisture_9_to_27cm&timezone=auto",
                    areaAgricola.getGeometria().getCentroid().getY(),
                    areaAgricola.getGeometria().getCentroid().getX());

            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .GET()
                    .build();

            System.out.println("Enviando requisição para a API do Open-Meteo...");

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                System.out.println("Resposta recebida com sucesso!");

                ObjectMapper mapper = new ObjectMapper();
                OpenMeteoResponse openMeteoResponse = mapper.readValue(response.body(), OpenMeteoResponse.class);

                if (openMeteoResponse != null && openMeteoResponse.getHourly() != null) {
                    OpenMeteoResponse.Hourly hourly = openMeteoResponse.getHourly();
                    
                    if (hourly.getTime() != null) {
                        int size = hourly.getTime().size();

                        for (int i = 0; i < size; i++) {
                            String time = hourly.getTime().get(i);
                            Double temp = getSafeDouble(hourly.getTemperatures(), i);
                            Double humidity = getSafeDouble(hourly.getHumidities(), i);
                            Double precip = getSafeDouble(hourly.getPrecipitations(), i);
                            Double precipProb = getSafeDouble(hourly.getPrecipitationProbabilities(), i);
                            Double windSpeed = getSafeDouble(hourly.getWindSpeeds(), i);
                            Double visib = getSafeDouble(hourly.getVisibilities(), i);
                            Double pressure = getSafeDouble(hourly.getSurfacePressures(), i);
                            Double soilMoisture = getSafeDouble(hourly.getSoilMoistures(), i);

                            Clima clima = new Clima(time, temp, humidity, precip, precipProb, windSpeed, visib, pressure, soilMoisture);
                            climasList.add(clima);
                        }
                    }
                }
            } else {
                System.out.println("Falha na requisição. Status code: " + response.statusCode());
                System.out.println("Corpo da resposta: " + response.body());
            }

        } catch (Exception e) {
            System.err.println("Ocorreu um erro ao fazer a requisição: " + e.getMessage());
            e.printStackTrace();
        }
        return climasList;
    }

    private static Double getSafeDouble(List<Double> list, int index) {
        if (list != null && list.size() > index) {
            return list.get(index);
        }
        return null;
    }
}
