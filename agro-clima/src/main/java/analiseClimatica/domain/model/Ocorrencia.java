package analiseClimatica.domain.model;

import analiseClimatica.domain.enums.NivelAlerta;
import lombok.Getter;

@Getter
public class Ocorrencia {
    private NivelAlerta nivelAlerta;
    private String titulo;
    private String descricao;

    public Ocorrencia(NivelAlerta nivelAlerta, String titulo,String descricao) {
        this.descricao = descricao;
        this.nivelAlerta = nivelAlerta;
        this.titulo = titulo;
    }
    public static Ocorrencia criarNivelAlto ( String titulo,String descricao){
        return new Ocorrencia(NivelAlerta.ALTO,titulo,descricao);
    }
    public static Ocorrencia criarNivelMedio ( String titulo,String descricao){
        return new Ocorrencia(NivelAlerta.MEDIO,titulo,descricao);
    }
}
