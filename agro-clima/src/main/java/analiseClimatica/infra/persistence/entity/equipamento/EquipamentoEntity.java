package analiseClimatica.infra.persistence.entity.equipamento;

import analiseClimatica.infra.persistence.entity.LimiteEntity;
import analiseClimatica.infra.web.response.LimiteDTO;
import analiseClimatica.infra.web.response.equipamento.EquipamentoDTO;
import analiseClimatica.domain.enums.TipoEquipamento;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "equipamento")
// 1. Define a estratégia JOINED (Tabelas separadas unidas pelo ID)
@Inheritance(strategy = InheritanceType.JOINED)
// 2. Define qual a coluna no banco que diferencia os tipos (DRONE, TRATOR...)
@DiscriminatorColumn(name = "tipo_equipamento", discriminatorType = DiscriminatorType.STRING)
@NoArgsConstructor
public abstract class EquipamentoEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    //o tipoEquipamento não é usado para inserir ou alterar,
    // pois nesses casos o DiscriminatorColumn faz o trabalho
    //coloquei aqui unicamente para o select
    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_equipamento", insertable = false, updatable = false)
    private TipoEquipamento tipoEquipamento;

    @Column(nullable = false, length = 150)
    private String nome;

    @Column(name = "nome_fabricante", length = 150)
    private String nomeFabricante;

    private Double pesoTotal;

    @OneToMany(
            mappedBy = "equipamento",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<LimiteEntity> limites = new ArrayList<>();

    public EquipamentoEntity(UUID id, String nome, String nomeFabricante, Double pesoTotal, List<LimiteEntity> limiteList) {
        this.id = id;
        this.nome = nome;
        this.nomeFabricante = nomeFabricante;
        this.pesoTotal = pesoTotal;
        adicionarLimite(limiteList);
    }
    public EquipamentoEntity(UUID id, String nome, String nomeFabricante, Double pesoTotal) {
        this.id = id;
        this.nome = nome;
        this.nomeFabricante = nomeFabricante;
        this.pesoTotal = pesoTotal;
    }
    public EquipamentoEntity(EquipamentoDTO dto){
        this.id = dto.getId();
        this.nome = dto.getNome();
        this.nomeFabricante = dto.getNomeFabricante();
        this.pesoTotal = dto.getPesoTotal();
        adicionarLimiteDTO(dto.getLimiteList());
    }


    public void adicionarLimite(LimiteEntity limite) {
        limite.setEquipamento(this);
        this.limites.add(limite);
    }
    public void adicionarLimite(List<LimiteEntity> limiteList) {
        limiteList.forEach(this::adicionarLimite);
    }
    public void adicionarLimiteDTO(List<LimiteDTO> limiteList) {
        limiteList.stream()
                .map(LimiteEntity::new)
                .forEach(this::adicionarLimite);
    }
}