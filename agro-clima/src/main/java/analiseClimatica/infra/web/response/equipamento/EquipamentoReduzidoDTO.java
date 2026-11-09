package analiseClimatica.infra.web.response.equipamento;

import analiseClimatica.domain.enums.TipoEquipamento;

import java.util.UUID;
/**
 * Esta é uma Projeção Fechada (Closed Projection).
 * O Spring vai olhar para os nomes dos métodos (getId, getNome...)
 * e buscar automaticamente as colunas correspondentes (id, nome...)
 */
public interface EquipamentoReduzidoDTO {

    UUID getId();

    String getNome();

    String getNomeFabricante();

    // O Spring mapeia automaticamente "tipoEquipamento" para a coluna "tipo_equipamento"
    TipoEquipamento getTipoEquipamento();
}