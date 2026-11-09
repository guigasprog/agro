## Classe: `CalcularBulboUmido`

### Visão Geral

Responsável por estimar a temperatura de bulbo úmido, uma variável meteorológica nescessária para o cálculo do índice Delta T.


### Fundamentação Teórica

A determinação de propriedades psicrométricas, quando não são aferidas diretamente por instrumentos meteorológicos (como os termômetros de bulbo molhado físicos), exige a aplicação de modelos matemáticos baseados na termodinâmica do ar úmido.

* A temperatura de bulbo úmido representa o estado de equilíbrio térmico alcançado quando o ar sofre resfriamento em decorrência da evaporação da água, processo que consome energia na forma de calor latente.


* Para simular este processo, o código utiliza a equação psicrométrica abordada na revisão bibliográfica do sistema e aplica o método matemático de bisseção para encontrar o equilíbrio.



### Detalhamento da Implementação

#### `getPressaoVaporSaturacao(double temperaturaC)`

Método auxiliar privado que calcula a pressão de vapor de saturação (em hPa) para uma determinada temperatura.

* Utiliza a aproximação da fórmula de Magnus (`6.112 * Math.exp((17.62 * T) / (243.12 + T))`), uma modelagem matemática padrão em psicrometria para descrever a pressão exercida pelo vapor d'água quando o ar está saturado.

#### `execute(Double temperaturaArC, Double umidadeRelativaPct, Double pressaoAtmosfericaHPa)`

Método estático principal que orquestra a estimativa do bulbo úmido.

* **Tratamento Inicial:** O método aplica a função `Math.max` e `Math.min` para garantir que a umidade informada seja mantida rigorosamente entre 0 e 100%, calculando em seguida a pressão de vapor real.
* **Método Numérico de Bisseção:** O algoritmo estabelece um limite inferior (-60.0) e um superior (a temperatura do ar atual) e realiza uma busca binária no intervalo.


* **Iterações e Convergência:** O laço de repetição (`for`) é fixado em 60 iterações, 
* iterando até convergir para o ponto onde a umidade relativa calculada se iguala à saturação total. 
* A cada iteração:
    1. O valor de teste `bulboUmido` é definido como a metade dos limites atuais.
    2. O coeficiente psicrométrico (A) é recalculado.
    3. A equação psicrométrica `e = es(Tw) - A * P * (T - Tw)` é utilizada para verificar o erro (resíduo) da estimativa.
    4. Dependendo do sinal do resíduo (positivo ou negativo), o limite superior ou inferior é substituído pelo valor testado, reduzindo o intervalo de busca pela metade.


* Ao final das repetições, a função retorna a temperatura termodinâmica de bulbo molhado com precisão de múltiplas casas decimais, garantindo a exatidão exigida para as etapas seguintes do motor de decisão.
* Para validar a equação foi feito testes usando valores de exercicios do artigo de psicometria.

