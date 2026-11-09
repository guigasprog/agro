package analiseClimatica.login.controller;

import analiseClimatica.login.persistence.Usuario;
import analiseClimatica.login.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService service;

    // Rota para obter o usuário logado
    @GetMapping("/me")
    public ResponseEntity<Usuario> getLogado() {
        var authentication = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof Usuario) {
            return ResponseEntity.ok((Usuario) authentication.getPrincipal());
        }
        return ResponseEntity.status(org.springframework.http.HttpStatus.UNAUTHORIZED).build();
    }

    @PutMapping("/me")
    public ResponseEntity<Usuario> atualizarLogado(@RequestBody Usuario dadosAtualizados) {
        var authentication = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof Usuario) {
            Usuario usuario = (Usuario) authentication.getPrincipal();
            return ResponseEntity.ok(service.alterar(usuario.getId(), dadosAtualizados));
        }
        return ResponseEntity.status(org.springframework.http.HttpStatus.UNAUTHORIZED).build();
    }

    @PutMapping("/me/senha")
    public ResponseEntity<Void> alterarSenha(@RequestBody analiseClimatica.login.dto.AlterarSenhaDTO dto) {
        var authentication = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof Usuario) {
            Usuario usuario = (Usuario) authentication.getPrincipal();
            try {
                service.alterarSenha(usuario, dto.getNovaSenha());
                return ResponseEntity.ok().build();
            } catch (Exception e) {
                return ResponseEntity.badRequest().build();
            }
        }
        return ResponseEntity.status(org.springframework.http.HttpStatus.UNAUTHORIZED).build();
    }

    // Rota de Cadastro (será pública)
    @PostMapping
    public ResponseEntity<Usuario> cadastrar(@RequestBody Usuario usuario) {
        return ResponseEntity.ok(service.criar(usuario));
    }

    // Rota de Alteração (será protegida)
    @PutMapping("/{id}")
    public ResponseEntity<Usuario> atualizar(@PathVariable UUID id, @RequestBody Usuario usuario) {
        return ResponseEntity.ok(service.alterar(id, usuario));
    }

    // Rota de Deleção (será protegida)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable UUID id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }
}