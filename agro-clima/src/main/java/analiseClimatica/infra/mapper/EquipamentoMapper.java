package analiseClimatica.infra.mapper;

import analiseClimatica.domain.enums.TipoEquipamento;
import analiseClimatica.infra.persistence.entity.equipamento.DroneEntity;
import analiseClimatica.infra.persistence.entity.equipamento.EquipamentoEntity;
import analiseClimatica.infra.persistence.entity.equipamento.ImplementoEntity;
import analiseClimatica.infra.persistence.entity.equipamento.TratorEntity;
import analiseClimatica.infra.web.response.equipamento.EquipamentoDTO;
import analiseClimatica.infra.web.response.equipamento.ImplementoDTO;
import analiseClimatica.infra.web.response.equipamento.TratorDTO;
import org.springframework.stereotype.Component;

@Component
public class EquipamentoMapper {

    public static EquipamentoDTO toDTO(EquipamentoEntity entity) {
        if (entity == null) return null;
        if (entity instanceof TratorEntity trator) {
            return new TratorDTO(trator);
        } else if (entity instanceof ImplementoEntity implemento) {
            return new ImplementoDTO(implemento);
        } else {
            return new EquipamentoDTO(entity);
        }
    }

    public static EquipamentoEntity toEntity(EquipamentoDTO dto) {
        if (dto == null) return null;
        if (dto instanceof TratorDTO tratorDTO) {
            return new TratorEntity(tratorDTO);
        } else if (dto instanceof ImplementoDTO implementoDTO) {
            return new ImplementoEntity(implementoDTO);
        } else if(TipoEquipamento.DRONE.equals(dto.getTipoEquipamento())){
            return new DroneEntity(dto);
        }else {
            return new DroneEntity(dto);
        }
    }

    public static analiseClimatica.domain.model.gestao_recurso.Equipamento toModel(EquipamentoEntity entity) {
        if (entity == null) return null;
        
        analiseClimatica.domain.model.gestao_recurso.Equipamento equipamento = 
            new analiseClimatica.domain.model.gestao_recurso.Equipamento(
                entity.getId(),
                entity.getTipoEquipamento(),
                entity.getNome(),
                entity.getNomeFabricante()
        );
        
        equipamento.setPesoTotal(entity.getPesoTotal() != null ? entity.getPesoTotal() : 0.0);
        
        if (entity instanceof TratorEntity trator) {
            equipamento.setDistribuicaoEstaticaTraseira(trator.getDistribuicaoEstaticaTraseira() != null ? trator.getDistribuicaoEstaticaTraseira() : 0.0);
            equipamento.setPressaoPneuDianteiro(trator.getPressaoPneuDianteiro() != null ? trator.getPressaoPneuDianteiro() : 0.0);
            equipamento.setPressaoPneuTraseiro(trator.getPressaoPneuTraseiro() != null ? trator.getPressaoPneuTraseiro() : 0.0);
            equipamento.setQtRodasDianteiras(trator.getQtRodasDianteiras() != null ? trator.getQtRodasDianteiras() : 0);
            equipamento.setQtRodasTraseiras(trator.getQtRodasTraseiras() != null ? trator.getQtRodasTraseiras() : 0);
        } else if (entity instanceof ImplementoEntity implemento) {
            equipamento.setTipoImplemento(implemento.getTipoImplemento());
        }
        
        if (entity.getLimites() != null && !entity.getLimites().isEmpty()) {
            equipamento.setLimiteList(entity.getLimites().stream()
                .map(limite -> new analiseClimatica.domain.model.gestao_recurso.Limite(
                        limite.getId(),
                        limite.getTipo(),
                        limite.getValorMinimo() != null ? limite.getValorMinimo().doubleValue() : null,
                        limite.getValorMaximo() != null ? limite.getValorMaximo().doubleValue() : null
                ))
                .collect(java.util.stream.Collectors.toList()));
        }
        
        return equipamento;
    }
}