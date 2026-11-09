import { Component, inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
  selector: 'app-error-snackbar',
  standalone: true,
  host: {
    class: 'block'
  },
  template: `
    <div class="flex items-center gap-4 bg-slate-900 border border-red-500/30 rounded-2xl p-3 shadow-2xl shadow-black/50 pointer-events-auto w-[360px] max-w-[90vw]">
      <!-- Ícone -->
      <div class="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center flex-shrink-0">
        <span class="material-symbols-outlined text-red-400 text-[24px]">error_outline</span>
      </div>
      
      <!-- Mensagem -->
      <div class="flex flex-col flex-1 min-w-0">
        <span class="text-white text-sm font-medium">Erro detectado</span>
        <span class="text-white/60 text-xs truncate" [title]="data">{{ data }}</span>
      </div>

      <!-- Fechar -->
      <button (click)="snackBarRef.dismiss()" 
              class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors flex-shrink-0 text-white/40 hover:text-white/80">
        <span class="material-symbols-outlined text-[20px]">close</span>
      </button>
    </div>
  `
})
export class ErrorSnackbarComponent {
  readonly data = inject<string>(MAT_SNACK_BAR_DATA);
  readonly snackBarRef = inject(MatSnackBarRef);
}
