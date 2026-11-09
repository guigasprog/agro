package analiseClimatica.app.use_case.equipamento;

import analiseClimatica.app.repository.EquipamentoGateway;
import analiseClimatica.infra.mapper.EquipamentoMapper;
import analiseClimatica.infra.web.response.equipamento.EquipamentoDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BuscarEquipamentoPorId {
    private final EquipamentoGateway gateway;
    public EquipamentoDTO execute(UUID id) {
        return EquipamentoMapper.toDTO(gateway.buscarPorId(id));
    }
}
