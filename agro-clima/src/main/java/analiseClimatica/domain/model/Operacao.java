package analiseClimatica.domain.model;

import analiseClimatica.domain.enums.TipoOperacao;
import analiseClimatica.domain.model.gestao_recurso.Equipamento;
import analiseClimatica.domain.model.gestao_recurso.Insumo;
import lombok.Getter;

import java.util.List;

@Getter
public class Operacao {

    private AreaAgricola areaAgricola;
    private Equipamento equipamento;
    private TipoOperacao tipo;
    private List<Insumo> insumo;
    private List<Equipamento> implementoList;

    public Operacao(Equipamento equipamento, TipoOperacao tipo) {
        this.equipamento = equipamento;
        this.tipo = tipo;
    }
    public void adicionarInsumo(List<Insumo> insumos){
        this.insumo = insumos;
    }
    public void adicionarInsumo(Insumo insumo){
        this.insumo.add(insumo);
    }

    public void adicionarInplemento(List<Equipamento> implementoList){
        this.implementoList = implementoList;
    }
    public void adicionarInplemento(Equipamento implemento){
        this.implementoList.add(implemento);
    }
}
