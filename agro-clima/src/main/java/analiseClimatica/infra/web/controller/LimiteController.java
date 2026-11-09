package analiseClimatica.infra.web.controller;

import analiseClimatica.app.use_case.limite.BuscarLimitePorRecurso;
import analiseClimatica.infra.web.response.LimiteDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/limite")
@RequiredArgsConstructor
public class LimiteController {
    private final BuscarLimitePorRecurso buscarLimitePorRecurso;
   /* @GetMapping("/{idRecurso}")
    public ResponseEntity<List<LimiteDTO>> buscarLimitePorRecurso(@PathVariable UUID idRecurso){
        List<LimiteDTO> limiteList = buscarLimitePorRecurso.execute(idRecurso).stream().map(LimiteDTO::new).toList();
        return ResponseEntity.ok(limiteList);
    }*/

}
