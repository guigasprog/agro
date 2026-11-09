-- 1. Inserindo na tabela pai (equipamento)
-- O peso_total reflete o MTOW (Maximum Takeoff Weight - Peso Máximo de Decolagem)
INSERT INTO equipamento (id, tipo_equipamento, nome, nome_fabricante, peso_total) VALUES
                                                                                      ('389437b0-7389-4ba3-b8d1-ebf7e8a9310b', 'DRONE', 'Agras T40', 'DJI', 90.0),       -- Pulverização Pesada
                                                                                      ('6b81c2f1-9d58-45a9-9e8a-821f57d6b38c', 'DRONE', 'P100 Pro', 'XAG', 90.0),       -- Pulverização Pesada
                                                                                      ('9154a8b7-6f14-4190-8a21-729c3d9a102d', 'DRONE', 'Agras T10', 'DJI', 24.8),       -- Pulverização Leve
                                                                                      ('4f9e1a7b-3b8c-4d2a-a9f5-1b6c7d8e9f0a', 'DRONE', 'Mavic 3 Multispectral', 'DJI', 1.05), -- Mapeamento NDVI
                                                                                      ('e2b8d4f1-6a9c-43e7-8b5f-2c1a9d0e7b3f', 'DRONE', 'eBee Ag', 'SenseFly', 1.6);     -- Mapeamento Asa Fixa

-- 2. Inserindo na tabela filha (drone)
-- Conforme a modelagem, no momento a tabela filha apenas herda o ID.
INSERT INTO drone (id) VALUES
                           ('389437b0-7389-4ba3-b8d1-ebf7e8a9310b'),
                           ('6b81c2f1-9d58-45a9-9e8a-821f57d6b38c'),
                           ('9154a8b7-6f14-4190-8a21-729c3d9a102d'),
                           ('4f9e1a7b-3b8c-4d2a-a9f5-1b6c7d8e9f0a'),
                           ('e2b8d4f1-6a9c-43e7-8b5f-2c1a9d0e7b3f');

-- 3. Inserindo os Limites Operacionais e Agrometeorológicos
-- Nota: Os valores estão em BIGINT, conforme definido na tabela limite.
INSERT INTO limite (equipamento_id, tipo, valor_minimo, valor_maximo) VALUES
-- =======================================================================
-- DJI Agras T40 (Pulverização)
-- Limite mecânico de voo: 28 km/h (8 m/s).
-- =======================================================================
('389437b0-7389-4ba3-b8d1-ebf7e8a9310b', 'TEMPERATURA', 0, 45),
('389437b0-7389-4ba3-b8d1-ebf7e8a9310b', 'VENTO', 0, 28),

-- =======================================================================
-- XAG P100 Pro (Pulverização)
-- Concorrente direto do T40. Refrigeração robusta.
-- =======================================================================
('6b81c2f1-9d58-45a9-9e8a-821f57d6b38c', 'TEMPERATURA', 0, 40),
('6b81c2f1-9d58-45a9-9e8a-821f57d6b38c', 'VENTO', 0, 28),

-- =======================================================================
-- DJI Agras T10 (Pulverização)
-- Menor inércia térmica, bateria sofre mais em calor extremo.
-- =======================================================================
('9154a8b7-6f14-4190-8a21-729c3d9a102d', 'TEMPERATURA', 0, 45),
('9154a8b7-6f14-4190-8a21-729c3d9a102d', 'VENTO', 0, 28),

-- =======================================================================
-- DJI Mavic 3 Multispectral (Mapeamento)
-- Sem restrição de pulverização. Maior resistência mecânica a ventos fortes.
-- Pode operar em temperaturas negativas.
-- =======================================================================
('4f9e1a7b-3b8c-4d2a-a9f5-1b6c7d8e9f0a', 'TEMPERATURA', -10, 40),
('4f9e1a7b-3b8c-4d2a-a9f5-1b6c7d8e9f0a', 'VENTO', 0, 43),

-- =======================================================================
-- SenseFly eBee Ag (Mapeamento - Asa Fixa)
-- Aerodinâmica permite voos com ventos de até 46 km/h.
-- =======================================================================
('e2b8d4f1-6a9c-43e7-8b5f-2c1a9d0e7b3f', 'TEMPERATURA', -15, 40),
('e2b8d4f1-6a9c-43e7-8b5f-2c1a9d0e7b3f', 'VENTO', 0, 46);