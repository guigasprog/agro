import { Component, inject, OnInit, computed, signal, viewChild, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatIconButton } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { AreaAgricolaService } from './area-agricola.service';
import { AreaAgricola } from './area-agricola.model';
import { ListShellComponent } from '../ui/listagemItens/list-shell.component';
import { AreaAgricolaFilter, AreaAgricolaFilterComponent } from './area-filter.component';
import { AreaCardComponent } from './area-card.component';
import { AreaAgricolaFormComponent } from './area-form.component';
import { SidePanelComponent } from '../ui/painel_lateral/side-panel.component';
import { AreaAgricolaMapService } from '../area_agricola_map/area_agricola_map/area-agricola-map.service';
import { ListarAreaAgricolaService } from '../area_agricola_map/area_agricola_map/listar-area-agricola.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../ui/dialog/confirm-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SuccessSnackbarComponent } from '../ui/snackbar/success-snackbar.component';

@Component({
  selector: 'app-area-list',
  standalone: true,
  providers: [AreaAgricolaService],
  imports: [
    MatIconButton, MatRippleModule,
    ListShellComponent, AreaAgricolaFilterComponent, AreaCardComponent,
    SidePanelComponent, AreaAgricolaFormComponent
  ],
  host: {
    class: 'contents'
  },
  template: `
    <!-- Lista -->
    <app-list-shell class="order-1"
      title="Área Agrícola"
      [isLoading]="isLoading()"
      [error]="error()"
      [count]="count()">

      <app-area-agricola-filter listActions (filterChanged)="onFilterChanged($event)" />

      <button listActions matIconButton (click)="openNew()">
        <span class="material-symbols-outlined text-white/50 text-[20px]">add_circle_outline</span>
      </button>

      <button listError matIconButton (click)="reload()">
        <span class="material-symbols-outlined text-white/50 text-[20px]">refresh</span>
      </button>

      @for (ag of filteredList(); track ag.id) {
        <app-area-card listItems [area]="ag" (select)="openEdit($event)" />
      }

      <div listFooter matRipple (click)="openNew()"
           class="flex items-center gap-3 rounded-xl px-3 py-2 border border-dashed
                  border-white/10 hover:bg-white/5 cursor-pointer transition-colors">
        <div class="w-10 h-10 rounded-xl bg-white/[.04] flex items-center justify-center flex-shrink-0">
          <span class="material-symbols-outlined text-white/20 text-[20px]">add</span>
        </div>
        <span class="text-white/35 text-sm flex-1">Nova Área Agrícola</span>
        <span class="material-symbols-outlined text-white/20 text-[20px]">chevron_right</span>
      </div>
    </app-list-shell>

    <!-- Painel lateral -->
    @if (panelOpen()) {
      <div class="w-80 flex-shrink-0 h-full order-3">
        <app-side-panel
          [title]="selectedId() ? 'Editar Área' : 'Nova Área'"
          [saving]="isSaving()"
          [showDelete]="!!selectedId()"
          (submitted)="onSubmit()"
          (deleted)="onDelete()"
          (closed)="closePanel()">

          <app-area-agricola-form
            #formRef
            [id]="selectedId()"
            (saved)="onSaved()"
            (saving)="isSaving.set($event)" />

        </app-side-panel>
      </div>
    }
  `
})
export class AreaAgricolaListComponent implements OnInit {
  private readonly service = inject(AreaAgricolaService);
  private readonly mapService = inject(AreaAgricolaMapService);
  private readonly listagemAreasMapService = inject(ListarAreaAgricolaService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  readonly areaAgricolaList = this.service.areaAgricolaList.asReadonly();
  readonly isLoading = this.service.isLoading.asReadonly();
  readonly error = this.service.error.asReadonly();

  readonly activeFilter = signal<AreaAgricolaFilter | null>(null);
  readonly panelOpen = signal(false);
  readonly selectedId = signal<string | null>(null);
  readonly isSaving = signal(false);

  readonly formRef = viewChild.required<AreaAgricolaFormComponent>('formRef');

  readonly filteredList = computed(() => {
    const f = this.activeFilter();
    const all = this.areaAgricolaList();
    if (!f) return all;
    return all.filter(ag => {
      const nomeMatch = !f.nome || ag.nome.toLowerCase().includes(f.nome.toLowerCase());
      const cidadeMatch = !f.cidade || ag.cidade?.toLowerCase().includes(f.cidade.toLowerCase());
      const estadoMatch = !f.estado || ag.estado?.toLowerCase().includes(f.estado.toLowerCase());
      return nomeMatch && cidadeMatch && estadoMatch;
    });
  });

  readonly count = computed(() => {
    const n = this.areaAgricolaList().length;
    return `${n} ${n !== 1 ? 'Áreas Agrícolas' : 'Área Agrícola'}`;
  });

  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    this.mapService.areaClicada$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(id => {
        const area = this.areaAgricolaList().find(a => a.id === id);
        if (area) {
          this.openEdit(area);
        }
      });
  }

  ngOnInit(): void { this.service.load(); }
  reload(): void { this.service.load(); }

  openNew(): void {
    this.mapService.isFormActive.set(true); // esconde polígonos imediatamente
    this.selectedId.set(null);
    this.panelOpen.set(true);
  }

  openEdit(area: AreaAgricola): void {
    this.mapService.isFormActive.set(true); // esconde polígonos imediatamente, antes de qualquer transição
    this.panelOpen.set(false); // destrói o formulário atual (ngOnDestroy não altera isFormActive)
    setTimeout(() => {
      this.selectedId.set(area.id ?? null);
      this.panelOpen.set(true);
      if (area.id) {
        this.mapService.flyToArea(area.id, this.listagemAreasMapService.data());
      }
    });
  }

  closePanel(): void {
    this.mapService.isFormActive.set(false); // mostra polígonos ao fechar
    this.panelOpen.set(false);
    this.selectedId.set(null);
  }

  onSaved(): void {
    this.service.load();
    // Fecha o painel somente APÓS os novos dados chegarem do servidor,
    // evitando que o mapa renderize com dados antigos
    this.listagemAreasMapService.request().subscribe({
      next: () => this.closePanel(),
      error: () => this.closePanel() // fecha mesmo em erro
    });
  }

  onSubmit(): void {
    this.formRef().submit();
  }

  onDelete(): void {
    const id = this.selectedId();
    if (!id) return;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Excluir Área Agrícola', message: 'Tem certeza que deseja excluir esta área agrícola? Essa ação não pode ser desfeita.' },
      panelClass: 'dark-dialog'
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.isSaving.set(true);
        this.service.delete(id).subscribe({
          next: () => {
            this.isSaving.set(false);
            this.snackBar.openFromComponent(SuccessSnackbarComponent, {
              data: 'Excluído com sucesso!',
              duration: 3000,
              horizontalPosition: 'end',
              verticalPosition: 'top',
              panelClass: ['custom-error-snackbar']
            });
            this.onSaved();
          },
          error: () => {
            this.isSaving.set(false);
            alert('Ocorreu um erro ao excluir a área.');
          }
        });
      }
    });
  }

  onFilterChanged(filter: AreaAgricolaFilter | null): void {
    this.activeFilter.set(filter);
  }
}
