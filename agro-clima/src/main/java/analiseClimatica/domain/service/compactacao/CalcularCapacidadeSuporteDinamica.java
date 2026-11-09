package analiseClimatica.domain.service.compactacao;

import analiseClimatica.domain.enums.TexturaSolo;
import analiseClimatica.domain.model.Solo;

/**
 * Serviço responsável por determinar a capacidade de suporte de carga (tensão de pré-compressão)
 * baseando-se no modelo de Dias Junior (1994).
 */
public class CalcularCapacidadeSuporteDinamica {

    private static final double PISO_ESTRUTURAL_KPA = 40.0;

    /**
     * Calcula a tensão de pré-compressão dinâmica utilizando modelo exponencial.
     *
     * @param solo Entidade contendo os atributos e textura do solo do talhão.
     * @param umidadeVolumetrica Umidade volumétrica atual m³/m³.
     * @return Capacidade de suporte estrutural estimada em kPa.
     */
    public static double execute(Solo solo, double umidadeVolumetrica) {
        TexturaSolo textura = solo.getTextutaSolo() != null ? solo.getTextutaSolo() : TexturaSolo.MEDIO;

        double densidadeSolo = solo.getDensidade() != null ?
                solo.getDensidade() : textura.getDensidadePadrao();

        double a = solo.getResistenciaMaximaEstruturalSolo() != null ?
                solo.getResistenciaMaximaEstruturalSolo() : textura.getInterceptoPadrao();

        double b = solo.getTaxaDecaimentoSolo() != null ?
                solo.getTaxaDecaimentoSolo() : textura.getTaxaDecaimentoPadrao();

        double umidadeGravimetrica = umidadeVolumetrica / densidadeSolo;

        // Equação de Dias Junior (1994): σp = 10^(a + b*U)
        double capacidadeCarga = Math.pow(10, (a + (b * umidadeGravimetrica)));

        return Math.max(capacidadeCarga, PISO_ESTRUTURAL_KPA);
    }
}