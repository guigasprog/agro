## Classe: `CalcularCapacidadeSuporteDinamica`

### Visão Geral

A classe `CalcularCapacidadeSuporteDinamica` atua como um serviço central no módulo de compactação, responsável por estimar a capacidade de suporte de carga do solo, também chamada de pressão ou tensão de pré-compressão. Esta métrica define o limite máximo de tensão que o solo consegue suportar antes de sofrer deformação plástica irreversível (compactação estrutural).

### Fundamentação Teórica

O desenvolvimento dessa classe visa contornar uma limitação dos modelos europeus, como o SOCOMO original, que utilizam tabelas estáticas de força do solo. Para as condições tropicais, a resistência mecânica do solo é fortemente dependente do seu estado hídrico.

* Segundo a literatura (Lima et al., 2006), a presença de água facilita o deslocamento entre as partículas do solo, reduzindo significativamente sua capacidade de suporte de carga.


* Para modelar esse comportamento dinâmico, o sistema implementa a função de pedotransferência baseada no decaimento exponencial proposta por Dias Junior (1994). Esta função descreve como o limite de resistência do solo despenca à medida que a água entra no sistema.



A equação matemática implementada é:
$\sigma_p = 10^{(a+bU)}$

Onde:

* $\sigma_p$: É a pressão de pré-consolidação do solo (capacidade máxima de suporte de carga).
* $U$: É a umidade gravimétrica do solo.
* $a$ e $b$: São coeficientes empíricos de ajuste da regressão. Eles representam parâmetros físicos obtidos via análise laboratorial para calibrar a curva de resistência de um tipo específico de solo.

### Detalhamento da Implementação

#### `execute(Solo solo, double umidadeVolumetrica)`

O método estático responsável por gerar a estimativa contínua da capacidade de suporte de carga.

* **Parâmetros de Entrada:** Recebe a entidade `Solo`, que contém as propriedades físicas do talhão, e a `umidadeVolumetrica` contínua (m³/m³) fornecida pelas previsões de reanálise climática (API Open-Meteo).


* **Extração e Inferência Pedológica:** O método extrai a densidade e os coeficientes de intercepto ($a$) e taxa de decaimento ($b$) do banco de dados. Caso o usuário não possua os ensaios laboratoriais exatos cadastrados (`== null`), o sistema aciona uma regra de inferência, utilizando atributos pré-determinados com base na textura do solo (`TexturaSolo.MEDIO`) para garantir a viabilidade da execução.


* **Conversão de Umidade:** Para encaixar a variável da API climática na fórmula teórica, o sistema converte a umidade volumétrica em umidade gravimétrica ($U$) realizando a divisão algébrica: `umidadeVolumetrica / densidadeSolo`.
* **Cálculo da Equação de Dias Junior:** O código aplica a equação exponencial nativamente em Java: `Math.pow(10, (a + (b * umidadeGravimetrica)))`.


* **Piso Estrutural de Contorno:** Por fim, o retorno é filtrado pela função `Math.max(capacidadeCarga, PISO_ESTRUTURAL_KPA)`. O limite estático `PISO_ESTRUTURAL_KPA` (40.0 kPa) atua como um recurso de segurança matemática para representar a capacidade residual mínima do solo em estado de completa saturação (lama), evitando que a curva exponencial retorne valores impraticáveis ou nulos que inviabilizariam o motor de regras.