package analiseClimatica.app.repository;

import analiseClimatica.infra.persistence.repository.LimiteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@RequiredArgsConstructor
public class LimiteGateway {
    private final LimiteRepository repository;
 /*   @Transactional
    public void salvar(Limite limite,){
        repository.save(LimiteMapper.toEntity(limite));
    }*/
    public void deletarPorId(UUID id){
        repository.deleteById(id);
    }
    public boolean verificarExistenciaPorId(UUID id){
        return repository.existsById(id);
    }
}
