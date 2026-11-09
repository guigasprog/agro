-- Habilita extensão para UUID (caso ainda não tenha)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. Criação da Tabela Pai (Contém apenas o que é comum a todos)
CREATE TABLE equipamento (
                             id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                             tipo_equipamento VARCHAR(12) NOT NULL CHECK (tipo_equipamento IN ('DRONE','TRATOR','AVIAO','IMPLEMENTO')),
                             nome VARCHAR(150) NOT NULL,
                             nome_fabricante VARCHAR(150),
                             peso_total DOUBLE PRECISION
);

-- 2. Criação da Tabela Filha: Trator
CREATE TABLE trator (
    -- O id aqui não gera um novo UUID. Ele pega o ID da tabela 'equipamento'.
    -- ON DELETE CASCADE garante que, se apagar o equipamento base, o trator some também.
                        id UUID PRIMARY KEY REFERENCES equipamento(id) ON DELETE CASCADE,

                        distribuicao_estatica_traseira DOUBLE PRECISION,
                        pressao_pneu_dianteiro DOUBLE PRECISION,
                        pressao_pneu_traseiro DOUBLE PRECISION,
                        qt_rodas_dianteiras INTEGER,
                        qt_rodas_traseiras INTEGER
);

-- 3. Criação da Tabela Filha: Implemento
CREATE TABLE implemento (
                            id UUID PRIMARY KEY REFERENCES equipamento(id) ON DELETE CASCADE,

                            tipo_implemento VARCHAR(100)
);
CREATE TABLE drone (
    -- O ID é a chave primária e também a chave estrangeira que aponta para o equipamento base
                       id UUID PRIMARY KEY REFERENCES equipamento(id) ON DELETE CASCADE
);
-- NOTA SOBRE DRONES E AVIÕES:
-- Se eles não tiverem nenhum atributo específico (possuem apenas nome, peso, fabricante),
-- eles não precisam de uma tabela filha! Ficam salvos apenas na tabela 'equipamento'.
-- Se no futuro um Drone precisar de 'quantidade_baterias', basta criar a tabela 'drone'.

CREATE TABLE limite (
                        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                        equipamento_id UUID NOT NULL,
                        tipo VARCHAR(100) NOT NULL,
                        valor_minimo BIGINT,
                        valor_maximo BIGINT,
                        CONSTRAINT fk_limite_equipamento
                            FOREIGN KEY (equipamento_id)
                                REFERENCES equipamento(id)
                                ON DELETE CASCADE
);