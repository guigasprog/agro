package analiseClimatica.infra.persistence.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.util.UUID;

import org.locationtech.jts.geom.MultiPolygon;

@Getter
@NoArgsConstructor
@Entity
@Table(name = "area_agricola")
public class AreaAgricolaEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    private String nome;
    private String cidade;
    private String estado;

    @Column(columnDefinition = "geometry(MultiPolygon,4326)")
    private MultiPolygon geometria;

    @Column(name = "hectares")
    private double hectares;

    @Column(name = "ultima_atualizacao_clima")
    private LocalDate ultimaAtualizacaoClima;

    @Column(name = "ultima_atualizacao_pulverizacao")
    private LocalDate ultimaAtualizacaoPulverizacao;

    @Column(name = "ultima_atualizacao_compactacao")
    private LocalDate ultimaAtualizacaoCompactacao;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_solo", nullable = false)
    private SoloEntity solo;

    public AreaAgricolaEntity(analiseClimatica.domain.model.AreaAgricola model) {
        this.id = model.getId();
        this.nome = model.getNome();
        this.cidade = model.getCidade();
        this.estado = model.getEstado();
        this.geometria = model.getGeometria();
        this.hectares = model.getHectares();
        this.ultimaAtualizacaoClima = model.getUltimaAtualizacaoClima();
        this.ultimaAtualizacaoPulverizacao = model.getUltimaAtualizacaoPulverizacao();
        this.ultimaAtualizacaoCompactacao = model.getUltimaAtualizacaoCompactacao();
        if (model.getSolo() != null) {
            this.solo = new SoloEntity(model.getSolo());
        }
    }
}