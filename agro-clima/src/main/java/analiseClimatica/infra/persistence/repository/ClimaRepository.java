package analiseClimatica.infra.persistence.repository;

import analiseClimatica.infra.persistence.entity.ClimaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;
import java.util.List;
@Repository
public interface ClimaRepository extends JpaRepository<ClimaEntity, UUID> {
    void deleteByAreaAgricolaId(UUID areaAgricolaId);
    List<ClimaEntity> findAllByAreaAgricolaId(UUID areaAgricolaId);
}