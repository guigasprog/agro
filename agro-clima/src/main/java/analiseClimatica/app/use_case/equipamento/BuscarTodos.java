package analiseClimatica.app.use_case.equipamento;

import analiseClimatica.app.repository.EquipamentoGateway;
import analiseClimatica.infra.web.response.equipamento.EquipamentoReduzidoDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BuscarTodos {
    private final EquipamentoGateway gateway;
    public List<EquipamentoReduzidoDTO> execute(){
        return gateway.buscarTodos();
    }
}
