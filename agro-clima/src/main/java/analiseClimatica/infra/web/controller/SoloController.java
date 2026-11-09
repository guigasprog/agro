package analiseClimatica.infra.web.controller;

import analiseClimatica.app.use_case.solo.BuscarSoloPorId;
import analiseClimatica.app.use_case.solo.BuscarTodosSolos;
import analiseClimatica.app.use_case.solo.SalvarSolo;
import analiseClimatica.app.use_case.solo.DeletarSolo;
import analiseClimatica.domain.model.Solo;
import analiseClimatica.infra.mapper.SoloMapper;
import analiseClimatica.infra.web.response.SoloDTO;
import analiseClimatica.infra.web.response.SoloReduzidoDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/solo")
@RequiredArgsConstructor
public class SoloController {
    private final BuscarTodosSolos buscarTodosSolos;
    private final BuscarSoloPorId buscarSoloPorId;
    private final SalvarSolo salvarSolo;
    private final DeletarSolo deletarSolo;
    @GetMapping()
    public ResponseEntity<List<SoloReduzidoDTO>> buscarTodos(){
        List<SoloReduzidoDTO> limiteList = buscarTodosSolos.execute().stream().map(SoloMapper::toDTOReduzido).toList();
        return ResponseEntity.ok(limiteList);
    }
    @GetMapping("/{id}")
    public ResponseEntity<SoloDTO> buscarPorId(@PathVariable UUID id) throws Exception {
        SoloDTO soloDTO = SoloMapper.toDTO(buscarSoloPorId.execute(id));
        return ResponseEntity.ok(soloDTO);
    }
    @PostMapping
    public ResponseEntity<HttpStatus> criar(@RequestBody SoloDTO dto) {
        salvarSolo.execute(new Solo(dto));
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
    @PutMapping
    public ResponseEntity<HttpStatus> alterar(@RequestBody SoloDTO dto) {
        salvarSolo.execute(new Solo(dto));
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deletar(@PathVariable UUID id) {
        deletarSolo.execute(id);
        return ResponseEntity.status(HttpStatus.OK).build();
    }
}
