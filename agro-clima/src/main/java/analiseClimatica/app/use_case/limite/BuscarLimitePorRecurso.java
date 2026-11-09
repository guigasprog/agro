package analiseClimatica.app.use_case.limite;

import analiseClimatica.domain.model.gestao_recurso.Limite;
import analiseClimatica.infra.persistence.repository.LimiteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BuscarLimitePorRecurso {
    private final LimiteRepository repository;
    public List<Limite> execute(UUID id){
        return new ArrayList<>();// repository.findAll().stream().map(LimiteMapper::toModel).toList();
    }

}
