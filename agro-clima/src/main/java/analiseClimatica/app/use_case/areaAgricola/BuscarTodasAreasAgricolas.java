package analiseClimatica.app.use_case.areaAgricola;

import analiseClimatica.app.repository.AreaAgricolaGateway;
import analiseClimatica.domain.model.AreaAgricola;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BuscarTodasAreasAgricolas {
    private final AreaAgricolaGateway gateway;

    public List<AreaAgricola> execute() {
        return gateway.buscarTodos().stream()
                .sorted(Comparator.comparing(AreaAgricola::getNome))
                .toList();
    }
}
