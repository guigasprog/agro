package analiseClimatica.domain.enums;


 // Classificação simplificada da textura do solo (Legado ZARC/Embrapa).
/**
 * Solo Argiloso: 1,20 a 1,40 g/cm³ (valores normais sem compactação; acima de 1,45–1,50 g/cm³ já indicam restrição).
 * Solo de Textura Média (Médio): 1,40 a 1,50 g/cm³ (faixa intermediária).
 * Solo Arenoso: 1,50 a 1,70 g/cm³ (suporta densidades maiores antes de prejudicar as raízes por ter partículas mais pesadas e menor volume total de microporos
 * */
public enum TexturaSolo {
    ARGILOSO(2.95, -2.45, 1.30),
    MEDIO(2.70, -1.90, 1.45),
    ARENOSO(2.45, -1.40, 1.60);

    private final double interceptoPadrao;
    private final double taxaDecaimentoPadrao;
    private final double densidadePadrao;

    TexturaSolo(double interceptoPadrao, double taxaDecaimentoPadrao, double densidadePadrao) {
        this.interceptoPadrao = interceptoPadrao;
        this.taxaDecaimentoPadrao = taxaDecaimentoPadrao;
        this.densidadePadrao = densidadePadrao;
    }

    public double getInterceptoPadrao() { return interceptoPadrao; }
    public double getTaxaDecaimentoPadrao() { return taxaDecaimentoPadrao; }
    public double getDensidadePadrao() { return densidadePadrao; }
}