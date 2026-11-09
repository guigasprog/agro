package analiseClimatica.domain.service.compactacao;

// usar raio de contato superestima a resposta
/* melhora para trabalhos futuros melhorar o calculo, utilizando
* uma malha retangular de cargas pontuais utilizado originalmente no modelo
* de SOCOMO.
*/
public class CalcularTensaoVertical {

    /**
     * Calcula a tensão vertical (em kPa) em uma determinada profundidade.
     * * @param pressaoContato Pressão média na interface pneu-solo (kPa).
     * @param raioContato    Raio real equivalente do rodado (m).
     * @param profundidade   Profundidade no perfil do solo (m).
     * @param fatorFroehlich Fator de concentração de tensões (v).
     * @return Tensão vertical calculada (kPa).
     */
    public static double execute(double pressaoContato, double raioContato, double profundidade, int fatorFroehlich) {

        // Condição de Contorno 1: Na superfície, a tensão aplicada é igual à pressão de contato.
        if (profundidade <= 0.0) {
            return pressaoContato;
        }

        // 1. Calcula o cosseno do ângulo alfa da geometria do bulbo de tensão
        double hipotenusa = Math.sqrt(Math.pow(raioContato, 2) + Math.pow(profundidade, 2));
        double cosAlfa = profundidade / hipotenusa;

        // 2. Aplica o fator de concentração de Fröhlich
        double cosAlfaElevadoFroehlich = Math.pow(cosAlfa, fatorFroehlich);

        // 3. Calcula a tensão vertical teórica (solução de Söhne/Boussinesq para área circular)
        return  pressaoContato * (1.0 - cosAlfaElevadoFroehlich);
    }

    /* O modelo SOCOMO (VAN DEN AKKER, 2004) propõe a discretização da interface pneu-solo
    * em uma malha retangular de cargas pontuais, aplicando o princípio da superposição vetorial.
    * Embora de alta fidelidade morfológica, esta abordagem impõe uma alta complexidade computacional.
    * */

   /* Para a otimização computacional do algoritmo de predição proposto neste estudo,
    * adotou-se a solução puramente analítica da mesma teoria utilizada no modelo SOCOMO,
    * que integra a carga sobre uma área de contato circular plana proposto por Koolen & Kuipers, 1983.
    * Existem modelos computacionais contemporâneos de predição de tensão no solo, como o SoilFlex,
    * que faz uso dessa equação (Keller et al., 2007).
    * Esta abordagem garante o rigor físico na predição da compactação vertical,
    * mantendo o controle sobre a dinâmica do fator de concentração de acordo com o
    * estado do solo, ao mesmo tempo em que viabiliza a execução de múltiplos cenários
    * em tempo real no motor de cálculo do sistema de apoio à decisão.
    */

    /* Contudo, o estudo de Keller (2005), demonstra que a simplificação para um raio circular
    * equivalente na equação de Boussinesq resulta em uma superestimação do pico de tensão vertical
    * na ordem de 10% a 20%. Para o presente trabalho essa superestimação matemática da tensão atuará
    * de forma benéfica como um fator de segurança intrínseco ao motor de cálculo, mantendo o
    * conservadorismo na recomendação da janela operacional, e para futuros trabalhos implementar a
    * melhora desse cálculo para utilizar a malha de cargas pontuais proposta pelo modelo SOCOMO.
     */

    /*DIAS JUNIOR, M. S.; PIERCE, F. J. A simple procedure for estimating capacity of a
    * soil to resist compaction. Soil and Tillage Research, v. 36, n. 3-4, p. 175-192, 1995.
    */
    /*KELLER, T. A model for the prediction of the contact area and the distribution of
    * vertical stress below agricultural tyres from basic tyre and load parameters.
    * Soil and Tillage Research, Amsterdam, v. 80, n. 1-2, p. 71-84, 2005.
    */
    /*VAN DEN AKKER, J. J. H. SOCOMO: a soil compaction model to calculate soil
    * stresses and the subsoil carrying capacity.
    * Soil & Tillage Research, Amsterdam, v. 79, n. 1, p. 113-127, set. 2004
    * */

}