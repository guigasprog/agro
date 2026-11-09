## Classe: `CalcularRaioContato`

### Visão Geral

A classe `CalcularRaioContato` é responsável por extrair o raio geométrico equivalente da área de contato entre o pneu e o solo. Este valor (em metros) é essencial para a aplicação da fórmula analítica de distribuição de tensões verticais no perfil do solo, baseada na teoria de Boussinesq.

### Fundamentação Teórica

A deformação de um pneu agrícola e a sua respectiva área de contato possuem uma morfologia tridimensional complexa e frequentemente retangular ou elíptica (Upadhyaya et al., 1989).

* O modelo SOCOMO original propõe a discretização da interface pneu-solo em uma malha retangular de cargas pontuais, aplicando o princípio da superposição vetorial.


* No entanto, devido à alta complexidade computacional dessa abordagem morfológica, o sistema adota uma simplificação analítica otimizada, integrando a carga sobre uma área de contato circular plana, conforme proposto por Koolen & Kuipers (1983).


* A partir da área total ($A$), o raio equivalente ($r$) é extraído utilizando a fórmula fundamental da área do círculo: $A = \pi * r^2$, o que resulta na equação isolada $r = \sqrt{\frac{A}{\pi}}$.


* A literatura ressalta que assumir um formato puramente circular tende a concentrar a força e resulta em uma superestimação do pico de tensão vertical no centro do rodado na ordem de 10% a 20% (Keller, 2005), visto que, na realidade, a pressão se distribui de forma mais alongada longitudinalmente.


* No contexto do TCC, essa superestimação atua de forma benéfica como um fator de segurança intrínseco, mantendo o conservadorismo na recomendação da janela operacional. Fica documentado como trabalho futuro a implementação da malha de contato em grid retangular para refinar esta métrica.



### Detalhamento da Implementação

#### `execute(double pesoSobreRoda, double pressaoContato)`

Método estático que orquestra o cálculo do raio geométrico corrigido.

* **Passo 1: Obtenção da Área.** O método invoca primeiramente a classe `CalcularAreaDeContatoDoPneu.execute(pesoSobreRoda, pressaoContato)` para descobrir a área total da "pegada" do pneu (em $m^2$).
* **Passo 2: Raio Circular Geométrico.** Aplica-se a dedução da fórmula do círculo, utilizando as funções nativas do Java: `Math.sqrt(areaContato / Math.PI)`.
* **Passo 3: Fator de Correção.** O algoritmo multiplica o raio geométrico encontrado por `1.12` (um incremento de 12%). Conforme documentado nos comentários do código, este é um fator de correção empírico para pneus radiais operando em solos tropicais macios. Ele simula o "alongamento" da área de contato, aumentando o raio equivalente para diluir levemente o pico de tensão e compensar parcialmente a superestimação causada pelo modelo puramente circular.
* **Retorno:** Retorna o valor final do raio (em metros) no formato `Double`, que será repassado à classe responsável por calcular a tensão vertical ao longo das diferentes profundidades do solo.