package analiseClimatica.app.repository;

import analiseClimatica.domain.model.gestao_recurso.Equipamento;
import analiseClimatica.infra.mapper.EquipamentoMapper;
import analiseClimatica.infra.persistence.entity.equipamento.EquipamentoEntity;
import analiseClimatica.infra.persistence.repository.EquipamentoRepository;
import analiseClimatica.infra.web.response.equipamento.EquipamentoDTO;
import analiseClimatica.infra.web.response.equipamento.EquipamentoReduzidoDTO;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class EquipamentoGateway {
    private final EquipamentoRepository repository;
    public List<EquipamentoReduzidoDTO> buscarTodos(){return repository.findAllProjectedBy();}
    public EquipamentoEntity buscarPorId(UUID id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Equipamento não encontrado!"));
    }

    public List<EquipamentoReduzidoDTO> buscarTodosPorTipoEquipamento(List<String> tipoList){
        return repository.findAllByTipoEquipamentoIn(tipoList);
    }
    public List<Equipamento> buscarTodosPorId(List<UUID> idList){
        return repository.findAllByIdIn(idList).stream().map(EquipamentoMapper::toModel).toList();
    }

    @Transactional
    public void salvar(EquipamentoDTO equipamento){
        repository.save(EquipamentoMapper.toEntity(equipamento));
    }
    public void deletarPorId(UUID id){
        repository.deleteById(id);
    }
    public boolean verificarExistenciaPorId(UUID id){
        return repository.existsById(id);
    }
}
