package analiseClimatica.domain.service.compactacao;

public class CalcularPressaoContatoPneuSolo {
    public static Double execute(double pressaoInterna){
        return pressaoInterna * 1.2;
    }
    /*Para o cálculo da pressão exercida na interface pneu-solo será adotado a
    * premissa utilizada no modelo analítico SOCOMO (VAN DEN AKKER, 2004),
    * o qual incorpora o princípio estabelecido por Koolen e Kuipers (1983).
    * Segundo essa regra prática, a rigidez da carcaça do pneu de construção
    * normal impõe uma resistência adicional, fazendo com que a pressão real de
    * contato seja em média 20% superior à pressão de inflação, ou seja,
    * aplica o fator de correção de 1,2.
     */
    /*VAN DEN AKKER, J. J. H. SOCOMO: a soil compaction model to calculate soil
     * stresses and the subsoil carrying capacity.
     * Soil & Tillage Research, Amsterdam, v. 79, n. 1, p. 113-127, set. 2004
     * */
}
