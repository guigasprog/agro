package analiseClimatica.domain.service.compactacao;

public class CalcularRaioContato {

    /*tende a superestimar levemente a tensão máxima no centro do rodado,
    já que na realidade a pressão se distribui de forma mais alongada
    longitudinalmente (UPADHYAYA et al., 1989).*/
    //m
    public static Double execute(double pesoSobreRoda,  double pressaoContato){
        Double areaContato = CalcularAreaDeContatoDoPneu.execute(pesoSobreRoda, pressaoContato);
        double raioCircular = Math.sqrt(areaContato / Math.PI);
        // Fator de correção para pneus radiais em solos tropicais macios (alongamento)
        // Aumenta o raio equivalente em cerca de 10% a 15% para diluir o pico de tensão
        return raioCircular * 1.12;
    }
//para trabalhos futuros implementar a discretização da malha de contato em grid retangular
// e o cálculo espacial de superposição de tensões sob rodados duplos,
// conforme proposto pelo modelo SOCOMO

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
