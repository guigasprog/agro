package analiseClimatica.app.use_case.solo;

import analiseClimatica.app.repository.SoloGateway;
import analiseClimatica.domain.model.Solo;
import analiseClimatica.infra.mapper.SoloMapper;
import analiseClimatica.infra.persistence.repository.SoloRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BuscarSoloPorId {
    private final SoloGateway gateway;
    public Solo execute(UUID id) throws Exception {
        return gateway.buscarSoloPorId(id);
    }
}
