import { Component, inject, OnInit, signal, computed, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { DynamicFormComponent } from '../ui/forms_dinamico/dynamic-form.component';
import { DynamicField } from '../ui/forms_dinamico/dynamic-form.model';
import { AreaAgricolaService } from '../area_agricola/area-agricola.service';
import { EquipmentService } from '../equipamento/equipment.service';
import { JanelaOperacionalService } from './janela_operacional.service';
import { JanelaOperacional } from './janela-operacional.model';
import { SidePanelComponent } from "../ui/painel_lateral/side-panel.component";
import { Router } from '@angular/router';
import { map } from 'rxjs';

export interface JanelaOperacionalDialogData { id?: string; }

@Component({
  selector: 'app-janela-opracional-form',
  standalone: true,
  providers:[EquipmentService,AreaAgricolaService,JanelaOperacionalService],
  imports: [ReactiveFormsModule, MatButtonModule,
    DynamicFormComponent, SidePanelComponent],
  template: `
      <app-side-panel
          [title]="'Estimar Janela Operacional'"
          [submitLabel]="'Estimar'"
          [saving]="saving()"
          [cancel]=false
          (submitted)="onSubmit()"
          >

      <app-dynamic-form [form]="form" [fields]="fields()" />

      </app-side-panel>

  `
})
export class JanelaOperacionalDialogComponent implements OnInit {
  ngOnInit(): void {
  }
  private readonly fb      = inject(FormBuilder);
  private readonly serviceEquipamento = inject(EquipmentService);
  private readonly serviceAreaAgicola = inject(AreaAgricolaService);
  private readonly serviceJanelaOperacional = inject(JanelaOperacionalService);
  private readonly router = inject(Router);
  readonly estimado = output<JanelaOperacional>();

  readonly saving      = signal(false);

  readonly form: FormGroup = this.fb.group({
    tipoOperacao:              ['', Validators.required],
    areaAgricolaId:            [null, Validators.required],
    equipamentoId:             [null, Validators.required],
    implementoIdList:          this.fb.array([]),
  });

  readonly fields = computed<DynamicField[]>(() => {
    return [
      {
        key: 'tipoOperacao', label: 'Operação ',
        type: 'select',
        options: [
          { label: 'Pulverização',  value: 'APLICAR_INSUMO' },
          { label: 'Mapeamento',    value: 'MAPEAMENTO' },
          { label: 'Plantio',       value: 'PLANTIO' },
          { label: 'Colheita',      value: 'COLHEITA' }
        ],
        validators: [Validators.required],
      },
      {
        key: 'areaAgricolaId', label: 'Area Agricola', type: 'lookup',
        validators: [Validators.required],
        lookup: {
          search:    term => this.serviceAreaAgicola.buscarTodasReduzida().pipe(
            map(items => items.filter(item =>
              !term ||
              (item.nome && item.nome.toLowerCase().includes(term.toLowerCase())) ||
              (item.cidade && item.cidade.toLowerCase().includes(term.toLowerCase())) ||
              (item.estado && item.estado.toLowerCase().includes(term.toLowerCase()))
            ))
          ),
          labelKey:  'nome',
          valueKey:  'id',
          columns:   [
            { key: 'nome',     label: 'Nome'      },
            { key: 'cidade',   label: 'Cidade'    },
            { key: 'estado',   label: 'Estado'    }
          ],
          placeholder: 'Area Agricola',
        },
      },
      {
        key: 'equipamentoId', label: 'Equipamento', type: 'lookup',
        validators: [Validators.required],
        lookup: {
          search:    term => this.serviceEquipamento.findByTipoEquipamento(['DRONE','TRATOR']).pipe(
            map(items => items.filter(item => 
              !term || 
              (item.nome && item.nome.toLowerCase().includes(term.toLowerCase())) ||
              (item.nomeFabricante && item.nomeFabricante.toLowerCase().includes(term.toLowerCase())) ||
              (item.tipoEquipamento && item.tipoEquipamento.toLowerCase().includes(term.toLowerCase()))
            ))
          ),
          labelKey:  'nome',
          valueKey:  'id',
          columns:   [
            { key: 'tipoEquipamento', label: 'Tipo' },
            { key: 'nome',     label: 'Nome'      },
            { key: 'nomeFabricante',  label: 'Nome Fabricante'   }
          ],
          placeholder: 'Equipamento',
        },
      },
      {
        key:      'implementoIdList',
        label:    'Implementos',
        type:     'group-array',
        addLabel: 'Adicionar implemento',
        children: [
          {
            key: 'implementoId', label: 'Implemento', type: 'lookup',
            lookup: {
              search:    term => this.serviceEquipamento.findByTipoEquipamento(['IMPLEMENTO']).pipe(
                map(items => items.filter(item => 
                  !term || 
                  (item.nome && item.nome.toLowerCase().includes(term.toLowerCase())) ||
                  (item.nomeFabricante && item.nomeFabricante.toLowerCase().includes(term.toLowerCase()))
                ))
              ),
              labelKey:  'nome',
              valueKey:  'id',
              columns:   [
                { key: 'nome',     label: 'Nome'      },
                { key: 'nomeFabricante',  label: 'Nome Fabricante'   }
              ],
              placeholder: 'Implemento',
            },
          }
        ],
      }
    ];
  });




  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving.set(true);
    const rawValue = this.form.getRawValue();
    
    // Mapeando os nomes dos campos para bater exatamente com EstimativaDTO no backend
    const payload: any = {
      tipoOperacao: rawValue.tipoOperacao,
      idAreaAgricola: rawValue.areaAgricolaId,
      idEquipamento: rawValue.equipamentoId,
      idImplementoList: (rawValue.implementoIdList || []).map((item: any) => item.implementoId)
    };

    this.serviceJanelaOperacional.save(payload).subscribe({
      next: (res: any) => {
        this.saving.set(false);
        this.estimado.emit(payload); // ← emite ao pai
        if (res && res.id) {
          this.router.navigate(['/janela-operacional', res.id, 'resultado']);
        }
      },
      error: () => this.saving.set(false),
    });
  }
}
