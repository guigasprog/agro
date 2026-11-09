package analiseClimatica.infra.persistence.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "clima")
public class ClimaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false)
    private LocalDateTime data;

    private Double umidade;
    private Double precipitacao;

    @Column(name = "probabilidade_precipitacao")
    private Double probabilidadePrecipitacao;

    @Column(name = "pressao_superficie")
    private Double pressaoSuperficie;

    @Column(name = "velocidade_vento")
    private Double velocidadeVento;

    @Column(name = "umidade_volumetrica", nullable = false)
    private Double umidadeVolumetrica;

    @Column(nullable = false)
    private Double visibilidade;

    @Column(name = "temperatura_bulbo_seco")
    private Double temperaturaBulboSeco;

    @Column(name = "temperatura_bulbo_umido")
    private Double temperaturaBulboUmido;

    @Column(name = "delta_t")
    private Double deltaT;

    @Column(name = "capacidade_suporte_solo")
    private Double capacidadeSuporteSolo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_area_agricola", nullable = false)
    private AreaAgricolaEntity areaAgricola;

    public ClimaEntity(analiseClimatica.domain.model.Clima clima, AreaAgricolaEntity areaAgricola) {
        this.data = clima.getData();
        this.umidade = clima.getUmidade();
        this.precipitacao = clima.getPrecipitacao();
        this.probabilidadePrecipitacao = clima.getProbabilidadePrecipitacao();
        this.pressaoSuperficie = clima.getPressaoSuperficie();
        this.velocidadeVento = clima.getVelocidadeVento();
        this.umidadeVolumetrica = clima.getUmidadeVolumetrica() != null ? clima.getUmidadeVolumetrica() : 0.0;
        this.visibilidade = clima.getVisibilidade() != null ? clima.getVisibilidade() : 0.0;
        this.temperaturaBulboSeco = clima.getTemperaturaBulboSeco();
        this.temperaturaBulboUmido = clima.getTemperaturaBulboUmido();
        this.deltaT = clima.getDeltaT();
        this.capacidadeSuporteSolo = clima.getCapacidadeSuporteSolo();
        this.areaAgricola = areaAgricola;
    }

    public analiseClimatica.domain.model.Clima toModel() {
        return new analiseClimatica.domain.model.Clima(
                this.data.toString(),
                this.temperaturaBulboSeco,
                this.temperaturaBulboUmido,
                this.deltaT,
                this.umidade,
                this.precipitacao,
                this.probabilidadePrecipitacao,
                this.velocidadeVento,
                this.visibilidade,
                this.pressaoSuperficie,
                this.umidadeVolumetrica,
                this.capacidadeSuporteSolo
        );
    }
}