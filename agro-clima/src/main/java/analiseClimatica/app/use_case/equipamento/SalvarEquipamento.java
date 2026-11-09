package analiseClimatica.app.use_case.equipamento;

import analiseClimatica.app.repository.EquipamentoGateway;
import analiseClimatica.domain.enums.TipoLimite;
import analiseClimatica.infra.web.response.LimiteDTO;
import analiseClimatica.infra.web.response.equipamento.EquipamentoDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class SalvarEquipamento {
    private final EquipamentoGateway gateway;
    public void execute(EquipamentoDTO equipamento)   {
        if (Objects.nonNull(equipamento.getId())){
            if (!gateway.verificarExistenciaPorId(equipamento.getId()))throw new RuntimeException("Equipamento não existe");
        }
        verificaRepetido(equipamento.getLimiteList());
        gateway.salvar(equipamento);
    }
    private static void verificaRepetido(List<LimiteDTO> lista)   {
        Set<TipoLimite> unicos = new HashSet<>();
        for (LimiteDTO elemento : lista) {
            if (!unicos.add(elemento.getTipo())) {
                throw new RuntimeException("Existe limite com o tipo repetido");
            }
        }
    }

}
