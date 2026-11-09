## Classe: `CalcularAreaDeContatoDoPneu`

### Visão Geral

Responsável por estimar a área da superfície de contato entre o pneu do maquinário agrícola e o solo. Este cálculo é uma etapa intermediária fundamental do módulo de predição de compactação, pois a área calculada será utilizada posteriormente para extrair o raio geométrico e calcular a propagação das tensões no perfil do solo.

### Fundamentação Teórica

A deformação tridimensional sofrida por um pneu em contato com o solo é um fenômeno de alta complexidade. Para viabilizar a modelagem computacional, o sistema utiliza as premissas do modelo de Upadhyaya et al. (1989), que aplica uma simplificação geométrica assumindo que a superfície de contato pneu-solo é plana e possui um formato retangular.

A relação base define que a pressão é a força dividida pela área: $p \approx \frac{W}{b.l}$.
Como a área de contato ($A$) é a multiplicação da largura ($b$) pelo comprimento ($l$), a equação implementada de forma organizada se torna:

$A \approx \frac{W}{p}$

Onde:

* **W:** Carga dinâmica no eixo (a força peso que está sendo aplicada sobre aquela roda específica).


* **p:** Pressão de contato.


* **A:** Área de contato.



**Considerações sobre a Pressão de Contato:**
Conforme descrito na documentação (JavaDoc) da classe e na literatura do modelo analítico SOCOMO (Van den Akker, 2004), a determinação da pressão de contato utiliza o princípio prático estabelecido por Koolen e Kuipers (1983). A rigidez da carcaça do pneu de construção normal impõe uma resistência mecânica adicional à deformação. Por conta disso, a pressão real transferida ao solo não é igual à pressão do ar dentro do pneu, mas sim cerca de 20% superior à sua pressão de inflação ($P_{real} = 1,2 * P_{inflação}$).

### Detalhamento da Implementação

#### `execute(Double pesoSobreRoda, Double pressaoContato)`

O método principal e estático da classe encarregado de calcular e retornar a área de contato em metros quadrados ($m^2$).

* **Parâmetros de Entrada:**
* `pesoSobreRoda`: A carga dinâmica exercida especificamente sobre a roda em questão (equivalente à variável $W$ da teoria).
* `pressaoContato`: A pressão real de contato pneu-solo (equivalente à variável $p$ da teoria). Conforme a documentação teórica, espera-se que o valor passado aqui já tenha embutido o fator de correção de 1.2 sobre a pressão de inflação interna.


* **Lógica de Execução:** O método aplica diretamente a fórmula reorganizada de Upadhyaya et al. (1989), dividindo o peso sobre a roda pela pressão de contato (`pesoSobreRoda / pressaoContato`).


* **Retorno:** Retorna um valor numérico `Double` que representa a área da "pegada" do pneu ($m^2$), permitindo que o motor de regras prossiga com o cálculo da distribuição de tensões verticais.