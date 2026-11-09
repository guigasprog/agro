package analiseClimatica.domain.enums;

public enum TipoAcoplamento {
    ACESSORIO(0.0,0.0),

    // Implementos de 3 pontos (ex: Arados, Subsoladores).
    // Transferem muito peso para a traseira, podendo retirar até 15-20% do peso da dianteira.
    // O trator carrega 100% (1.0) do peso do implemento.
    MONTADO_TRASEIRO(0.18,1.0),

    // Implementos puxados (ex: Grades pesadas, Carretas).
    // Transferência moderada, apenas pela barra de tração
    // O trator carrega apenas ~15% (0.15) do peso (apoio na barra), o resto fica nas rodas do implemento.
    ARRASTO_BARRA_TRACAO(0.08,0.15),

    // Implementos na frente (ex: Pá carregadeira, Tanque frontal).
    // Fazem o inverso: jogam o peso para o eixo dianteiro.
    // O trator carrega 100% (1.0) do peso, mas na frente.
    FRONTAL(-0.15,1.0);

    private final double fatorTransferencia;
    private final double fracaoCargaVertical;

    TipoAcoplamento(double fatorTransferencia, double fracaoCargaVertical) {
        this.fatorTransferencia = fatorTransferencia;
        this.fracaoCargaVertical = fracaoCargaVertical;
    }

    public double getFatorTransferencia() { return fatorTransferencia; }
    public double getFracaoCargaVertical() { return fracaoCargaVertical; }
}