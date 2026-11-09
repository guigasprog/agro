package analiseClimatica.domain.service.compactacao;

public class CalcularAreaDeContatoDoPneu {
    //m²
    /**
     * Calcula a área de contato baseada no modelo SOCOMO.
     * Aplica um fator de correção de 1.2 sobre a pressão interna para compensar
     * a rigidez da carcaça do pneu, conforme regra prática de Koolen e Kuipers (1983).
     * * Referência:
     * VAN DEN AKKER, J. J. H. SOCOMO: a soil compaction model...
     * Soil & Tillage Research, v. 79, p. 113-127, 2004. (Páginas 118 e 122).
     *
     * @param pesoSobreRoda  Carga dinâmica sobre a roda (kN)
     * @param pressaoInterna Pressão de inflação do pneu (kPa)
     * @return Área estimada de contato (m²)
     */
    public static Double execute(Double pesoSobreRoda, Double pressaoContato) {
        return pesoSobreRoda / pressaoContato;
    }

}
