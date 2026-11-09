package analiseClimatica.app.use_case.equipamento;

import analiseClimatica.app.repository.EquipamentoGateway;
import analiseClimatica.domain.model.gestao_recurso.Equipamento;
import analiseClimatica.infra.mapper.EquipamentoMapper;
import analiseClimatica.infra.persistence.repository.EquipamentoRepository;
import analiseClimatica.infra.web.response.equipamento.EquipamentoReduzidoDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BuscarEquipamentoPorTipo {
    private final EquipamentoGateway gateway;
    public List<EquipamentoReduzidoDTO> execute(List<String> tipoList){
        return gateway.buscarTodosPorTipoEquipamento(tipoList) ;
    }
}
