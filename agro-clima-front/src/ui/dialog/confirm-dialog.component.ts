import { Component, inject } from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

export interface ConfirmDialogData {
  title: string;
  message: string;
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <div class="flex flex-col bg-slate-900 text-white rounded-2xl overflow-hidden"
         style="min-width: 400px; max-width: 480px;">
      <div class="flex items-center justify-between px-6 py-4 border-b border-white/[.06]">
        <h2 class="text-white text-base font-medium">{{ data.title }}</h2>
      </div>
      <div class="px-6 py-5 text-white/70">
        {{ data.message }}
      </div>
      <div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/[.06]">
        <button mat-button (click)="ref.close(false)" class="text-white/40 hover:text-white/60">
          Cancelar
        </button>
        <button mat-flat-button (click)="ref.close(true)" class="!bg-red-500 !text-white !rounded-lg px-6">
          Confirmar
        </button>
      </div>
    </div>
  `
})
export class ConfirmDialogComponent {
  readonly ref = inject(MatDialogRef<ConfirmDialogComponent>);
  readonly data = inject<ConfirmDialogData>(MAT_DIALOG_DATA);
}
