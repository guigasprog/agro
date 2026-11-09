package analiseClimatica.domain.service.compactacao;

public class CalcularPesoSobreRoda {
    //kN
    //peso é kN
    public static Double execute(double pesoTotalTrator,double distribuicaoDinamica, double numeroDeRodasPorExixo){
        return (pesoTotalTrator * distribuicaoDinamica)/numeroDeRodasPorExixo;
    }

    /*
     * FEITOSA, J. R.; FERNANDES, H. C.; TEIXEIRA, M. M.; CECON, P. R. Influência da pressão interna dos pneus e da
     * velocidade de deslocamento nos parâmetros operacionais de um trator agrícola e nas propriedades físicas do solo.
     * Engenharia Agrícola, Jaboticabal, v. 35, n. 1, p. 117-127, jan./fev. 2015.
     *
     * VAN DEN AKKER, J. J. H. SOCOMO: a soil compaction model to calculate soil stresses and the subsoil carrying capacity.
     * Soil & Tillage Research, v. 79, p. 113-127, 2004.
     *
     * UPADHYAYA, S. K.; WULFSOHN, D.; JUBBAL, G. Traction prediction equations for radial ply tyres.
     *Journal of Terramechanics, v. 26, n. 2, p. 149-175, 1989.
     * */
}
