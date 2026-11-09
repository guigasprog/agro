package analiseClimatica.login.service;

import analiseClimatica.login.persistence.Usuario;
import analiseClimatica.login.persistence.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.UUID;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository repository;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public Usuario criar(Usuario usuario) {
        // Criptografa a senha antes de salvar no banco
        String senhaCriptografada = passwordEncoder.encode(usuario.getSenha());
        usuario.setSenha(senhaCriptografada);
        return repository.save(usuario);
    }

    public Usuario alterar(UUID id, Usuario dadosAtualizados) {
        Usuario usuarioExistente = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        usuarioExistente.setNome(dadosAtualizados.getNome());
        usuarioExistente.setEmail(dadosAtualizados.getEmail());

        // Se o usuário enviou uma nova senha, criptografamos ela
        if (dadosAtualizados.getSenha() != null && !dadosAtualizados.getSenha().isEmpty()) {
            usuarioExistente.setSenha(passwordEncoder.encode(dadosAtualizados.getSenha()));
        }

        return repository.save(usuarioExistente);
    }

    public void deletar(UUID id) {
        repository.deleteById(id);
    }

    public void alterarSenha(Usuario usuarioLogado, String novaSenha) {
        usuarioLogado.setSenha(passwordEncoder.encode(novaSenha));
        repository.save(usuarioLogado);
    }
}
