package analiseClimatica.domain.enums.converter;

import analiseClimatica.domain.enums.TipoInsumo;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.util.Objects;

@Converter(autoApply = true)
public class ConverterTipoInsumo implements AttributeConverter<TipoInsumo, String> {
    @Override
    public String convertToDatabaseColumn(TipoInsumo tipoInsumo) {
        return Objects.nonNull(tipoInsumo)? tipoInsumo.getTipoInsumo(): null;
    }
    @Override
    public TipoInsumo convertToEntityAttribute(String tipoInsumo ) {
        return Objects.nonNull(tipoInsumo)? TipoInsumo.valueOf(tipoInsumo): null;
    }
}
