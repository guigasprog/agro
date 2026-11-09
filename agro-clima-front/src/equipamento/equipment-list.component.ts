import { Component, inject, OnInit, computed, signal } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { EquipmentService } from './equipment.service';
import { Equipment } from './equipment.model';
import { ListShellComponent } from '../ui/listagemItens/list-shell.component';
import { EquipmentCardComponent } from './equipment-card.component';
import { EquipmentFilter, EquipmentFilterComponent } from './equipment-filter.component';
import { MatDialog } from '@angular/material/dialog';
import { EquipmentDialogComponent } from './equipment-dialog.component';

@Component({
  selector: 'app-equipment-list',
  standalone: true,
  imports: [
    MatIconButton,
    MatRippleModule,
    ListShellComponent,
    EquipmentCardComponent,
    EquipmentFilterComponent
],
  host: {
    class: 'contents'
  },
  template: `
    <app-list-shell class="order-1"
      title="Equipamentos"
      [isLoading]="isLoading()"
      
      [count]="count()">

      <app-equipment-filter listActions (filterChanged)="onFilterChanged($event)" />

      <button listActions matIconButton (click)="openNew()">
        <span class="material-symbols-outlined text-white/50 text-[20px]">add_circle_outline</span>
      </button>

      <button listError matIconButton (click)="reload()">
        <span class="material-symbols-outlined text-white/50 text-[20px]">refresh</span>
      </button>

      @for (eq of filteredEquipments(); track eq.id) {
        <app-equipment-card listItems [equipment]="eq" (select)="onSelect($event)" />
      }

      <div listFooter matRipple (click)="openNew()"
           class="flex items-center gap-3 rounded-xl px-3 py-2 border border-dashed
                  border-white/10 hover:bg-white/5 cursor-pointer transition-colors">
        <div class="w-10 h-10 rounded-xl bg-white/[.04] flex items-center justify-center flex-shrink-0">
          <span class="material-symbols-outlined text-white/20 text-[20px]">add</span>
        </div>
        <span class="text-white/35 text-sm flex-1">Novo Equipamento</span>
        <span class="material-symbols-outlined text-white/20 text-[20px]">chevron_right</span>
      </div>

    </app-list-shell>
  `
})
export class EquipmentListComponent implements OnInit {
  private readonly equipmentService = inject(EquipmentService);
  private readonly dialog = inject(MatDialog);

  readonly equipments = this.equipmentService.entities.asReadonly();
  readonly isLoading  = this.equipmentService.isLoading.asReadonly();
  readonly activeFilter = signal<EquipmentFilter | null>(null);

  readonly filteredEquipments = computed(() => {
    const f = this.activeFilter();
    const all = this.equipments();
    if (!f) return all;
    return all.filter((eq: Equipment) => {
        const tipoMatch  = f.tipos.length === 0 || f.tipos.includes(eq.tipoEquipamento);
        const fabMatch   = !f.fabricante || eq.nomeFabricante.toLowerCase().includes(f.fabricante.toLowerCase());
        const nomeMatch  = !f.nome       || eq.nome.toLowerCase().includes(f.nome.toLowerCase());
        return tipoMatch && fabMatch && nomeMatch;
    });
  });
  readonly count = computed(() => {
    const n = this.equipments().length;
    return `${n} Equipamento${n !== 1 ? 's' : ''}`;
  });

  onFilterChanged(filter: EquipmentFilter | null): void {
  this.activeFilter.set(filter);
  }
  ngOnInit(): void { this.equipmentService.load(); }
  reload(): void   { this.equipmentService.load(); }

  onSelect(eq: Equipment): void {
  this.openDialog(eq.id);
  }

  openNew(): void {
    this.openDialog();
  }

  private openDialog(id?: string): void {
    const ref = this.dialog.open(EquipmentDialogComponent, {
      data:            { id },
      panelClass:      'dark-dialog',
      disableClose:    true,
      maxHeight:       '90vh',
    });

    ref.afterClosed().subscribe(saved => {
      if (saved) this.equipmentService.load();
    });
  }
}
