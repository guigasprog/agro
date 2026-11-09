package analiseClimatica.app.use_case.solo;

import analiseClimatica.app.repository.SoloGateway;
import analiseClimatica.domain.model.Solo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BuscarTodosSolos {
    private final SoloGateway gateway;
    public List<Solo> execute(){
        return gateway.buscarTodos().stream().sorted(Comparator.comparing(Solo::getNome)).toList();
    }

}
