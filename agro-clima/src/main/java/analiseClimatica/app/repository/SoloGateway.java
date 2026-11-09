package analiseClimatica.app.repository;

import analiseClimatica.domain.model.Solo;

import analiseClimatica.infra.mapper.SoloMapper;
import analiseClimatica.infra.persistence.entity.SoloEntity;
import analiseClimatica.infra.persistence.repository.SoloRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class SoloGateway {
    private final SoloRepository repository;
    public List<Solo> buscarTodos(){
        return repository.findAll().stream().map(Solo::new).toList();
    }
    public Solo buscarSoloPorId(UUID id){
        return new Solo(repository.findById(id).orElseThrow());
    }
    @Transactional
    public void salvar(Solo solo){
        repository.save(new SoloEntity(solo));
    }
    public void deletarPorId(UUID id){
        repository.deleteById(id);
    }
    public boolean verificarExistenciaPorId(UUID id){
        return repository.existsById(id);
    }
}
