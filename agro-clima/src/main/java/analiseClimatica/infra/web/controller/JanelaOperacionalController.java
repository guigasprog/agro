package analiseClimatica.infra.web.controller;

import analiseClimatica.app.use_case.EstimarJanelaOperacional;
import analiseClimatica.infra.web.response.AnaliseJanelaOperacionalDTO;
import analiseClimatica.infra.web.response.EstimativaDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/janela-operacional")
@RequiredArgsConstructor
public class JanelaOperacionalController {

    private final EstimarJanelaOperacional service;

    @PostMapping
    public ResponseEntity<List<AnaliseJanelaOperacionalDTO>> estimarJanela(
            @RequestBody EstimativaDTO estimativaDTO) {
        List<AnaliseJanelaOperacionalDTO> resultado = service.executar(estimativaDTO);
        return ResponseEntity.ok(resultado);
    }

}
