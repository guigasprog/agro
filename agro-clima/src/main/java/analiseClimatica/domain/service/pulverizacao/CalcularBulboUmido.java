package analiseClimatica.domain.service.pulverizacao;

public class CalcularBulboUmido {

    private static double getPressaoSaturacaoInicial(double temperaturaC) {
        double temperaturaK = temperaturaC + 273.15;
        double termoPotencia = (6.0 * Math.pow(10, 25)) / (1000.0 * Math.pow(temperaturaK, 5));
        double termoExponencial = Math.exp(-6800.0 / temperaturaK);
        return termoPotencia * termoExponencial;
    }
    private static double getPressaoParcialVapor(double umidadeRelativaPct, double pvs) {
        return (umidadeRelativaPct * pvs) / 100.0;
    }
    private static double getRazaoMistura(double pv, double pressaoAtmosfericaHPa) {
        return 0.622 * (pv / (pressaoAtmosfericaHPa - pv));
    }
    private static double getEntalpia(double temperaturaC, double razaoMistura) {
        return 1.006 * temperaturaC + razaoMistura * (2501.0 + 1.775 * temperaturaC);
    }
    public static Double execute(Double temperaturaArC, Double umidadeRelativaPct, Double pressaoAtmosfericaHPa) {
        double umidadeClamped = Math.max(0, Math.min(100, umidadeRelativaPct));
        double pvsInicial = getPressaoSaturacaoInicial(temperaturaArC);
        double pvInicial = getPressaoParcialVapor(umidadeClamped, pvsInicial);
        double wInicial = getRazaoMistura(pvInicial, pressaoAtmosfericaHPa);

        double entalpiaAlvo = getEntalpia(temperaturaArC, wInicial);
        double limiteInferior = -60.0; double limiteSuperior = temperaturaArC;
        double bulboUmido = 0.0;

        for (int i = 0; i < 60; i++) {
            bulboUmido = (limiteInferior + limiteSuperior) / 2.0;
            // Na saturação (UR = 100%), a pressão parcial de vapor é igual à pressão de saturação em Tw
            double pvsTw = getPressaoSaturacaoInicial(bulboUmido);
            double wSaturacaoTw = getRazaoMistura(pvsTw, pressaoAtmosfericaHPa);
            // Entalpia simulada no bulbo úmido de teste
            double entalpiaTeste = getEntalpia(bulboUmido, wSaturacaoTw);
            // Resíduo do balanço energético
            double residuo = entalpiaTeste - entalpiaAlvo;
            if (residuo > 0) {
                limiteSuperior = bulboUmido;
            } else {
                limiteInferior = bulboUmido;
            }
        }
        return (limiteInferior + limiteSuperior) / 2.0;

    }
}