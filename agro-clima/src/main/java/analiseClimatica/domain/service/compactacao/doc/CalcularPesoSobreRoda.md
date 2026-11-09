## Classe: `CalcularPesoSobreRoda`

### Visão Geral

Responsável por determinar a carga dinâmica individual exercida sobre cada roda do maquinário agrícola (em kN). Este valor é uma etapa preliminar fundamental para os cálculos do modelo SOCOMO, pois atua como a variável de força peso aplicada sobre o solo para encontrar a pressão e a área de contato do pneu.

### Fundamentação Teórica

Para que a simulação da carga vertical seja fiel à realidade da operação de campo, não se pode simplesmente dividir o peso estático do trator pelo número total de rodas. A modelagem física precisa considerar a cinemática de tratores, em especial a Transferência Dinâmica de Peso (TDP).

* Durante a operação, as forças de tração geradas pelo implemento acoplado alteram o centro de gravidade e redistribuem a massa total do conjunto.


* Esse fenômeno causa um alívio de peso no eixo dianteiro e uma sobrecarga natural no eixo traseiro (SERRANO, 2007; FARIAS et al., 2019).


* Além disso, a TDP varia conforme o tipo de acoplamento: implementos montados via sistema de três pontos transferem 100% de sua massa aos eixos do trator, enquanto implementos de arrasto transferem uma fração menor para a barra de tração, fixada algoritmicamente em 15% (ASABE, 2011).


* Após calcular a carga dinâmica resultante acumulada em um eixo específico (dianteiro ou traseiro), divide-se esse montante pelo número de rodas daquele eixo para estimar a força vertical real aplicada por pneu ao solo.



### Detalhamento da Implementação

#### `execute(double pesoTotalTrator, double distribuicaoDinamica, double numeroDeRodasPorExixo)`

Este método estático centraliza o cálculo algébrico da carga por roda e é chamado separadamente para o eixo dianteiro e para o eixo traseiro durante a avaliação de risco de compactação.

* **Parâmetros de Entrada:**
* `pesoTotalTrator`: Representa o peso dinâmico total do conjunto em kN. Na orquestração do sistema, esse valor engloba o peso do trator somado à parcela de peso transferida pelo implemento (TDP).


* `distribuicaoDinamica`: Representa o percentual (fração) de distribuição de peso que incide sobre o eixo que está sendo avaliado.


* `numeroDeRodasPorExixo`: A quantidade de rodas presentes no eixo (ex: 2 para eixo simples, 4 para rodados duplos).




* **Lógica de Execução:** A operação `(pesoTotalTrator * distribuicaoDinamica) / numeroDeRodasPorExixo` primeiramente isola a carga exclusiva do eixo desejado e, em seguida, a fraciona pelo número de pneus apoiados no solo.


* **Retorno:** Retorna um valor `Double` (em kN) da força pontual de uma única roda, servindo de base direta para as equações de predição de tração de Upadhyaya et al. (1989) e modelagem de tensões do SOCOMO (Van den Akker, 2004), referenciadas na documentação do código.