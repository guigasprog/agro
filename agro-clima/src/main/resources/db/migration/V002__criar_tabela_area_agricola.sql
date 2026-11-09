-- pgcrypto: Necessário para gerar UUIDs automaticamente com gen_random_uuid()
-- postgis: Necessário para habilitar cálculos e armazenamento de dados espaciais/geometria
CREATE EXTENSION IF NOT EXISTS "postgis";
-- 4. Criação da tabela Area Agricola
CREATE TABLE solo (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(50) NOT NULL,
    textura_solo VARCHAR(20) NOT NULL CHECK (textura_solo IN ('ARGILOSO', 'ARENOSO', 'MEDIO')),
    resistencia_maxima_estrutural_solo DOUBLE PRECISION,
    taxa_decaimento_solo DOUBLE PRECISION,
    limiar_dureza DOUBLE PRECISION,
    limiar_plasticidade DOUBLE PRECISION
);
-- Tabela
CREATE TABLE area_agricola (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_solo UUID,
    nome VARCHAR(150) NOT NULL,
    cidade VARCHAR(100) NOT NULL,
    estado VARCHAR(50) NOT NULL,
    -- Tipo espacial PostGIS. 4326 refere-se ao sistema de coordenadas WGS 84 (GPS Padrão)
    geometria GEOMETRY(Polygon, 4326),
    hectares DOUBLE PRECISION NOT NULL,
    ultima_atualizacao_clima DATE,
    ultima_atualizacao_pulverizacao DATE,
    ultima_atualizacao_compactacao DATE,

    CONSTRAINT fk_area_agricola_solo FOREIGN KEY (id_solo) REFERENCES solo(id) ON DELETE CASCADE
);
