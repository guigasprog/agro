package analiseClimatica.domain.enums.converter;

import analiseClimatica.domain.enums.TipoLimite;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.util.Objects;

@Converter(autoApply = true)
public class ConverterTipoLimite implements AttributeConverter<TipoLimite, String> {
    @Override
    public String convertToDatabaseColumn(TipoLimite tipoLimite) {
        return Objects.nonNull(tipoLimite)? tipoLimite.getTipoLimite(): null;
    }
    @Override
    public TipoLimite convertToEntityAttribute(String tipoLimite) {
        return Objects.nonNull(tipoLimite)?TipoLimite.valueOf(tipoLimite): null;
    }
}
