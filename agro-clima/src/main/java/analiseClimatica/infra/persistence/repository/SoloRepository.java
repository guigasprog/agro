package analiseClimatica.infra.persistence.repository;

import analiseClimatica.infra.persistence.entity.SoloEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface SoloRepository extends JpaRepository<SoloEntity, UUID> {
}
