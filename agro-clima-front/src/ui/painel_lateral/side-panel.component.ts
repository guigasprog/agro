import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-side-panel',
  standalone: true,
  imports: [MatButtonModule, MatProgressSpinnerModule],
  host: {
    class: 'flex flex-col h-full bg-slate-900 rounded-2xl overflow-hidden transition-all duration-300'
  },
  template: `
    <!-- Header -->

    <div class="flex items-center justify-between px-5 py-4 border-b border-white/[.06] flex-shrink-0">
      <span class="text-white text-sm font-medium">{{ title() }}</span>
      @if(cancel()){
        <button mat-icon-button (click)="closed.emit()">
          <span class="material-symbols-outlined text-white/40 text-[20px]">close</span>
        </button>
      }
    </div>



    <!-- Conteúdo scrollável -->
    <div class="flex-1 overflow-y-auto px-5 py-4">
      <ng-content />
    </div>

    <!-- Footer -->
    <div class="flex items-center justify-end gap-3 px-5 py-4 border-t border-white/[.06] flex-shrink-0">
      @if (showDelete()) {
        <button mat-button (click)="deleted.emit()" class="!text-red-400 !text-sm mr-auto hover:!bg-red-400/10">
          Deletar
        </button>
      }
      @if (cancel()) {
        <button mat-button (click)="closed.emit()" class="!text-white/40 !text-sm ">
          Cancelar
        </button>
      }
      <button mat-flat-button
              [disabled]="saving()"
              (click)="submitted.emit()"
              class="!bg-sky-500 !text-white !rounded-xl !px-5 !text-sm">
        @if (saving()) {
          <mat-spinner diameter="14" class="inline-block mr-2" />
        }
        {{ submitLabel() }}
      </button>
    </div>
  `
})
export class SidePanelComponent {
  readonly title       = input.required<string>();
  readonly saving      = input<boolean>(false);
  readonly cancel      = input<boolean>(true);
  readonly submitLabel = input<string>('Salvar');
  readonly showDelete  = input<boolean>(false);
  readonly submitted   = output<void>();
  readonly closed      = output<void>();
  readonly deleted     = output<void>();

}
