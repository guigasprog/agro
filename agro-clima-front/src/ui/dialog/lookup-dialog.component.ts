import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { debounceTime, distinctUntilChanged, Subject, switchMap, catchError, of } from 'rxjs';
import { LookupConfig } from '../forms_dinamico/dynamic-form.model';

export interface LookupDialogData {
  config: LookupConfig;
  title:  string;
}

@Component({
  selector: 'app-lookup-dialog',
  standalone: true,
  imports: [FormsModule, MatDialogModule, MatButtonModule, MatRippleModule],
  template: `
    <div class="flex flex-col bg-slate-900 rounded-2xl overflow-hidden"
         style="width: 520px; max-height: 80vh;">

      <!-- Header -->
      <div class="flex items-center justify-between px-5 py-4 border-b border-white/[.06] flex-shrink-0">
        <span class="text-white text-sm font-medium">{{ data.title }}</span>
        <button mat-icon-button (click)="ref.close()">
          <span class="material-symbols-outlined text-white/40 text-[20px]">close</span>
        </button>
      </div>

      <!-- Busca -->
      <div class="px-5 py-3 border-b border-white/[.06] flex-shrink-0">
        <div class="flex items-center gap-2 bg-white/5 border border-white/8 rounded-xl px-3 py-2">
          <span class="material-symbols-outlined text-white/30 text-[18px]">search</span>
          <input [(ngModel)]="searchTerm"
                 (ngModelChange)="onSearch($event)"
                 [placeholder]="data.config.placeholder ?? 'Buscar...'"
                 class="flex-1 bg-transparent text-white/70 text-sm outline-none placeholder-white/25" />
          @if (searchTerm) {
            <span class="material-symbols-outlined text-white/30 text-[16px] cursor-pointer"
                  (click)="clear()">close</span>
          }
        </div>
      </div>

      <!-- Resultados -->
      <div class="flex-1 overflow-y-auto">

        @if (loading()) {
          <div class="flex flex-col gap-2 p-4">
            @for (i of [1,2,3]; track i) {
              <div class="h-12 rounded-xl bg-white/5 animate-pulse"></div>
            }
          </div>
        } @else if (results().length === 0) {
          <div class="flex flex-col items-center justify-center gap-2 py-12 text-white/25">
            <span class="material-symbols-outlined text-[32px]">search_off</span>
            <span class="text-sm">Nenhum resultado encontrado</span>
          </div>
        } @else {

          <!-- Header da tabela -->
          <div class="grid gap-3 px-5 py-2 border-b border-white/[.04]"
               [style.gridTemplateColumns]="gridCols">
            @for (col of data.config.columns; track col.key) {
              <span class="text-white/25 text-[10px] uppercase tracking-wider">{{ col.label }}</span>
            }
          </div>

          <!-- Linhas -->
          @for (item of results(); track item[data.config.valueKey]) {
            <div matRipple
                 (click)="select(item)"
                 class="grid gap-3 px-5 py-3 border-b border-white/[.03]
                        hover:bg-white/5 cursor-pointer transition-colors"
                 [style.gridTemplateColumns]="gridCols">
              @for (col of data.config.columns; track col.key) {
                <span class="text-white/70 text-xs truncate">{{ item[col.key] }}</span>
              }
            </div>
          }
        }
      </div>

      <!-- Footer -->
      <div class="px-5 py-3 border-t border-white/[.06] flex-shrink-0 flex justify-between items-center">
        <span class="text-white/25 text-xs">{{ results().length }} resultado(s)</span>
        <button mat-button (click)="ref.close()" class="text-white/40 text-xs">Cancelar</button>
      </div>
    </div>
  `
})
export class LookupDialogComponent implements OnInit {
  readonly data    = inject<LookupDialogData>(MAT_DIALOG_DATA);
  readonly ref     = inject(MatDialogRef);
  readonly results = signal<any[]>([]);
  readonly loading = signal(false);

  searchTerm = '';
  private readonly search$ = new Subject<string>();

  get gridCols(): string {
    return `repeat(${this.data.config.columns.length}, 1fr)`;
  }

  ngOnInit(): void {
    this.search$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => {
        this.loading.set(true);
        return this.data.config.search(term).pipe(catchError(() => of([])));
      })
    ).subscribe(res => {
      this.results.set(res);
      this.loading.set(false);
    });

    this.search$.next(''); // carrega todos ao abrir
  }

  onSearch(term: string): void { this.search$.next(term); }
  select(item: any): void      { this.ref.close(item); }
  clear(): void { this.searchTerm = ''; this.search$.next(''); }
}
