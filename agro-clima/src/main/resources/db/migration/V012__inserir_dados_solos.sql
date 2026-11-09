INSERT INTO solo (
    nome,
    textura_solo,
    resistencia_maxima_estrutural_solo,
    taxa_decaimento_solo,
    limiar_dureza,
    limiar_plasticidade,
    densidade -- << Novo campo adicionado
) VALUES
-- ==========================================
-- SOLOS ARGILOSOS
-- (Alta porosidade total, o que confere MENOR densidade global natural)
-- ==========================================
(
    'Latossolo Vermelho Eutroférrico',
    'ARGILOSO',
    3.15,
    -2.60,
    1.38,
    1.18,
    1.15    -- Estrutura microgranular altamente porosa (tipico de latossolos muito argilosos não compactados)
),
(
    'Nitossolo Háplico',
    'ARGILOSO',
    2.85,
    -2.30,
    1.42,
    1.22,
    1.25    -- Estrutura em blocos, naturalmente um pouco mais denso que o Latossolo
),

-- ==========================================
-- SOLOS DE TEXTURA MÉDIA
-- (Faixa intermediária de volume total de poros)
-- ==========================================
(
    'Argissolo Vermelho-Amarelo',
    'MEDIO',
    2.65,
    -1.85,
    1.52,
    1.35,
    1.42    -- Densidade típica de horizontes superficiais de textura franco-argilo-arenosa
),
(
    'Cambissolo Háplico',
    'MEDIO',
    2.78,
    -2.05,
    1.48,
    1.30,
    1.38    -- Solo de textura média típica (franca ou franco-siltosa)
),

-- ==========================================
-- SOLOS ARENOSOS
-- (Menor volume total de poros, as partículas de areia ocupam mais espaço sólido. MAIOR densidade global)
-- ==========================================
(
    'Neossolo Quartzarênico',
    'ARENOSO',
    2.25,
    -1.25,
    1.68,
    1.45,
    1.65    -- Areia quartzosa pura, os grãos se acomodam juntos, gerando densidade naturalmente alta
),
(
    'Latossolo Amarelo Fase Arenosa',
    'ARENOSO',
    2.52,
    -1.45,
    1.62,
    1.42,
    1.58    -- Apesar de arenoso, tem leve estruturação por óxidos que o deixa um pouco menos denso que a areia pura
);