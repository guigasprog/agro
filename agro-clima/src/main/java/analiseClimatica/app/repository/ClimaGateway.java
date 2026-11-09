package analiseClimatica.app.repository;

import analiseClimatica.domain.model.AreaAgricola;
import analiseClimatica.domain.model.Clima;
import analiseClimatica.infra.persistence.entity.AreaAgricolaEntity;
import analiseClimatica.infra.persistence.entity.ClimaEntity;
import analiseClimatica.infra.persistence.repository.ClimaRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class ClimaGateway {

    private final ClimaRepository repository;

    @Transactional
    public void deletarPorAreaAgricola(AreaAgricola areaAgricola) {
        repository.deleteByAreaAgricolaId(areaAgricola.getId());
    }

    @Transactional
    public void salvarTodos(List<Clima> climas, AreaAgricola areaAgricola) {
        AreaAgricolaEntity areaAgricolaEntity = new AreaAgricolaEntity(areaAgricola);
        List<ClimaEntity> climaEntities = climas.stream()
                .map(clima -> new ClimaEntity(clima, areaAgricolaEntity))
                .toList();
        repository.saveAll(climaEntities);
    }

    public List<Clima> buscarTodosPorLocal(UUID idAreaAgricola) {
        return repository.findAllByAreaAgricolaId(idAreaAgricola).stream()
                .map(ClimaEntity::toModel)
                .toList();
    }
}
