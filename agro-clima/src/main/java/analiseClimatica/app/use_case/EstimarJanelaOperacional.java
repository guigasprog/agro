package analiseClimatica.app.use_case;

import analiseClimatica.app.repository.AreaAgricolaGateway;
import analiseClimatica.app.repository.ClimaGateway;
import analiseClimatica.app.repository.EquipamentoGateway;
import analiseClimatica.domain.enums.TipoEquipamento;
import analiseClimatica.domain.enums.TipoOperacao;
import analiseClimatica.domain.model.AreaAgricola;
import analiseClimatica.domain.model.Clima;
import analiseClimatica.domain.model.Ocorrencia;
import analiseClimatica.domain.enums.NivelAlerta;
import analiseClimatica.domain.model.gestao_recurso.Equipamento;
import analiseClimatica.domain.service.AvaliarRiscoLimiteEquipamento;
import analiseClimatica.domain.service.compactacao.AvaliarRiscoCompactacao;
import analiseClimatica.domain.service.pulverizacao.AvaliarRiscoPulverizacao;
import analiseClimatica.infra.mapper.EquipamentoMapper;
import analiseClimatica.infra.openMeteo.ConsultaOpenMeteo;
import analiseClimatica.infra.web.response.AnaliseJanelaOperacionalDTO;
import analiseClimatica.infra.web.response.EstimativaDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EstimarJanelaOperacional {

    private final ClimaGateway climaGateway;
    private final AreaAgricolaGateway agricolaGateway;
    private final EquipamentoGateway equipamentoGateway;

    public List<AnaliseJanelaOperacionalDTO> executar(EstimativaDTO estimativaDTO) {

        AreaAgricola areaAgricola = agricolaGateway.buscarPorId(estimativaDTO.getIdAreaAgricola());
        Equipamento equipamento = EquipamentoMapper.toModel(equipamentoGateway.buscarPorId(estimativaDTO.getIdEquipamento()));
        List<Equipamento> implementoList = equipamentoGateway.buscarTodosPorId(estimativaDTO.getIdImplementoList());

        atualizarClima(areaAgricola);
        List<Clima> climaList = climaGateway.buscarTodosPorLocal(areaAgricola.getId());
        
        aplicarRegrasDeRisco(estimativaDTO, areaAgricola, equipamento, implementoList, climaList);

        Map<LocalDate, List<Clima>> climaMap = climaList.stream()
                .collect(Collectors.groupingBy(clima -> clima.getData().toLocalDate()));

        return climaMap.values().stream()
                .map(this::analisarJanela)
                .sorted(Comparator.comparing(AnaliseJanelaOperacionalDTO::getData))
                .collect(Collectors.toList());
    }

    private void atualizarClima(AreaAgricola areaAgricola) {
        if (areaAgricola.getUltimaAtualizacaoClima() == null || areaAgricola.getUltimaAtualizacaoClima().isBefore(LocalDate.now())) {

            List<Clima> climaList = ConsultaOpenMeteo.execute(areaAgricola);

            if (!climaList.isEmpty()) {
                climaGateway.deletarPorAreaAgricola(areaAgricola);
                climaGateway.salvarTodos(climaList, areaAgricola);
            }

            areaAgricola.setUltimaAtualizacaoClima(LocalDate.now());
            agricolaGateway.salvar(areaAgricola);
        }
    }

    private void aplicarRegrasDeRisco(EstimativaDTO estimativaDTO, AreaAgricola areaAgricola,
                                      Equipamento equipamento, List<Equipamento> implementoList, List<Clima> climaList) {

        AvaliarRiscoLimiteEquipamento.execute(climaList, equipamento);
        implementoList.forEach(e -> AvaliarRiscoLimiteEquipamento.execute(climaList, e));

        if (TipoEquipamento.TRATOR.equals(equipamento.getTipoEquipamento())) {
            AvaliarRiscoCompactacao.execute(equipamento, climaList, areaAgricola, implementoList);
        }

        if (TipoOperacao.APLICAR_INSUMO.equals(estimativaDTO.getTipoOperacao())) {
            climaList.forEach(AvaliarRiscoPulverizacao::execute);
        }
    }

    private AnaliseJanelaOperacionalDTO analisarJanela(List<Clima> climaList) {
        AnaliseJanelaOperacionalDTO dto = new AnaliseJanelaOperacionalDTO();

        if (climaList == null || climaList.isEmpty()) {
            return dto;
        }

        dto.setData(climaList.get(0).getData().toLocalDate());
        dto.setQtProblemaCritico(0L);
        dto.setQtProblemaModerado(0L);
        dto.setHorasLivres(0L);

        double somaTemperatura = 0.0;
        double somaUmidade = 0.0;
        double somaVelocidadeVento = 0.0;
        double somaPrecipitacao = 0.0;
        double maxProbabilidadePrecipitacao = 0.0;
        int totalRegistros = climaList.size();

        for (Clima clima : climaList) {
            if(clima.getProbabilidadePrecipitacao() > 50 && clima.getProbabilidadePrecipitacao() < 70) {
                clima.getOcorrenciaList().add(Ocorrencia.criarNivelMedio("Risco de chuva maior que 50%","Atual: "+clima.getProbabilidadePrecipitacao()+"%. precipitação estimada é de "+ clima.getPrecipitacao()+"mm"));
            }else if(clima.getProbabilidadePrecipitacao() > 70) {
                clima.getOcorrenciaList().add(Ocorrencia.criarNivelAlto("Risco de chuva maior que 70%","Atual: "+clima.getProbabilidadePrecipitacao()+"%. precipitação estimada é de "+ clima.getPrecipitacao()+"mm"));
            }
            somaTemperatura += clima.getTemperaturaBulboSeco() != null ? clima.getTemperaturaBulboSeco() : 0.0;
            somaUmidade += clima.getUmidade() != null ? clima.getUmidade() : 0.0;
            somaVelocidadeVento += clima.getVelocidadeVento() != null ? clima.getVelocidadeVento() : 0.0;
            somaPrecipitacao += clima.getPrecipitacao() != null ? clima.getPrecipitacao() : 0.0;
            if (clima.getProbabilidadePrecipitacao() != null && clima.getProbabilidadePrecipitacao() > maxProbabilidadePrecipitacao) {
                maxProbabilidadePrecipitacao = clima.getProbabilidadePrecipitacao();
            }

            if (clima.getOcorrenciaList() == null || clima.getOcorrenciaList().isEmpty()) {
                dto.setHorasLivres(dto.getHorasLivres() + 1);
            } else {
                for (Ocorrencia ocorrencia : clima.getOcorrenciaList()) {
                    if (NivelAlerta.ALTO.equals(ocorrencia.getNivelAlerta())) {
                        dto.setQtProblemaCritico(dto.getQtProblemaCritico() + 1);
                    } else if (NivelAlerta.MEDIO.equals(ocorrencia.getNivelAlerta())) {
                        dto.setQtProblemaModerado(dto.getQtProblemaModerado() + 1);
                    }
                }
            }
        }
        dto.setTemperaturaMedia(somaTemperatura / totalRegistros);
        dto.setUmidadeMedia(somaUmidade / totalRegistros);
        dto.setVelocidadeVentoMedia(somaVelocidadeVento / totalRegistros);
        dto.setPrecipitacaoAcumulada(somaPrecipitacao);
        dto.setProbabilidadePrecipitacao(maxProbabilidadePrecipitacao);
        dto.setClimaList(climaList);

        return dto;
    }
}