package analiseClimatica.login.service;

import analiseClimatica.login.persistence.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class LoginService implements UserDetailsService {

    @Autowired
    private UsuarioRepository repository;

    // Este método é chamado automaticamente pelo Spring Security quando o usuário clica em "Login" no Angular
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // "username" aqui será o e-mail que o usuário digitou
        return repository.findByEmail(username);
    }
}
