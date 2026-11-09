package analiseClimatica.domain.model.gestao_recurso;

import analiseClimatica.domain.enums.TipoInsumo;
import lombok.Getter;

import java.util.List;
import java.util.UUID;

@Getter
public class Insumo {
    private UUID id;
    private TipoInsumo tipo;
    private String nome;
    private List<Limite> limiteList;

    public Insumo(UUID id, TipoInsumo tipo, String nome) {
        this.id = id;
        this.tipo = tipo;
        this.nome = nome;
    }
    public void adicionarLimite(List<Limite> limiteList){
        this.limiteList = limiteList;
    }
    public void adicionarLimite(Limite limite){
        this.limiteList.add(limite);
    }
}
