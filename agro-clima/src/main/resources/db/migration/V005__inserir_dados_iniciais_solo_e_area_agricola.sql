INSERT INTO solo (id, nome, textura_solo, resistencia_maxima_estrutural_solo, taxa_decaimento_solo, limiar_dureza, limiar_plasticidade)
VALUES
('b56e6d1e-1212-4c4c-8383-0570ab42702a', 'Terra Roxa', 'ARGILOSO', 1.5, 0.1, 2.0, 1.2),
('c77e6d1e-1212-4c4c-8383-0570ab42702b', 'Solo Arenoso Padrão', 'ARENOSO', 0.8, 0.2, 1.5, 0.8);

INSERT INTO area_agricola (id, id_solo, nome, cidade, estado, geometria, hectares, ultima_atualizacao_clima, ultima_atualizacao_pulverizacao, ultima_atualizacao_compactacao)
VALUES
(
    'a11e6d1e-1212-4c4c-8383-0570ab42702c',
    'b56e6d1e-1212-4c4c-8383-0570ab42702a',
    'Fazenda Esperança - Talhão 1',
    'Campinas',
    'SP',
    ST_GeomFromText('POLYGON((-47.0608 -22.9056, -47.0608 -22.8956, -47.0508 -22.8956, -47.0508 -22.9056, -47.0608 -22.9056))', 4326),
    50.5,
    '2024-01-01',
    '2024-01-02',
    '2024-01-03'
),
(
    'd22e6d1e-1212-4c4c-8383-0570ab42702d',
    'c77e6d1e-1212-4c4c-8383-0570ab42702b',
    'Fazenda São João - Talhão 2',
    'Ribeirão Preto',
    'SP',
    ST_GeomFromText('POLYGON((-47.8108 -21.1756, -47.8108 -21.1656, -47.8008 -21.1656, -47.8008 -21.1756, -47.8108 -21.1756))', 4326),
    120.0,
    CURRENT_DATE,
    CURRENT_DATE,
    CURRENT_DATE
);
