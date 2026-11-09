package analiseClimatica.app.use_case.areaAgricola;

import analiseClimatica.app.repository.AreaAgricolaGateway;
import analiseClimatica.domain.model.AreaAgricola;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BuscarAreaAgricolaPorId {
    private final AreaAgricolaGateway gateway;

    public AreaAgricola execute(UUID id) {
        return gateway.buscarPorId(id);
    }
}
