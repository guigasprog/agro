package analiseClimatica.app.use_case.equipamento;

import analiseClimatica.app.repository.EquipamentoGateway;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DeletarEquipamento {
    private final EquipamentoGateway gateway;
    public void execute(UUID id){
        if (!gateway.verificarExistenciaPorId(id)) throw new RuntimeException("id não existe");
        gateway.deletarPorId(id);
    }

}
