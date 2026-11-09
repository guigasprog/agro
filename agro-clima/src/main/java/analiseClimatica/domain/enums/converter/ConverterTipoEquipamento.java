package analiseClimatica.domain.enums.converter;

import analiseClimatica.domain.enums.TipoEquipamento;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.util.Objects;

@Converter(autoApply = true)
public class ConverterTipoEquipamento implements AttributeConverter<TipoEquipamento, String> {
    @Override
    public String convertToDatabaseColumn(TipoEquipamento tipoEquipamento) {
        return Objects.nonNull(tipoEquipamento)? tipoEquipamento.getTipoEquipamento(): null;
    }
    @Override
    public TipoEquipamento convertToEntityAttribute(String tipoEquipamento) {
        return Objects.nonNull(tipoEquipamento)? TipoEquipamento.valueOf(tipoEquipamento): null;
    }
}
