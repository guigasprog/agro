package analiseClimatica.domain.service;

import analiseClimatica.domain.model.Clima;
import analiseClimatica.domain.model.Ocorrencia;
import analiseClimatica.domain.model.gestao_recurso.Equipamento;
import analiseClimatica.domain.model.gestao_recurso.Limite;

import java.util.ArrayList;
import java.util.List;

public class AvaliarRiscoLimiteEquipamento {
    public static void execute(List<Clima> climaList, Equipamento equipamento) {
        String euipamentoDescricao = equipamento.getTipoEquipamento().getDescricao() + " " +  equipamento.getNome();
        if (equipamento.getLimiteList() != null) {
            for (Limite limite : equipamento.getLimiteList()) {
                verificaLimite(climaList,limite,euipamentoDescricao);
            }
        }
    }
    public static void verificaLimite(List<Clima> climaList, Limite limite, String euipamentoDescricao) {
        for (Clima clima : climaList) {
            switch (limite.getTipo()) {
                case TEMPERATURA -> clima.getOcorrenciaList().addAll(verificaValor(clima.getTemperaturaBulboSeco(), limite, euipamentoDescricao));
                case UMIDADE -> clima.getOcorrenciaList().addAll(verificaValor(clima.getUmidade(), limite, euipamentoDescricao));
                case VENTO -> clima.getOcorrenciaList().addAll(verificaValor(clima.getVelocidadeVento(), limite, euipamentoDescricao));
                case VISIBILIDADE -> clima.getOcorrenciaList().addAll(verificaValor(clima.getVisibilidade(), limite, euipamentoDescricao));
            }
        }
    }

    private static List<Ocorrencia> verificaValor (Double valor, Limite limite, String euipamentoDescricao) {
        List<Ocorrencia> ocorrenciaList = new ArrayList<>();
        String titulo = "";
        String descricaoMax = "Máx: " + limite.getValorMaximo() + limite.getTipo().getUnidadeMedida() + " . "+ "Atual: " + valor + limite.getTipo().getUnidadeMedida() ;
        String descricaoMin = "Min: " + limite.getValorMinimo() + limite.getTipo().getUnidadeMedida() + " . "+ "Atual: " + valor + limite.getTipo().getUnidadeMedida() ;

        if(limite.getValorMaximo() != null){
            if(valor > limite.getValorMaximo() ) {
                titulo = limite.getTipo().getDescricao() + " a cima do limite máximo do " + euipamentoDescricao;
                ocorrenciaList.add(Ocorrencia.criarNivelAlto(titulo,descricaoMax));
            }else if (valor == limite.getValorMaximo()){
                titulo = limite.getTipo().getDescricao() + " no limite máximo do " + euipamentoDescricao;
                ocorrenciaList.add(Ocorrencia.criarNivelMedio(titulo,descricaoMax));
            }else if (valor > limite.getValorMaximo() - limite.getValorMaximo() * 0.10){
                titulo = limite.getTipo().getDescricao() + " perto do limite máximo do " + euipamentoDescricao;
                ocorrenciaList.add(Ocorrencia.criarNivelMedio(titulo,descricaoMax));
            }
        }

        if(limite.getValorMinimo() != null){
            if(valor < limite.getValorMinimo() ) {
                titulo = limite.getTipo().getDescricao() + " abaixo do limite mínimo do " + euipamentoDescricao;
                ocorrenciaList.add(Ocorrencia.criarNivelAlto(titulo,descricaoMin));
            }else if (valor == limite.getValorMinimo()){
                titulo = limite.getTipo().getDescricao() + " no limite mínimo do " + euipamentoDescricao;
                ocorrenciaList.add(Ocorrencia.criarNivelMedio(titulo,descricaoMin));
            }else if (valor < limite.getValorMinimo() + limite.getValorMinimo() * 0.10){
                titulo = limite.getTipo().getDescricao() + " perto do limite mínimo do " + euipamentoDescricao;
                ocorrenciaList.add(Ocorrencia.criarNivelMedio(titulo,descricaoMin));
            }
        }

        return ocorrenciaList;
    }

}
