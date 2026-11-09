package analiseClimatica.infra.mapper;

import analiseClimatica.domain.model.AreaAgricola;
import analiseClimatica.infra.web.response.AreaAgricolaDTO;
import analiseClimatica.infra.web.response.AreaAgricolaReduzidoDTO;

public class AreaAgricolaMapper {

    public static AreaAgricolaReduzidoDTO toDTOReduzido(AreaAgricola model) {
        return new AreaAgricolaReduzidoDTO(model.getId(), model.getNome(), model.getCidade(), model.getEstado(), model.getGeometria(), model.getHectares());
    }

    public static AreaAgricolaDTO toDTO(AreaAgricola model) {
        return new AreaAgricolaDTO(
                model.getId(),
                model.getNome(),
                model.getCidade(),
                model.getEstado(),
                model.getGeometria(),
                model.getHectares(),
                model.getUltimaAtualizacaoClima(),
                model.getUltimaAtualizacaoPulverizacao(),
                model.getUltimaAtualizacaoCompactacao(),
                model.getSolo() != null ? model.getSolo().getId() : null,
                model.getSolo() != null ? model.getSolo().getNome() : null
        );
    }
}
