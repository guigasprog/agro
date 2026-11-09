package analiseClimatica.domain.service.pulverizacao;

public class CalcularDelta {
    public static Double execute(Double temperatura,Double temperaturaBulboMolhado){
        return temperatura - temperaturaBulboMolhado;
    }
}
