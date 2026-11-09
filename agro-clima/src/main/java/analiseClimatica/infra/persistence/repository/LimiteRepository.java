package analiseClimatica.infra.persistence.repository;

import analiseClimatica.infra.persistence.entity.LimiteEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface LimiteRepository extends JpaRepository<LimiteEntity, UUID> {
   // List<LimiteEntity> findAllByRecursoId(UUID id);
}
