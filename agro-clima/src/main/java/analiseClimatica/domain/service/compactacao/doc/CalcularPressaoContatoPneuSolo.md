## Classe: `CalcularPressaoContatoPneuSolo`

### Visão Geral

A classe `CalcularPressaoContatoPneuSolo` é responsável por determinar a pressão real exercida na interface mecânica entre o pneu do maquinário agrícola e a superfície do solo. Este cálculo é essencial para o módulo de predição de compactação, pois atua como entrada fundamental para calcular posteriormente a área e o raio de contato do pneu.

### Fundamentação Teórica

O cálculo tridimensional da pressão e da área de contato pneu-solo apresenta um grande desafio de modelagem, dado que a determinação simultânea dessas duas variáveis pode gerar uma dependência matemática circular.

* Para solucionar este impasse estrutural, o sistema utiliza a premissa adotada no modelo analítico SOCOMO (Van den Akker, 2004), o qual incorpora o princípio prático estabelecido por Koolen e Kuipers (1983).


* Na prática, a pressão que o pneu efetivamente transmite ao solo não é idêntica à pressão de ar inserida nele. A rigidez inerente à carcaça do pneu de construção normal atua como um fator limitante, impondo uma resistência mecânica adicional no momento em que o pneu sofre deformação contra o solo.


* Como resultado dessa dinâmica, a pressão real de contato acaba sendo, em média, 20% superior à pressão de inflação interna (calibragem).



A equação matemática que representa essa relação física é expressa por:
$P_{real} = 1,2 * P_{inflação}$

### Detalhamento da Implementação

#### `execute(double pressaoInterna)`

O método principal e estático recebe a pressão interna aferida no pneu e aplica o fator de correção empírico preconizado pela literatura.

* **Parâmetros de Entrada:**
* `pressaoInterna`: A pressão atual de inflação do pneu (geralmente medida em kPa, embora a classe abstraia a unidade contanto que mantida a consistência ao longo do sistema).


* **Lógica de Execução:** O código aplica diretamente o fator de correção de 20%, multiplicando a variável de entrada por `1.2`, compensando assim a resistência estrutural das lonas e da borracha da carcaça do pneu.


* **Retorno:** Retorna um valor da classe empacotadora `Double` contendo a pressão de contato ajustada. Este valor será o divisor utilizado posteriormente na classe `CalcularAreaDeContatoDoPneu` para descobrir o tamanho da "pegada" deixada pelo maquinário.