package analiseClimatica.domain.model.gestao_recurso;

import analiseClimatica.domain.enums.TipoEquipamento;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
public class Equipamento {

    private UUID id;
    private TipoEquipamento tipoEquipamento;
    private String tipoImplemento;
    private String nome;
    private String nomeFrabricante;
    private double pesoTotal;
    private double distribuicaoEstaticaTraseira;
    private double pressaoPneuDianteiro;
    private double pressaoPneuTraseiro;
    private int qtRodasDianteiras; //maior que 0
    private int qtRodasTraseiras;// maior que 0


    private List<Limite> limiteList;


    public Equipamento(UUID id, TipoEquipamento tipo, String nome, String nomeFrabricante) {
        this.id = id;
        this.tipoEquipamento = tipo;
        this.nome = nome;
        this.nomeFrabricante = nomeFrabricante;
    }
    public void adicionarLimite(List<Limite> limiteList){
        this.limiteList = limiteList;
    }
    public void adicionarLimite(Limite limite){
        this.limiteList.add(limite);
    }
}
