package analiseClimatica.infra.persistence.repository;


import analiseClimatica.infra.persistence.entity.equipamento.EquipamentoEntity;
import analiseClimatica.infra.web.response.equipamento.EquipamentoDTO;
import analiseClimatica.infra.web.response.equipamento.EquipamentoReduzidoDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface EquipamentoRepository extends JpaRepository<EquipamentoEntity, UUID> {
    // A palavra 'new' no JPQL diz ao Hibernate para instanciar o DTO
    // diretamente com os campos selecionados da tabela pai (e).
    // NOTA: Deves colocar o caminho completo do pacote onde está o teu DTO!
    List<EquipamentoReduzidoDTO> findAllProjectedBy();
    List<EquipamentoReduzidoDTO> findAllByTipoEquipamentoIn(List<String> tipoList);
    List<EquipamentoEntity> findAllByIdIn(List<UUID> idList);
}
