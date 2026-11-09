package analiseClimatica.domain.model;

import analiseClimatica.domain.enums.TexturaSolo;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.awt.*;
import java.time.LocalDate;
import java.util.UUID;
import org.locationtech.jts.geom.MultiPolygon;

@Getter
@Setter
@AllArgsConstructor
public class AreaAgricola {
    private UUID id;
    private String nome;
    private String cidade;
    private String estado;
    private MultiPolygon geometria;// geometri no postgres

    private double hectares;
    private LocalDate ultimaAtualizacaoClima;
    private LocalDate ultimaAtualizacaoPulverizacao;
    private LocalDate ultimaAtualizacaoCompactacao;

    private Solo solo;

    public AreaAgricola(analiseClimatica.infra.persistence.entity.AreaAgricolaEntity entity) {
        this.id = entity.getId();
        this.nome = entity.getNome();
        this.cidade = entity.getCidade();
        this.estado = entity.getEstado();
        this.geometria = entity.getGeometria();
        this.hectares = entity.getHectares();
        this.ultimaAtualizacaoClima = entity.getUltimaAtualizacaoClima();
        this.ultimaAtualizacaoPulverizacao = entity.getUltimaAtualizacaoPulverizacao();
        this.ultimaAtualizacaoCompactacao = entity.getUltimaAtualizacaoCompactacao();
        if (entity.getSolo() != null) {
            this.solo = new Solo(entity.getSolo());
        }
    }

    public AreaAgricola(analiseClimatica.infra.web.response.AreaAgricolaDTO dto) {
        this.id = dto.getId();
        this.nome = dto.getNome();
        this.cidade = (dto.getCidade() != null && !dto.getCidade().trim().isEmpty()) ? dto.getCidade() : null;
        this.estado = (dto.getEstado() != null && !dto.getEstado().trim().isEmpty()) ? dto.getEstado() : null;
        this.geometria = dto.getGeometria();
        this.hectares = dto.getHectares();
        this.ultimaAtualizacaoClima = dto.getUltimaAtualizacaoClima();
        this.ultimaAtualizacaoPulverizacao = dto.getUltimaAtualizacaoPulverizacao();
        this.ultimaAtualizacaoCompactacao = dto.getUltimaAtualizacaoCompactacao();
        if (dto.getIdSolo() != null) {
            this.solo = new Solo();
            this.solo.setId(dto.getIdSolo());
        }
    }
}
