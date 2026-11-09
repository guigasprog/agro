package analiseClimatica.infra.persistence.repository;

import analiseClimatica.infra.persistence.entity.AreaAgricolaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface AreaAgricolaRepository extends JpaRepository<AreaAgricolaEntity, UUID> {
    boolean existsBySoloId(UUID idSolo);
}
