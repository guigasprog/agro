package analiseClimatica.infra.climaTempo;

import analiseClimatica.domain.model.Clima;
import analiseClimatica.domain.model.AreaAgricola;
import com.fasterxml.jackson.core.type.TypeReference; // IMPORTANTE! Para ler listas.
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class GerenciadorDeArquivo {

    private static void salvarClimaListEmArquivoDaAreaAgricola(AreaAgricola areaAgricola,List<Clima> climaList) {

        String nomeArquivo = areaAgricola.getId()+".json";
        System.out.println("--- Iniciando processo para SALVAR uma LISTA em arquivo ---");


        try {

            ObjectMapper mapper = new ObjectMapper();
            mapper.enable(SerializationFeature.INDENT_OUTPUT);
            mapper.writeValue(new File(nomeArquivo), climaList);

            System.out.println("Sucesso! A lista foi salva no arquivo: " + nomeArquivo);

        } catch (IOException e) {
            System.err.println("Ocorreu um erro ao salvar o arquivo: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private static List<Clima> buscarClimaList(AreaAgricola areaAgricola) {

        String nomeArquivo = areaAgricola.getId()+".json";
        List<Clima> climaList =  new ArrayList<>();
        System.out.println("--- Iniciando processo para LER uma LISTA do arquivo ---");

        try {
            ObjectMapper mapper = new ObjectMapper();

            File arquivo = new File(nomeArquivo);
            TypeReference<List<Clima>> tipoDaLista = new TypeReference<>() {};
            climaList = mapper.readValue(arquivo, tipoDaLista);

            System.out.println("Sucesso! A lista foi lida do arquivo: " + nomeArquivo);


        } catch (IOException e) {
            System.err.println("Ocorreu um erro ao ler o arquivo: " + e.getMessage());
            e.printStackTrace();
        }
        return climaList;
    }

}