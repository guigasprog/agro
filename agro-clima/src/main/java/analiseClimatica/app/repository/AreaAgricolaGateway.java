package analiseClimatica.app.repository;

import analiseClimatica.domain.model.AreaAgricola;
import analiseClimatica.infra.persistence.entity.AreaAgricolaEntity;
import analiseClimatica.infra.persistence.repository.AreaAgricolaRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@RequiredArgsConstructor
public class AreaAgricolaGateway {
    private final AreaAgricolaRepository repository;
    @Transactional
    public void salvar(AreaAgricola areaAgricola) {
        repository.save(new AreaAgricolaEntity(areaAgricola));
    }
    public AreaAgricola buscarPorId(UUID id) {
        return new AreaAgricola(repository.findById(id).orElseThrow());
    }
    public java.util.List<AreaAgricola> buscarTodos() {
        return repository.findAll().stream().map(AreaAgricola::new).toList();
    }
    public void deletarPorId(UUID id) {
        repository.deleteById(id);
    }
    public boolean verificarExistenciaPorId(UUID id) {
        return repository.existsById(id);
    }
    public boolean verificarExistenciaIdSolo(UUID id) {
        return repository.existsBySoloId(id);
    }
}
