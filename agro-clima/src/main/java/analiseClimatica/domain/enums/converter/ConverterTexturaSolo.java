package analiseClimatica.domain.enums.converter;

import analiseClimatica.domain.enums.TexturaSolo;
import analiseClimatica.domain.enums.TipoInsumo;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.util.Objects;

@Converter(autoApply = true)
public class ConverterTexturaSolo implements AttributeConverter<TexturaSolo, String> {
    @Override
    public String convertToDatabaseColumn(TexturaSolo texturaSolo) {
        return Objects.nonNull(texturaSolo)? texturaSolo.name(): null;
    }
    @Override
    public TexturaSolo convertToEntityAttribute(String texturaSolo ) {
        return Objects.nonNull(texturaSolo)? TexturaSolo.valueOf(texturaSolo): null;
    }
}
