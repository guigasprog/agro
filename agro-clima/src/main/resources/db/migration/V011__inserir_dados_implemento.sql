-- 1. Inserindo na tabela pai (equipamento)
INSERT INTO equipamento (id, tipo_equipamento, nome, nome_fabricante, peso_total) VALUES
-- Implementos de Trator
('c84a51e2-9b3f-4e6a-8d7c-1f5b2e3a4c6d', 'IMPLEMENTO', 'Subsolador SPAT 5 Hastes', 'Baldan', 1100.0),       -- Montado Traseiro
('e1b7c4a9-2d5f-438b-9e6c-7a3d1f8b4e2c', 'IMPLEMENTO', 'Grade Aradora GAPCR 18 Discos', 'TATU Marchesan', 2340.0), -- Arrasto
('a5d8f1b2-7e4c-493a-8b6d-2c9f5e1a3b7d', 'IMPLEMENTO', 'Plantadeira 2100 (12 Linhas)', 'John Deere', 4500.0),     -- Arrasto
('f3b6e1a4-8d9c-425f-b7a1-5c2e3d9f4a8b', 'IMPLEMENTO', 'Pá Carregadeira Frontal PAD 1750', 'Stara', 850.0),     -- Frontal

-- Implementos de Drone (Payloads / Acessórios)
('d2a1c4b7-9e6f-458a-8c3b-1d7e2f5a9c4b', 'IMPLEMENTO', 'Sistema de Pulverização T40 (40L)', 'DJI', 40.0),       -- Acessório
('b7e5a1c3-4d8f-492e-a6b1-3f9d2c5e8a7b', 'IMPLEMENTO', 'Espalhador de Sólidos T40 (50kg)', 'DJI', 50.0),        -- Acessório
('9f4d1e2a-5b8c-4a3e-b7d6-8c1a9f5b2e4d', 'IMPLEMENTO', 'Câmera Multiespectral RedEdge-P', 'MicaSense', 0.3);    -- Acessório

-- 2. Inserindo na tabela filha (implemento)
-- A coluna tipo_implemento foi preenchida fazendo um mapeamento direto com as categorias operacionais
-- e os Tipos de Acoplamento do sistema.
INSERT INTO implemento (id, tipo_implemento) VALUES
                                                 ('c84a51e2-9b3f-4e6a-8d7c-1f5b2e3a4c6d', 'MONTADO_TRASEIRO'),
                                                 ('e1b7c4a9-2d5f-438b-9e6c-7a3d1f8b4e2c', 'ARRASTO_BARRA_TRACAO'),
                                                 ('a5d8f1b2-7e4c-493a-8b6d-2c9f5e1a3b7d', 'ARRASTO_BARRA_TRACAO'),
                                                 ('f3b6e1a4-8d9c-425f-b7a1-5c2e3d9f4a8b', 'FRONTAL'),
                                                 ('d2a1c4b7-9e6f-458a-8c3b-1d7e2f5a9c4b', 'ACESSORIO'),
                                                 ('b7e5a1c3-4d8f-492e-a6b1-3f9d2c5e8a7b', 'ACESSORIO'),
                                                 ('9f4d1e2a-5b8c-4a3e-b7d6-8c1a9f5b2e4d', 'ACESSORIO');