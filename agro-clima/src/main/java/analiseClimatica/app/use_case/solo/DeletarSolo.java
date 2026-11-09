package analiseClimatica.app.use_case.solo;

import analiseClimatica.app.repository.AreaAgricolaGateway;
import analiseClimatica.app.repository.EquipamentoGateway;
import analiseClimatica.app.repository.SoloGateway;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DeletarSolo {
    private final SoloGateway gateway;
    private final AreaAgricolaGateway areaAgricolaGateway;
    public void execute(UUID id){
        if (!gateway.verificarExistenciaPorId(id)) throw new RuntimeException("Solo não existe");
        if (areaAgricolaGateway.verificarExistenciaIdSolo(id)) throw new RuntimeException("Solo está associado a uma Area Agrícola");
        gateway.deletarPorId(id);
    }
}
