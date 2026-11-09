package analiseClimatica.infra.web.controller;

import analiseClimatica.app.use_case.equipamento.*;
import analiseClimatica.infra.web.response.equipamento.EquipamentoDTO;
import analiseClimatica.infra.web.response.equipamento.EquipamentoReduzidoDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;


@RestController
@RequestMapping("/equipamento")
@RequiredArgsConstructor
public class EquipamentoController {
    private final SalvarEquipamento salvarEquipamento;
    private final DeletarEquipamento deletarEquipamento;
    private final BuscarEquipamentoPorTipo buscarEquipamentoPorTipo;
    private final BuscarEquipamentoPorId buscarEquipamentoPorId;
    private final BuscarTodos buscarTodos;

    @GetMapping
    public ResponseEntity<List<EquipamentoReduzidoDTO>> buscarTodos(){
        List<EquipamentoReduzidoDTO> equipamentoDTO = buscarTodos.execute();
        return ResponseEntity.ok(equipamentoDTO);
    }
    //GET /equipamentos/por-tipos?tipos=TRATOR,DRONE
    @GetMapping("/tipos")
    public ResponseEntity<List<EquipamentoReduzidoDTO>> buscarEquipamentoPorTipo(@RequestParam List<String> tipoList){
        List<EquipamentoReduzidoDTO> equipamentoDTO = buscarEquipamentoPorTipo.execute(tipoList);
        return ResponseEntity.ok(equipamentoDTO);
    }
    @GetMapping("/{id}")
    public ResponseEntity<EquipamentoDTO> buscarEquipamentoPorId(@PathVariable UUID id){
        EquipamentoDTO equipamentoDTO = buscarEquipamentoPorId.execute(id);
        return ResponseEntity.ok(equipamentoDTO);
    }
    @PostMapping
    public ResponseEntity<HttpStatus> criar(@RequestBody EquipamentoDTO dto)   {
        salvarEquipamento.execute(dto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
    @PutMapping
    public ResponseEntity<HttpStatus> alterar(@RequestBody EquipamentoDTO dto)   {
        salvarEquipamento.execute(dto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deletar(@PathVariable UUID id){
        deletarEquipamento.execute(id);
        return ResponseEntity.status(HttpStatus.OK).build();
    }
}