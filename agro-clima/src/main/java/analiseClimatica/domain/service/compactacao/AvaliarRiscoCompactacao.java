package analiseClimatica.domain.service.compactacao;

import analiseClimatica.domain.enums.TipoAcoplamento;
import analiseClimatica.domain.model.Clima;
import analiseClimatica.domain.model.AreaAgricola;
import analiseClimatica.domain.model.Ocorrencia;
import analiseClimatica.domain.model.gestao_recurso.Equipamento;

import java.util.ArrayList;
import java.util.List;

public class AvaliarRiscoCompactacao {

    public static void execute(
            Equipamento equipamento,
            List<Clima> climaList,
            AreaAgricola areaAgricola,
            List<Equipamento> implementoList) {

        double pesoImplementoNoTrator = 0;
        double fatorTransferencia = 0;

        if (implementoList != null) {
            for (Equipamento implemento : implementoList) {
                TipoAcoplamento acoplamento = TipoAcoplamento.valueOf(implemento.getTipoImplemento());
                pesoImplementoNoTrator += implemento.getPesoTotal() * acoplamento.getFracaoCargaVertical();
                fatorTransferencia += acoplamento.getFatorTransferencia();
            }
        }
        double pesoTotalConjunto = equipamento.getPesoTotal() + pesoImplementoNoTrator;

        double distribuicaoDinamicaTraseira = (equipamento.getDistribuicaoEstaticaTraseira() /100)
                + fatorTransferencia;
        double distribuicaoDinamicaDianteira = 1.0 - distribuicaoDinamicaTraseira;


        double pesoRodaDianteira = CalcularPesoSobreRoda.execute(pesoTotalConjunto, distribuicaoDinamicaDianteira,
                equipamento.getQtRodasDianteiras());
        double pressaoContatoDianteira = CalcularPressaoContatoPneuSolo.execute(equipamento.getPressaoPneuDianteiro());
        double raioDianteiro = CalcularRaioContato.execute(pesoRodaDianteira, pressaoContatoDianteira);


        double pesoRodaTraseira = CalcularPesoSobreRoda.execute(pesoTotalConjunto, distribuicaoDinamicaTraseira,
                equipamento.getQtRodasTraseiras());
        double pressaoContatoTraseira = CalcularPressaoContatoPneuSolo.execute(equipamento.getPressaoPneuTraseiro());
        double raioTraseiro = CalcularRaioContato.execute(pesoRodaTraseira, pressaoContatoTraseira);

        for (Clima clima : climaList) {
            int fatorFroehlich = CalcularFatorFroehlich.execute(areaAgricola.getSolo(),
                    clima.getUmidadeVolumetrica());
            double capacidadeCargaSolo = CalcularCapacidadeSuporteDinamica
                    .execute(areaAgricola.getSolo(), clima.getUmidadeVolumetrica());
            List<Ocorrencia> ocorrenciaList = new ArrayList<>();

// como 10cm afeta diretamente o desenvolvimento da plantação e profundidades maiores dicipam a tensão é nescessário a analise apenas a 10cm de profundidade

            avaliarEixo("Dianteiro", equipamento.getQtRodasDianteiras(), pesoTotalConjunto,
                    distribuicaoDinamicaDianteira, pressaoContatoDianteira, raioDianteiro,
                    0.1, fatorFroehlich, capacidadeCargaSolo, ocorrenciaList);


            avaliarEixo("Traseiro", equipamento.getQtRodasTraseiras(), pesoTotalConjunto,
                    distribuicaoDinamicaTraseira, pressaoContatoTraseira, raioTraseiro,
                    0.1, fatorFroehlich, capacidadeCargaSolo, ocorrenciaList);

            clima.getOcorrenciaList().addAll(ocorrenciaList);
        }
    }

    // Avalia por eixo para poder avaliar a compactação do eixo dianteiro e traseiro
    private static void avaliarEixo(
            String nomeEixo,
            int qtRodas,
            double pesoTotalConjunto,
            double distribuicaoDinamica,
            double pressaoContato,
            double raioContato,
            double profundidade,
            int fatorFroehlich,
            double capacidadeCargaSolo,
            List<Ocorrencia> ocorrenciaList) {

        double tensao = CalcularTensaoVertical.execute(pressaoContato, raioContato, profundidade, fatorFroehlich);
        double limiteMedio = capacidadeCargaSolo * 0.8;

        if (tensao > capacidadeCargaSolo) {
            System.out.println("alto " +  nomeEixo);

            String titulo = "Alta chance de compactação no eixo " + nomeEixo;
            if (qtRodas < 4) {
                double pesoRodaCom4 = CalcularPesoSobreRoda.execute(pesoTotalConjunto, distribuicaoDinamica, 4);
                double raioCom4 = CalcularRaioContato.execute(pesoRodaCom4, pressaoContato);
                double tensaoCom4 = CalcularTensaoVertical.execute(pressaoContato, raioCom4, profundidade,
                        fatorFroehlich);

                if (tensaoCom4 < capacidadeCargaSolo) {
                    if (tensaoCom4 > limiteMedio) {
                        ocorrenciaList.add(Ocorrencia.criarNivelAlto(titulo, "A tensão do solo no eixo " + nomeEixo
                                + " causa compactação"
                                + ", porém, se utilizar rodados duplos (4 rodas), o nível de alerta fica médio e a operação fica próxima de causar a compactação."));
                    } else {
                        ocorrenciaList.add(Ocorrencia.criarNivelAlto(titulo, "A tensão do solo no eixo " + nomeEixo
                                + " causa compactação"
                                + ", porém, se utilizar rodados duplos (4 rodas), a operação não causa compactação."));
                    }
                } else {
                    ocorrenciaList.add(Ocorrencia.criarNivelAlto(titulo, "A tensão do solo no eixo " + nomeEixo
                            + " causa compactação."));
                }
            } else {
                ocorrenciaList.add(Ocorrencia.criarNivelAlto(titulo, "A tensão do solo no eixo " + nomeEixo
                        + " causa compactação."));
            }

        } else if (tensao > limiteMedio) {
            System.out.println("medio " +  nomeEixo);
            String titulo = "Chance moderada de compactação no eixo " + nomeEixo;
            if (qtRodas < 4) {
                double pesoRodaCom4 = CalcularPesoSobreRoda.execute(pesoTotalConjunto, distribuicaoDinamica, 4);
                double raioCom4 = CalcularRaioContato.execute(pesoRodaCom4, pressaoContato);
                double tensaoCom4 = CalcularTensaoVertical.execute(pressaoContato, raioCom4, profundidade,
                        fatorFroehlich);

                if (tensaoCom4 > limiteMedio) {
                    ocorrenciaList.add(Ocorrencia.criarNivelMedio(titulo, "A tensão do solo no eixo " + nomeEixo
                            + " está próxima de causar compactação"
                            + ", porém, se utilizar rodados duplos (4 rodas), a operação não causa compactação."));
                } else {
                    ocorrenciaList.add(Ocorrencia.criarNivelMedio(titulo, "A tensão do solo no eixo " + nomeEixo
                            + " está próxima de causar compactação."));
                }
            } else {
                ocorrenciaList.add(Ocorrencia.criarNivelMedio(titulo, "A tensão do solo no eixo " + nomeEixo
                        + " está próxima de causar compactação."));
            }
        }
    }
}