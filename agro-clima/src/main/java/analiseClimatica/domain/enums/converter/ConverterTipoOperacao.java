package analiseClimatica.domain.enums.converter;

import analiseClimatica.domain.enums.TipoOperacao;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.util.Objects;

@Converter(autoApply = true)
public class ConverterTipoOperacao implements AttributeConverter<TipoOperacao, String> {
    @Override
    public String convertToDatabaseColumn(TipoOperacao tipoOperacao) {
        return Objects.nonNull(tipoOperacao)? tipoOperacao.getTipoOperacao(): null;
    }
    @Override
    public TipoOperacao convertToEntityAttribute(String tipoOperacao) {
        return Objects.nonNull(tipoOperacao)? TipoOperacao.valueOf(tipoOperacao): null;
    }
}
