package analiseClimatica.infra.climaTempo;

import analiseClimatica.domain.model.AreaAgricola;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
//https://apiadvisor.climatempo.com.br/doc/index.html#api-GeorefForecast-V2-Forecast168HoursByLatLon-V2
public class ConsultaClima {

    private static final String CLIMATEMPO_API_TOKEN = "SEU_TOKEN_AQUI";

    public ForecastResponse consulta(AreaAgricola areaAgricola) {
        ForecastResponse forecastResponse = new ForecastResponse();
        try {

            String url ="";/* Striformatng.(
                    "http://apiadvisor.climatempo.com.br/api/v1/forecast/geo/hours/72?latitude={0}&longitude={1}&token={2}",
                    areaAgricola.getGeometria().getCentroid().getY(),
                    areaAgricola.getGeometria().getCentroid().getX(),
                    CLIMATEMPO_API_TOKEN
            );*/

            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .GET()
                    .build();

            System.out.println("Enviando requisição para a API do Clima Tempo...");

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                System.out.println("Resposta recebida com sucesso!");

                ObjectMapper mapper = new ObjectMapper();

                forecastResponse = mapper.readValue(response.body(), ForecastResponse.class);

            } else {
                System.out.println("Falha na requisição. Status code: " + response.statusCode());
                System.out.println("Corpo da resposta: " + response.body());
            }

        } catch (Exception e) {
            System.err.println("Ocorreu um erro ao fazer a requisição: " + e.getMessage());
            e.printStackTrace();
        }
        return forecastResponse;
    }
}