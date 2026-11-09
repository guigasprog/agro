package analiseClimatica.domain.service.pulverizacao;

import analiseClimatica.domain.enums.TipoLimite;
import analiseClimatica.domain.model.Clima;
import analiseClimatica.domain.model.Ocorrencia;

import java.util.ArrayList;
import java.util.List;
//https://metos.global/pt/use-case-to-spray-or-not-to-spray/
public class AvaliarRiscoPulverizacao {
    public static void execute(Clima clima){
        List<Ocorrencia> ocorrenciaList = new ArrayList<>();

        // Velocidade do Vento  5 a 20 km/h
        Double vento = clima.getVelocidadeVento();
        if (vento != null) {
            if (vento < 5.0) {
                String titulo = "Velocidade do vento baixa para pulverização";
                String descricao = "Min: " + 5 + TipoLimite.VENTO.getUnidadeMedida() + " . "+ "Atual: " + vento + TipoLimite.VENTO.getUnidadeMedida() +  " . Risco de gotas suspensas e inversão térmica.";
                ocorrenciaList.add(Ocorrencia.criarNivelAlto(titulo, descricao));

            } else if (vento > 20.0) {
                String titulo = "Velocidade do vento alta para pulverização";
                String descricao = "Máx: " + 20 + TipoLimite.VENTO.getUnidadeMedida() + " . "+ "Atual: " + vento + TipoLimite.VENTO.getUnidadeMedida() +  " . Risco de deriva para outras áreas.";
                ocorrenciaList.add(Ocorrencia.criarNivelAlto(titulo, descricao));
            }
        }

        //  Bulbo Seco  maior ou igual 28ºC
        Double temp = clima.getTemperaturaBulboSeco();
        if (temp != null) {
            if (temp >= 28.0) {
                String titulo = "Temperatura alta para pulverização";
                String descricao = "Máx: " + 28 + TipoLimite.TEMPERATURA.getUnidadeMedida() + " . "+ "Atual: " + temp + TipoLimite.TEMPERATURA.getUnidadeMedida() +  " . Risco de vaporização do produto e queima de folhas.";
                ocorrenciaList.add(Ocorrencia.criarNivelAlto(titulo, descricao));
            }
        }

        //  Relativa  45% a 90%
        Double umidade = clima.getUmidade();
        if (umidade != null) {
            if (umidade < 45.0) {
                String titulo = "Umidade relativa baixa para pulverização";
                String descricao = "Min: 45" + TipoLimite.UMIDADE.getUnidadeMedida() + " . Atual: " + umidade + TipoLimite.UMIDADE.getUnidadeMedida() + " . Risco de evaporação rápida da gota antes da absorção.";
                ocorrenciaList.add(Ocorrencia.criarNivelAlto(titulo, descricao));
            } else if (umidade > 90.0) {
                String titulo = "Umidade relativa alta para pulverização";
                String descricao = "Máx: 90" + TipoLimite.UMIDADE.getUnidadeMedida() + " . Atual: " + umidade + TipoLimite.UMIDADE.getUnidadeMedida() + " . Risco de gotejamento e baixa absorção foliar.";
                ocorrenciaList.add(Ocorrencia.criarNivelAlto(titulo, descricao));
            }
        }

        // Delta T ideal: 2 a 8, tolerável com cautela até 10
        Double deltaT = clima.getDeltaT();
        if (deltaT != null) {
            if (deltaT < 2.0) {
                String titulo = "Delta T muito baixo para pulverização";
                String descricao = "Min: 2.0 . Atual: " + String.format("%.1f", deltaT) + " . Alta probabilidade de orvalho ou sobrevivência excessiva da gota.";
                ocorrenciaList.add(Ocorrencia.criarNivelAlto(titulo, descricao));
            } else if (deltaT > 10.0) {
                String titulo = "Delta T muito alto para pulverização";
                String descricao = "Máx: 10.0 . Atual: " + String.format("%.1f", deltaT) + " . Extremo risco de evaporação. Aplicação não recomendada.";
                ocorrenciaList.add(Ocorrencia.criarNivelAlto(titulo, descricao));
            } else if (deltaT > 8.0) {
                String titulo = "Delta T marginal para pulverização";
                String descricao = "Ideal máx: 8.0 . Atual: " + String.format("%.1f", deltaT) + " . Exige gotas grossas ou redução de velocidade.";
                ocorrenciaList.add(Ocorrencia.criarNivelMedio(titulo, descricao));
            }
        }

    clima.getOcorrenciaList().addAll(ocorrenciaList);
    }

}
