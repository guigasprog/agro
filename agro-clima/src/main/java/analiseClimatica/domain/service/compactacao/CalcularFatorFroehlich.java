package analiseClimatica.domain.service.compactacao;

/*Para a determinação do fator de concentração de Fröhlich (v),
o presente trabalho abdicou de estimativas empíricas baseadas em precipitação pluviométrica isolada.
 Empregou-se o consumo direto da variável umidade volumétrica do solo (camada de 7 a 28 cm),
 provida pela API de reanálise climática Open-Meteo. A adoção desta variável contínua (m3/m3)
 permite cruzar o volume real de água no perfil do solo com os Limites de Consistência (Atterberg)
 estipulados para texturas arenosa, média e argilosa, utilizando as metodologadas descritas pela Embrapa.
 Tal abordagem garante maior fidelidade aos princípios da mecânica dos solos, onde a ocorrência de falha
 por colapso estrutural sob cargas de maquinário depende intrinsecamente do estado de consistência
 (sólido/duro, friável ou plástico) ditado pela tensão da água no solo.*/

import analiseClimatica.domain.enums.TexturaSolo;
import analiseClimatica.domain.model.Solo;

import java.util.Objects;

/**
 * Serviço responsável por determinar o Fator de Concentração de Fröhlich (v).
 * Utiliza dados de Umidade Volumétrica do Solo da API Open-Meteo e cruza com
 * os Limites de Atterberg obtidos via métodos da Embrapa.
 */
public class CalcularFatorFroehlich {

    // Valores do Fator de Fröhlich (v) segundo Koolen e Kuipers (1983)
    private static final int NU_SOLO_PLASTICO = 5; // Solo macio/estado plástico
    private static final int NU_SOLO_FRIAVEL = 4;  // Solo normal/estado friável
    private static final int NU_SOLO_DURO = 3;     // Solo duro/estado semissólido ou sólido

    public static int execute(Solo solo, double umidadeVolumetrica) {

        // Limiares baseados nas análises físicas de Limites de Consistência (Embrapa, 2017)
        // limiarPlasticidade: Equivalente ao Limite de Plasticidade (LP)
        // limiarDureza: Equivalente ao Limite de Contração (LC) ou umidade na tensão de Murcha
        double limiarPlasticidade;
        double limiarDureza;

        switch (solo.getTextutaSolo()) {
            case ARGILOSO:
                limiarPlasticidade = 0.38; // Típico LP para Latossolos argilosos (Terra Roxa)
                limiarDureza = 0.22;       // Típico LC para Latossolos argilosos
                break;
            case MEDIO:
                // Textura média (ex: 15% a 35% de argila)
                limiarPlasticidade = 0.24; // LP reduzido devido à maior presença de areia e silte
                limiarDureza = 0.12;       // Ponto onde o solo atinge o estado sólido/firme
                break;
            case ARENOSO:
                // Textura arenosa (< 15% de argila)
                limiarPlasticidade = 0.12; // Satura e perde suporte mecânico com muito pouca água
                limiarDureza = 0.06;       // Baixíssima capacidade de retenção
                break;
            default:
                limiarPlasticidade = 0.24;
                limiarDureza = 0.12;
        }

        limiarDureza = Objects.isNull(solo.getLimiarDureza())? limiarDureza : solo.getLimiarDureza();
        limiarPlasticidade = Objects.isNull(solo.getLimiarPlasticidade())?  limiarPlasticidade : solo.getLimiarPlasticidade();
        // Regra de Decisão do Estado Mecânico do Solo
        if (umidadeVolumetrica >= limiarPlasticidade) {
            return NU_SOLO_PLASTICO; // v = 5 (Risco crítico de deformação: umidade ultrapassou o LP)
        } else if (umidadeVolumetrica <= limiarDureza) {
            return NU_SOLO_DURO;     // v = 3 (Suporte estrutural máximo: solo no estado semissólido/sólido)
        }

        return NU_SOLO_FRIAVEL;      // v = 4 (Estado friável, distribuição intermediária de tensões)
    }

    /* REFERÊNCIAS:
    ALLEN, R. G. et al. Crop evapotranspiration: Guidelines for computing crop water requirements.
    FAO Irrigation and drainage paper 56, Rome: FAO, 1998.

    TEIXEIRA, P. C. et al. (Ed.). Manual de métodos de análise de solo. 3. ed. rev. e ampl.
    Brasília, DF: Embrapa, 2017. 573 p.

    LUCIANO, R. V. et al. Atributos físicos relacionados à compactação de solos sob vegetação nativa em
    região de altitude no Sul do Brasil. Revista Brasileira de Ciência do Solo, Viçosa, v. 36, n. 6, p. 1733-1744, dez. 2012.

    SILVA, A. J. N. da; CABEDA, M. S. V. Compactação e compressibilidade do solo sob sistemas de manejo e níveis de umidade.
    Revista Brasileira de Ciência do Solo, Viçosa, v. 30, n. 6, p. 921-930, dez. 2006.
    
    VAN DEN AKKER, J. J. H. SOCOMO: a soil compaction model to calculate soil stresses...
    Soil and Tillage Research, v. 79, n. 1, p. 113-127, 2004. */
}