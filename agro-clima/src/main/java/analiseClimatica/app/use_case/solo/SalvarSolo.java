package analiseClimatica.app.use_case.solo;

import analiseClimatica.app.repository.SoloGateway;
import analiseClimatica.domain.model.Solo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Service
@RequiredArgsConstructor
public class SalvarSolo {
    private final SoloGateway gateway;
    public void execute(Solo solo){
        if (Objects.nonNull(solo.getId())){
            if (!gateway.verificarExistenciaPorId(solo.getId()))throw new RuntimeException("Solo não existe");
        }
        gateway.salvar(solo);
    }
}
