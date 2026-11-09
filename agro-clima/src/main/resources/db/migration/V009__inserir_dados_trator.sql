-- 1. Inserindo na tabela pai (equipamento)
INSERT INTO equipamento (id, tipo_equipamento, nome, nome_fabricante, peso_total) VALUES
                                                                                      ('c9d3f1a2-8b4e-4e7a-9c6d-5f2b8a1c9e4d', 'TRATOR', '8320R', 'John Deere', 12500.0),
                                                                                      ('f4a6b2c8-1e9d-4a3b-8f5c-7d2e9a4b1c6f', 'TRATOR', 'Magnum 340', 'Case IH', 13000.0),
                                                                                      ('e7c5d9a1-4b2f-4e8c-9a3d-6b1f8c2e7a5b', 'TRATOR', 'T8.380', 'New Holland', 11800.0),
                                                                                      ('b2f8a4c6-9d1e-4c7a-8b3f-5e9d2c1a4b6f', 'TRATOR', '8S.265', 'Massey Ferguson', 8700.0),
                                                                                      ('a1d9c4b2-7e5f-4a8b-9c2d-3f6e1a8b5c4d', 'TRATOR', 'T250', 'Valtra', 7300.0),
                                                                                      ('d5b2e8a1-3c9f-4d6a-8e7b-2f1a4c9b6d5e', 'TRATOR', '1050 Vario', 'Fendt', 14000.0),
                                                                                      ('f8c1a9d4-6b2e-4f3a-9d8c-5b7e2a1f4c9d', 'TRATOR', '5090E', 'John Deere', 3800.0),
                                                                                      ('e3a9b4c2-8f1d-4e7a-9b5c-6d2f8a1c3e4b', 'TRATOR', 'Steiger 580', 'Case IH', 22000.0),
                                                                                      ('c7d2f5a8-1b9e-4a6c-8f3d-4e1b9a2c5f8d', 'TRATOR', 'T7.260', 'New Holland', 8100.0),
                                                                                      ('b6e1a4c9-2d8f-4b7e-9a5c-3f7d1b8e4a2c', 'TRATOR', '4707', 'Massey Ferguson', 3100.0);

-- 2. Inserindo na tabela filha (trator) respeitando a integridade referencial
INSERT INTO trator (id, distribuicao_estatica_traseira, pressao_pneu_dianteiro, pressao_pneu_traseiro, qt_rodas_dianteiras, qt_rodas_traseiras) VALUES
-- Tratores Pesados (Rodados duplados na traseira)
('c9d3f1a2-8b4e-4e7a-9c6d-5f2b8a1c9e4d', 60.0, 110.0, 100.0, 2, 4), -- JD 8320R: Pressão menor atrás devido ao rodado duplo
('f4a6b2c8-1e9d-4a3b-8f5c-7d2e9a4b1c6f', 62.0, 120.0, 110.0, 2, 4), -- Case Magnum 340
('e7c5d9a1-4b2f-4e8c-9a3d-6b1f8c2e7a5b', 58.0, 115.0, 105.0, 2, 4), -- NH T8.380

-- Tratores Médios-Pesados (Padrão 4x4)
('b2f8a4c6-9d1e-4c7a-8b3f-5e9d2c1a4b6f', 55.0, 130.0, 120.0, 2, 2), -- MF 8S.265
('a1d9c4b2-7e5f-4a8b-9c2d-3f6e1a8b5c4d', 60.0, 140.0, 125.0, 2, 2), -- Valtra T250

-- Alta Tecnologia / Baixa Pressão
('d5b2e8a1-3c9f-4d6a-8e7b-2f1a4c9b6d5e', 56.0, 100.0,  80.0, 2, 2), -- Fendt 1050: Sistema VarioGrip permite pressões de trabalho de até 80 kPa (11,6 psi) para mitigar compactação

-- Tratores Utilitários Leves
('f8c1a9d4-6b2e-4f3a-9d8c-5b7e2a1f4c9d', 65.0, 160.0, 140.0, 2, 2), -- JD 5090E: Pneus menores exigem pressões maiores
('b6e1a4c9-2d8f-4b7e-9a5c-3f7d1b8e4a2c', 62.0, 150.0, 130.0, 2, 2), -- MF 4707

-- Articulados Pesados (Tração Integral)
('e3a9b4c2-8f1d-4e7a-9b5c-6d2f8a1c3e4b', 50.0,  90.0,  90.0, 4, 4), -- Case Steiger 580: Distribuição 50/50, rodado duplo nas 4 pontas reduz a pressão no solo drasticamente

-- Tratores Médios
('c7d2f5a8-1b9e-4a6c-8f3d-4e1b9a2c5f8d', 59.0, 120.0, 110.0, 2, 2); -- NH T7.260

-- 1. Inserindo na tabela pai (equipamento)
INSERT INTO equipamento (id, tipo_equipamento, nome, nome_fabricante, peso_total) VALUES
                                                                                      ('a4c7b2e9-5f1d-4e8a-9c3b-6d2f8a1c5e7b', 'TRATOR', '8R 370 (Rodado Simples/Lastrado)', 'John Deere', 15500.0),
                                                                                      ('d9f2a1c4-8b6e-4f3a-9e7d-5c1b8a4f2d9e', 'TRATOR', 'Magnum 400 (Rodado Simples/Canavieiro)', 'Case IH', 16000.0),
                                                                                      ('f1a8c3d6-9e2b-4a5f-8c7d-4b1e9a2f6c3d', 'TRATOR', 'T8.410 (Rodado Simples)', 'New Holland', 16500.0),
                                                                                      ('e5b9d2a1-4c7f-4e8b-9a3c-6f1d8b2e5a4c', 'TRATOR', 'BH 224 (Configuração Pesada)', 'Valtra', 11500.0),
                                                                                      ('c2d8f1a4-7b9e-4a6c-8f5d-3e1b9a4c2f7d', 'TRATOR', 'MF 8740 S (Rodado Simples)', 'Massey Ferguson', 14000.0);

-- 2. Inserindo na tabela filha (trator)
INSERT INTO trator (id, distribuicao_estatica_traseira, pressao_pneu_dianteiro, pressao_pneu_traseiro, qt_rodas_dianteiras, qt_rodas_traseiras) VALUES
-- JD 8R 370: Peso altíssimo. Como está com rodado simples, a pressão sobe para aguentar a carga.
('a4c7b2e9-5f1d-4e8a-9c3b-6d2f8a1c5e7b', 60.0, 180.0, 200.0, 2, 2),

-- Case Magnum 400: Muito usado em transbordo de cana, com bitola larga, rodado simples e muita carga traseira.
('d9f2a1c4-8b6e-4f3a-9e7d-5c1b8a4f2d9e', 65.0, 170.0, 210.0, 2, 2),

-- NH T8.410: Chassi extremamente pesado. Sem rodado duplo, a tensão no solo é crítica.
('f1a8c3d6-9e2b-4a5f-8c7d-4b1e9a2f6c3d', 60.0, 180.0, 195.0, 2, 2),

-- Valtra BH 224: Trator pesado para sua categoria. A distribuição de 65% na traseira com rodado simples exige alta pressão.
('e5b9d2a1-4c7f-4e8b-9a3c-6f1d8b2e5a4c', 65.0, 160.0, 180.0, 2, 2),

-- MF 8740 S: Trator de alta potência. Com 2 rodas atrás, a carga pontual deforma drasticamente o perfil do solo.
('c2d8f1a4-7b9e-4a6c-8f5d-3e1b9a4c2f7d', 58.0, 170.0, 190.0, 2, 2);


INSERT INTO limite (equipamento_id, tipo, valor_minimo, valor_maximo) VALUES
-- =======================================================================
-- GRUPO 1: Altíssima Potência (Pacote de arrefecimento extremo / Heavy Duty)
-- Suportam até 50°C de temperatura ambiente em carga.
-- Modelos: JD 8320R (1), Magnum 340 (2), NH T8.380 (3), Fendt 1050 (6), Steiger 580 (8)
-- =======================================================================
('c9d3f1a2-8b4e-4e7a-9c6d-5f2b8a1c9e4d', 'TEMPERATURA', -10, 50),
('c9d3f1a2-8b4e-4e7a-9c6d-5f2b8a1c9e4d', 'UMIDADE', 10, 95),

('f4a6b2c8-1e9d-4a3b-8f5c-7d2e9a4b1c6f', 'TEMPERATURA', -10, 50),
('f4a6b2c8-1e9d-4a3b-8f5c-7d2e9a4b1c6f', 'UMIDADE', 10, 95),

('e7c5d9a1-4b2f-4e8c-9a3d-6b1f8c2e7a5b', 'TEMPERATURA', -10, 50),
('e7c5d9a1-4b2f-4e8c-9a3d-6b1f8c2e7a5b', 'UMIDADE', 10, 95),

('d5b2e8a1-3c9f-4d6a-8e7b-2f1a4c9b6d5e', 'TEMPERATURA', -20, 50), -- Fendt possui pacote "Cold Start" severo
('d5b2e8a1-3c9f-4d6a-8e7b-2f1a4c9b6d5e', 'UMIDADE', 5, 95),

('e3a9b4c2-8f1d-4e7a-9b5c-6d2f8a1c3e4b', 'TEMPERATURA', -15, 50),
('e3a9b4c2-8f1d-4e7a-9b5c-6d2f8a1c3e4b', 'UMIDADE', 10, 95),

-- =======================================================================
-- GRUPO 2: Tratores Médios e Médios-Pesados
-- Pacote de arrefecimento padrão, limite térmico seguro em 45°C.
-- Modelos: MF 8S.265 (4), Valtra T250 (5), NH T7.260 (9)
-- =======================================================================
('b2f8a4c6-9d1e-4c7a-8b3f-5e9d2c1a4b6f', 'TEMPERATURA', -5, 45),
('b2f8a4c6-9d1e-4c7a-8b3f-5e9d2c1a4b6f', 'UMIDADE', 10, 95),

('a1d9c4b2-7e5f-4a8b-9c2d-3f6e1a8b5c4d', 'TEMPERATURA', -5, 45),
('a1d9c4b2-7e5f-4a8b-9c2d-3f6e1a8b5c4d', 'UMIDADE', 10, 95),

('c7d2f5a8-1b9e-4a6c-8f3d-4e1b9a2c5f8d', 'TEMPERATURA', -5, 45),
('c7d2f5a8-1b9e-4a6c-8f3d-4e1b9a2c5f8d', 'UMIDADE', 10, 95),

-- =======================================================================
-- GRUPO 3: Tratores Utilitários Leves (Cabine simples ou Plataformados)
-- Menor tolerância a calor extremo em carga máxima contínua (Max 40°C).
-- Eletrônica mais robusta contra umidade externa, mas menos sofisticada.
-- Modelos: JD 5090E (7), MF 4707 (10)
-- =======================================================================
('f8c1a9d4-6b2e-4f3a-9d8c-5b7e2a1f4c9d', 'TEMPERATURA', 0, 40),
('f8c1a9d4-6b2e-4f3a-9d8c-5b7e2a1f4c9d', 'UMIDADE', 0, 100), -- Suporta 100% por ter menos módulos expostos

('b6e1a4c9-2d8f-4b7e-9a5c-3f7d1b8e4a2c', 'TEMPERATURA', 0, 40),
('b6e1a4c9-2d8f-4b7e-9a5c-3f7d1b8e4a2c', 'UMIDADE', 0, 100);