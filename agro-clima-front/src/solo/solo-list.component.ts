import { Component, inject, OnInit, computed, signal } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { Solo } from './solo.model';
import { ListShellComponent } from '../ui/listagemItens/list-shell.component';

import { SoloFilter, SoloFilterComponent } from './solo-filter.component';
import { SoloCardComponent } from "./solo-card.component";
import { SoloService } from './solo.service';
import { SoloDialogComponent } from './solo-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-solo-list',
  standalone: true,
  providers:[SoloService],

  imports: [
    MatIconButton,
    MatRippleModule,
    ListShellComponent,
    SoloFilterComponent,
    SoloCardComponent
],
  host: {
    class: 'contents'
  },
  template: `
    <app-list-shell class="order-1"
      title="Solo"
      [isLoading]="isLoading()"
      [error]="error()"
      [count]="count()">

      <app-solo-filter listActions (filterChanged)="onFilterChanged($event)" />

      <button listActions matIconButton (click)="openNew()">
        <span class="material-symbols-outlined text-white/50 text-[20px]">add_circle_outline</span>
      </button>

      <button listError matIconButton (click)="reload()">
        <span class="material-symbols-outlined text-white/50 text-[20px]">refresh</span>
      </button>

      @for (so of filteredSoloList(); track so.id) {
        <app-solo-card listItems [solo]="so" (select)="onSelect($event)" />
      }

      <div listFooter matRipple (click)="openNew()"
           class="flex items-center gap-3 rounded-xl px-3 py-2 border border-dashed
                  border-white/10 hover:bg-white/5 cursor-pointer transition-colors">
        <div class="w-10 h-10 rounded-xl bg-white/[.04] flex items-center justify-center flex-shrink-0">
          <span class="material-symbols-outlined text-white/20 text-[20px]">add</span>
        </div>
        <span class="text-white/35 text-sm flex-1">Novo Solo</span>
        <span class="material-symbols-outlined text-white/20 text-[20px]">chevron_right</span>
      </div>

    </app-list-shell>
  `
})
export class SoloListComponent implements OnInit {
  private readonly soloService = inject(SoloService);

  readonly soloList = this.soloService.soloList.asReadonly();
  readonly isLoading  = this.soloService.isLoading.asReadonly();
  readonly error      = this.soloService.error.asReadonly();
  readonly activeFilter = signal<SoloFilter | null>(null);
  private readonly dialog = inject(MatDialog);


  readonly filteredSoloList = computed(() => {
    const f = this.activeFilter();
    const all = this.soloList();
    if (!f) return all;
    return all.filter(so => {
        const nomeMatch  = !f.nome       || so.nome.toLowerCase().includes(f.nome.toLowerCase());
        const tipoMatch  = f.texturaSolo.length === 0 || f.texturaSolo.includes(so.texturaSolo);
        return    nomeMatch && tipoMatch ;
    });
  });
  readonly count = computed(() => {
    const n = this.soloList().length;
    return `${n} Solo${n !== 1 ? 's' : ''}`;
  });

  onFilterChanged(filter: SoloFilter | null): void {
  this.activeFilter.set(filter);
  }
  ngOnInit(): void { this.soloService.load(); }
  reload(): void   { this.soloService.load(); }
  onSelect(so: Solo): void {
    this.openDialog(so.id);
  }

  openNew(): void {
      this.openDialog();
  }

  private openDialog(id?: string): void {
      const ref = this.dialog.open(SoloDialogComponent, {
        data:            { id },
        panelClass:      'dark-dialog',
        disableClose:    true,
        maxHeight:       '90vh',
      });

      ref.afterClosed().subscribe(saved => {
        if (saved) this.soloService.load();
      });
  }
}
