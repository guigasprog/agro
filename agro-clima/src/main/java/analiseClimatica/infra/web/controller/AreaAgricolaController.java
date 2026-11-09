package analiseClimatica.infra.web.controller;

import analiseClimatica.app.use_case.areaAgricola.*;
import analiseClimatica.domain.model.AreaAgricola;
import analiseClimatica.infra.mapper.AreaAgricolaMapper;
import analiseClimatica.infra.web.response.AreaAgricolaDTO;
import analiseClimatica.infra.web.response.AreaAgricolaReduzidoDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/area-agricola")
@RequiredArgsConstructor
public class AreaAgricolaController {

    private final BuscarTodasAreasAgricolas buscarTodasAreasAgricolas;
    private final BuscarAreaAgricolaPorId buscarAreaAgricolaPorId;
    private final CadastrarAreaAgricola cadastrarAreaAgricola;
    private final AtualizarAreaAgricola atualizarAreaAgricola;
    private final DeletarAreaAgricola deletarAreaAgricola;

    @GetMapping
    public ResponseEntity<List<AreaAgricolaReduzidoDTO>> buscarTodos() {
        List<AreaAgricolaReduzidoDTO> lista = buscarTodasAreasAgricolas.execute().stream()
                .map(AreaAgricolaMapper::toDTOReduzido)
                .toList();
        return ResponseEntity.ok(lista);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AreaAgricolaDTO> buscarPorId(@PathVariable UUID id) {
        AreaAgricolaDTO dto = AreaAgricolaMapper.toDTO(buscarAreaAgricolaPorId.execute(id));
        return ResponseEntity.ok(dto);
    }

    @PostMapping
    public ResponseEntity<HttpStatus> criar(@RequestBody AreaAgricolaDTO dto) {
        cadastrarAreaAgricola.execute(new AreaAgricola(dto));
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping
    public ResponseEntity<HttpStatus> alterar(@RequestBody AreaAgricolaDTO dto) {
        atualizarAreaAgricola.execute(new AreaAgricola(dto));
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deletar(@PathVariable UUID id) {
        deletarAreaAgricola.execute(id);
        return ResponseEntity.status(HttpStatus.OK).build();
    }
}
