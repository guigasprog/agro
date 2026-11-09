## Classe: `CalcularTensaoVertical`

### Visão Geral

A classe `CalcularTensaoVertical` é responsável por calcular a propagação da tensão vertical (em kPa) imposta pelo maquinário agrícola em uma determinada profundidade do perfil do solo. Este cálculo é a etapa central do modelo de risco de compactação, fornecendo o valor de estresse físico que será comparado à capacidade de suporte de carga do solo.

### Fundamentação Teórica

O modelo preditivo computacional fundamenta-se na Teoria de Boussinesq (1885), que descreve a distribuição de tensões em uma massa sólida semi-infinita e homogênea. Para adaptar essa teoria à realidade agrícola, aplicam-se as modificações de Fröhlich (1934), que introduzem um fator de concentração ($\nu$) para ajustar o comportamento da tensão em solos com diferentes níveis de umidade e resistência.

* **Simplificação Analítica Computacional:** O modelo analítico SOCOMO original propõe a discretização da interface pneu-solo em uma malha retangular de cargas pontuais e aplica o princípio da superposição vetorial. Devido à altíssima complexidade computacional desta abordagem morfológica, o algoritmo adota a solução puramente analítica integrada sobre uma área de contato circular plana, proposta por Koolen & Kuipers (1983).


* **A Equação:** A solução analítica deduzida para o centro do círculo de carga resulta na equação (conforme base da Equação 1 do estudo):


$$\sigma_z = q \cdot [1 - (\cos\alpha)^\nu]$$


*Onde o cosseno do ângulo de distribuição ($\cos\alpha$) é derivado da relação geométrica entre a profundidade ($z$) e a hipotenusa formada com o raio de contato ($r$):* $\cos\alpha = \frac{z}{\sqrt{r^2 + z^2}}$.


* **Fator de Segurança (Overestimation):** Segundo Keller (2005), assumir um formato puramente circular na equação de Boussinesq gera uma superestimação do pico de tensão vertical na ordem de 10% a 20%. No contexto deste Sistema de Apoio à Decisão, essa superestimação atua de forma benéfica como um fator de segurança intrínseco, mantendo o conservadorismo na emissão dos alertas da janela operacional. Como proposta para trabalhos futuros, fica sugerida a melhoria deste cálculo implementando a malha de cargas pontuais original do SOCOMO.



### Detalhamento da Implementação

#### `execute(double pressaoContato, double raioContato, double profundidade, int fatorFroehlich)`

O método estático responsável por calcular o valor da tensão dissipada na profundidade `z`.

* **Parâmetros de Entrada:**
* `pressaoContato` ($q$): A pressão efetiva na superfície da interface pneu-solo (em kPa).
* `raioContato` ($r$): O raio geométrico equivalente do pneu (em metros).
* `profundidade` ($z$): A profundidade no perfil do solo onde se deseja medir a tensão (em metros).
* `fatorFroehlich` ($\nu$): O fator de concentração dinâmico previamente calculado baseado na textura e umidade volumétrica.


* **Condição de Contorno:** Se a `profundidade <= 0.0` (na superfície exata), o código retorna a própria `pressaoContato`, visto que a tensão ainda não sofreu dissipação cônica.
* **Lógica de Execução:**
1. Calcula a `hipotenusa` do triângulo formado pela profundidade e o raio do pneu, utilizando Pitágoras: `Math.sqrt(Math.pow(raioContato, 2) + Math.pow(profundidade, 2))`.
2. Extrai a relação geométrica do bulbo de tensão definindo `cosAlfa = profundidade / hipotenusa`.
3. Aplica o expoente do Fator de Fröhlich sobre a relação trigonométrica: `cosAlfaElevadoFroehlich = Math.pow(cosAlfa, fatorFroehlich)`.
4. Aplica a dedução algébrica de Boussinesq/Söhne, multiplicando a pressão inicial pelo diferencial de dissipação: `pressaoContato * (1.0 - cosAlfaElevadoFroehlich)`.


* **Retorno:** Retorna a tensão vertical calculada em kPa (como tipo numérico primitivo `double`), permitindo ao laço de iteração do motor de regras avaliar o risco centímetro a centímetro no perfil do terreno.