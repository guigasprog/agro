package analiseClimatica.login.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, UUID> {

    // O Spring Data JPA entende o nome deste método e cria a consulta SQL automaticamente:
    // SELECT * FROM usuario WHERE email = ?
    UserDetails findByEmail(String email);
}
