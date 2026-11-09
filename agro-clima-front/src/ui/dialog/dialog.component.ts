import { Component, computed, inject, input, output } from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

export interface GenericDialogData {
  title:       string;
  submitLabel?: string;
  width?:       string;
}

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatProgressSpinnerModule],
  template: `
    <div class="flex flex-col bg-slate-900 text-white rounded-2xl overflow-hidden"
         style="min-width: 480px; max-width: 640px; max-height: 90vh;">

      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-white/[.06] flex-shrink-0">
        <h2 class="text-white text-base font-medium">{{ title() }}</h2>
        <button mat-icon-button (click)="close()">
          <span class="material-symbols-outlined text-white/40 text-[20px]">close</span>
        </button>
      </div>

      <!-- Conteúdo projetado -->
      <div class="flex-1 overflow-y-auto px-6 py-5">
        <ng-content />
      </div>

      <!-- Footer -->
      <!-- Footer -->
      <div class="flex items-center justify-between gap-3 px-6 py-4 border-t border-white/[.06] flex-shrink-0">
        <div>
          @if (showDelete()) {
            <button mat-flat-button (click)="delete.emit()" class="!bg-red-500/10 !text-red-400 hover:!bg-red-500/20 !rounded-lg px-6">
              Deletar
            </button>
          }
        </div>
        <div class="flex items-center gap-3">
          <button mat-button (click)="close()"
                  class="text-white/40 hover:text-white/60">
            Cancelar
          </button>
          <button mat-flat-button
                  [disabled]="saving()"
                  (click)="submit.emit()"
                  class="!bg-sky-500 !text-white !rounded-lg px-6">
            @if (saving()) {
              <mat-spinner diameter="16" class="inline-block mr-2" />
            }
            {{ submitLabel() }}
          </button>
        </div>
      </div>
    </div>
  `
})
export class GenericDialogComponent {
  readonly ref    = inject(MatDialogRef,{ optional: true });
  readonly saving = input<boolean>(false);
  readonly submit = output<void>();
  readonly delete = output<void>();
  readonly showDelete = input<boolean>(false);
  readonly title = input<string>('');
  readonly submitLabel = input<string>('Salvar');

  close(): void { this.ref?.close(); }
}
