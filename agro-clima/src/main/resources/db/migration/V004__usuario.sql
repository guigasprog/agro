-- Criação da tabela Usuario
CREATE TABLE usuario (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,

    -- Regra de Negócio: Impede o registo de dois utilizadores com o mesmo e-mail
    CONSTRAINT uk_usuario_email UNIQUE (email)
);

INSERT INTO usuario (id, nome, email, senha_hash) VALUES ('54583e9d-6951-4a2b-b33d-bddc7933581d','Giovanna','gigi.vilela20@gmail.com','$2a$10$aL4VLTyUlqSKe3kNdMkin.tuLmEetVe2mAxlxTiyyiJcz4CYNDXYa');