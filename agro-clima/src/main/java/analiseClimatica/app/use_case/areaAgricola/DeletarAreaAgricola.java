package analiseClimatica.app.use_case.areaAgricola;

import analiseClimatica.app.repository.AreaAgricolaGateway;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DeletarAreaAgricola {
    private final AreaAgricolaGateway gateway;

    public void execute(UUID id) {
        if (!gateway.verificarExistenciaPorId(id)) {
            throw new RuntimeException("Área Agrícola não existe");
        }
        gateway.deletarPorId(id);
    }
}
