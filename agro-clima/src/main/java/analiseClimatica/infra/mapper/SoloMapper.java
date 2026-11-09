package analiseClimatica.infra.mapper;

import analiseClimatica.domain.enums.TexturaSolo;
import analiseClimatica.domain.model.Solo;
import analiseClimatica.infra.persistence.entity.SoloEntity;
import analiseClimatica.infra.web.response.SoloDTO;
import analiseClimatica.infra.web.response.SoloReduzidoDTO;

public class SoloMapper {


    public static SoloReduzidoDTO toDTOReduzido(Solo model){
        return new SoloReduzidoDTO(model.getId(), model.getNome(), model.getTextutaSolo().name());
    }
    public static SoloDTO toDTO(Solo model){
        return new SoloDTO(model.getId(),
                model.getNome(),
                model.getTextutaSolo().name(),
                model.getResistenciaMaximaEstruturalSolo(),
                model.getTaxaDecaimentoSolo(),
                model.getLimiarDureza(),
                model.getLimiarPlasticidade(),
                model.getDensidade());
    }
}
