import { Component, inject, input, output, signal, computed, effect, viewChild, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorSnackbarComponent } from '../ui/snackbar/error-snackbar.component';
import { SuccessSnackbarComponent } from '../ui/snackbar/success-snackbar.component';
import { DynamicFormComponent } from '../ui/forms_dinamico/dynamic-form.component';
import { DynamicField } from '../ui/forms_dinamico/dynamic-form.model';
import { AreaAgricolaService } from './area-agricola.service';
import { AreaAgricola } from './area-agricola.model';
import { AreaAgricolaMapService } from '../area_agricola_map/area_agricola_map/area-agricola-map.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-area-agricola-form',
  standalone: true,
  imports: [ReactiveFormsModule, MatButtonModule, DynamicFormComponent],
  template: `
    @if (loadingData()) {
      <div class="flex justify-center py-10">
        <span class="material-symbols-outlined text-white/30 text-[40px] animate-spin">
          progress_activity
        </span>
      </div>
    }
    <div [class.hidden]="loadingData()">
      <div class="text-xs text-blue-300 bg-blue-900/20 p-2 rounded mb-4 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-[16px]">info</span>
          Use as ferramentas no mapa para desenhar.
        </div>
      </div>
      <app-dynamic-form [form]="form" [fields]="fields()" />
    </div>
  `
})
export class AreaAgricolaFormComponent implements OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly service = inject(AreaAgricolaService);
  public readonly mapService = inject(AreaAgricolaMapService);

  readonly id = input<string | null>(null);
  readonly saved = output<void>();
  readonly saving = output<boolean>();

  readonly loadingData = signal(false);
  readonly _saving = signal(false);

  readonly form: FormGroup = this.fb.group({
    nome: ['', Validators.required],
    cidade: [null],
    estado: [null],
    hectares: [null, [Validators.required, Validators.min(1)]],
    idSolo: [null, Validators.required],
    geometria: [null, Validators.required]
  });

  readonly dynamicForm = viewChild.required(DynamicFormComponent);

  readonly fields = computed<DynamicField[]>(() => [
    { key: 'nome', label: 'Nome', type: 'text', validators: [Validators.required] },
    { key: 'cidade', label: 'Cidade', type: 'text', validators: [] },
    { key: 'estado', label: 'Estado', type: 'text', validators: [] },
    {
      key: 'hectares', label: 'Hectares', type: 'number',
      validators: [Validators.required], min: 0.01
    },
    {
      key: 'idSolo', label: 'Solo', type: 'lookup',
      lookup: {
        search: term => this.service.searchSolos(term),
        labelKey: 'nome',
        valueKey: 'id',
        validators: [Validators.required],
        columns: [{ key: 'nome', label: 'Nome' }, { key: 'textura', label: 'Textura' }],
        placeholder: 'Buscar solo por nome...',
      },
    },
  ]);

  get isEdit() { return !!this.id(); }

  private geoSub: Subscription;

  constructor() {
    // isFormActive é controlado pelo componente pai (AreaAgricolaListComponent)
    // que orquestra a abertura/fechamento do painel sem race conditions
    this.geoSub = this.mapService.geometriaDesenhada$.subscribe(geometria => {
        this.form.patchValue({ geometria }, { emitEvent: false });
    });

    effect(() => {
      const id = this.id();
      this.mapService.editAreaId.set(id);
      if (id) {
        this.load(id);
      } else {
        this.form.reset();
        this.dynamicForm().clearAllLookups();
        this.mapService.enableDrawMode();
      }
    }, { allowSignalWrites: true });
  }

  ngOnDestroy(): void {
      this.geoSub.unsubscribe();
      this.mapService.clearDraw();
      this.mapService.editAreaId.set(null);
      // isFormActive.set(false) removido daqui — gerenciado pelo componente pai
  }

  private readonly snackBar = inject(MatSnackBar);

  private load(id: string): void {
    this.loadingData.set(true);
    this.service.findById(id).subscribe(area => {
      if (!area) return;
      this.form.patchValue(area);
      
      if (area.idSolo && area.nomeSolo) {
        this.dynamicForm().setLookupLabel('idSolo', area.nomeSolo);
      }
      
      this.mapService.enableDrawMode(area.geometria as any);
      this.loadingData.set(false);
    });
  }

  submit(): void {
    if (!this.mapService.hasDrawnGeometry() || this.form.get('geometria')?.invalid) {
        this.snackBar.openFromComponent(ErrorSnackbarComponent, {
            data: 'Por favor, desenhe um polígono no mapa para a Área Agrícola.',
            duration: 5000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['custom-error-snackbar']
        });
        return;
    }

    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    
    this._saving.set(true);
    this.saving.emit(true);
    const raw = this.form.getRawValue();
    const payload: AreaAgricola = { 
        ...raw, 
        cidade: raw.cidade?.trim() || null,
        estado: raw.estado?.trim() || null,
        id: this.id() ?? undefined 
    };
    
    this.service.save(payload).subscribe({
      next: () => {
        this._saving.set(false);
        this.saving.emit(false);
        this.snackBar.openFromComponent(SuccessSnackbarComponent, {
          data: 'Salvo com sucesso!',
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['custom-error-snackbar']
        });
        this.saved.emit();
        this.form.reset();
        this.dynamicForm().clearAllLookups();
        this.mapService.clearDraw();
      },
      error: () => {
        this._saving.set(false);
        this.saving.emit(false);
      },
    });
  }
}
