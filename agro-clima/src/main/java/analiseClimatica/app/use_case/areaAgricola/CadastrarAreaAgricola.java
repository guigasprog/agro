package analiseClimatica.app.use_case.areaAgricola;

import analiseClimatica.app.repository.AreaAgricolaGateway;
import analiseClimatica.domain.model.AreaAgricola;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Service
@RequiredArgsConstructor
public class CadastrarAreaAgricola {
    private final AreaAgricolaGateway gateway;

    public void execute(AreaAgricola areaAgricola) {
        if (Objects.nonNull(areaAgricola.getId())) {
            if (gateway.verificarExistenciaPorId(areaAgricola.getId())) {
                throw new RuntimeException("Área Agrícola já existe");
            }
        }
        gateway.salvar(areaAgricola);
    }
}
