## Classe: `CalcularFatorFroehlich`

### Visão Geral

A classe `CalcularFatorFroehlich` é responsável por determinar dinamicamente o Fator de Concentração de Fröhlich ($\nu$), um parâmetro utilizado nas equações de Boussinesq modificadas para definir como as tensões mecânicas geradas pelos pneus se propagam e se concentram no perfil do solo. No contexto da aplicação, esta métrica é fundamental para a avaliação do risco de compactação, interligando a física clássica do solo com dados agrometeorológicos em tempo real.

### Fundamentação Teórica

O modelo analítico SOCOMO utiliza as modificações de Fröhlich (1934) para contabilizar a tendência que o solo tem de concentrar as tensões ao redor do eixo de carga (vertical). Solos mais macios e fracos, com maior teor de umidade, concentram mais a tensão em profundidade do que solos secos e rígidos.

Segundo a literatura de Koolen & Kuipers (1983) e Van den Akker (2004), o fator $\nu$ é classificado em três estágios mecânicos:

* $\nu = 3$: Solo duro/seco (comportamento com maior suporte estrutural e distribuição de tensões elástica ideal).


* $\nu = 4$: Solo em condições normais (estado friável, ideal para o manejo).


* $\nu = 5$: Solo macio ou úmido (maior concentração de tensões em profundidade, indicando vulnerabilidade).



Para determinar esse fator de forma dinâmica, o sistema cruza a umidade volumétrica contínua (m³/m³) obtida pela API Open-Meteo para a camada de 7 a 28 cm com os Limites de Consistência (Limites de Atterberg) correspondentes às diferentes classes texturais do solo.

* **Solos Argilosos e Médios:** A transição para o estado plástico ($\nu = 5$) ocorre no momento em que a água passa a atuar de forma expressiva como um lubrificante entre as partículas, o que reduz drasticamente o atrito interno e a pressão de pré-compactação (Silva; Cabeda, 2006).


* **Solos Arenosos:** Exigem uma parametrização diferenciada, pois perdem a coesão estrutural com níveis de umidade significativamente menores, visto que frequentemente não possuem um limite de plasticidade bem definido (comportamento não plástico) (Luciano et al., 2012).



### Detalhamento da Implementação

#### `execute(Solo solo, double umidadeVolumetrica)`

O método principal e estático recebe a entidade `Solo` e o dado hídrico para calcular o fator mecânico de propagação de força.

* **Definição dos Limiares de Consistência:**
  O código utiliza um bloco `switch` avaliando a `TexturaSolo` para atribuir os valores padrão recomendados pela Embrapa (2017) para as variáveis `limiarPlasticidade` (equivalente ao LP) e `limiarDureza` (equivalente ao Limite de Contração).


* *Argiloso:* Apresenta alta capacidade de retenção hídrica, logo seus limiares de deformação são mais altos (0.38 para LP, 0.22 para LC).
* *Médio:* Valores intermediários (0.24 para LP, 0.12 para LC).
* *Arenoso:* Satura e colapsa com baixos volumes de água (0.12 para LP, 0.06 para LC).


* **Validação de Dados Aferidos:**
  Caso o agricultor tenha cadastrado os limites específicos da sua área via laudo laboratorial, a rotina `Objects.isNull()` garante que os valores reais do `Solo` sobrescrevam os parâmetros genéricos de textura, aumentando a precisão da modelagem.
* **Regra de Decisão do Estado Mecânico:**
  Com os limites estabelecidos, o sistema compara a `umidadeVolumetrica` prevista para a janela operacional:
1. `if (umidadeVolumetrica >= limiarPlasticidade)`: O solo ultrapassou a barreira de segurança, tornando-se macio/plástico. Retorna `NU_SOLO_PLASTICO` ($5$).


2. `else if (umidadeVolumetrica <= limiarDureza)`: O solo está seco e firme, no seu estado de maior resistência. Retorna `NU_SOLO_DURO` ($3$).


3. Se a umidade estiver entre os dois limites, o sistema assume a condição segura de trabalho. Retorna `NU_SOLO_FRIAVEL` ($4$).