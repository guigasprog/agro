package analiseClimatica.app.use_case.areaAgricola;

import analiseClimatica.app.repository.AreaAgricolaGateway;
import analiseClimatica.domain.model.AreaAgricola;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Service
@RequiredArgsConstructor
public class AtualizarAreaAgricola {
    private final AreaAgricolaGateway gateway;

    public void execute(AreaAgricola areaAgricola) {
        if (Objects.isNull(areaAgricola.getId())) {
            throw new RuntimeException("ID da Área Agrícola é obrigatório para atualização");
        }
        if (!gateway.verificarExistenciaPorId(areaAgricola.getId())) {
            throw new RuntimeException("Área Agrícola não encontrada");
        }
        gateway.salvar(areaAgricola);
    }
}
