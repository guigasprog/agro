package analiseClimatica.infra.web.response;

import analiseClimatica.domain.enums.TipoOperacao;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EstimativaDTO {
    private TipoOperacao tipoOperacao;
    private UUID idAreaAgricola;
    private UUID idEquipamento;
    private List<UUID> idImplementoList;
}
