-- 1. Habilita extensões necessárias no PostgreSQL

-- 5. Criação da tabela Clima
CREATE TABLE clima (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_area_agricola UUID NOT NULL,
    data TIMESTAMP NOT NULL,
    umidade DOUBLE PRECISION,
    precipitacao DOUBLE PRECISION,
    pressao_superficie DOUBLE PRECISION,
    velocidade_vento DOUBLE PRECISION,
    umidade_volumetrica DOUBLE PRECISION NOT NULL,
    visibilidade DOUBLE PRECISION NOT NULL,
    temperatura_bulbo_seco DOUBLE PRECISION,
    temperatura_bulbo_umido DOUBLE PRECISION,
    delta_t DOUBLE PRECISION,
    capacidade_suporte_solo DOUBLE PRECISION,

    CONSTRAINT fk_clima_area_agricola
        FOREIGN KEY (id_area_agricola)
        REFERENCES area_agricola(id)
        ON DELETE CASCADE,

    CONSTRAINT uk_clima_area_agricola_data
        UNIQUE (id_area_agricola, data)
);
-- Índices para otimização de performance nas consultas do motor de decisão
CREATE INDEX idx_clima_data ON clima(data);
CREATE INDEX idx_clima_area_agricola ON clima(id_area_agricola);