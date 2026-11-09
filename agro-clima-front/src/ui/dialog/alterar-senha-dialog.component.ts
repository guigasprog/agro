import { Component, inject, signal } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../login/usuario-service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-alterar-senha-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, FormsModule, MatProgressSpinnerModule],
  template: `
    <div class="flex flex-col bg-slate-900 text-white rounded-2xl overflow-hidden"
         style="min-width: 400px; max-width: 500px;">
      
      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-white/[.06]">
        <h2 class="text-white text-base font-medium">Alterar Senha</h2>
        <button mat-icon-button (click)="close()">
          <span class="material-symbols-outlined text-white/40 text-[20px]">close</span>
        </button>
      </div>

      <!-- Body -->
      <div class="flex-1 px-6 py-5 flex flex-col gap-4">
        
        @if (erro()) {
          <div class="bg-red-500/10 text-red-400 text-sm px-4 py-2 rounded-lg">
            {{ erro() }}
          </div>
        }

        <div class="flex flex-col gap-1">
          <label class="text-xs text-white/60">Nova Senha</label>
          <input type="password" [(ngModel)]="novaSenha"
                 class="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-sky-500 transition-colors"
                 placeholder="Digite a nova senha" />
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-xs text-white/60">Confirmar Nova Senha</label>
          <input type="password" [(ngModel)]="confirmarSenha"
                 class="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-sky-500 transition-colors"
                 placeholder="Repita a nova senha" />
        </div>

      </div>

      <!-- Footer -->
      <div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/[.06]">
        <button mat-button (click)="close()" class="text-white/40 hover:text-white/60">
          Cancelar
        </button>
        <button mat-flat-button
                [disabled]="saving() || !novaSenha || !confirmarSenha"
                (click)="salvar()"
                class="!bg-sky-500 !text-white !rounded-lg px-6 disabled:!bg-sky-500/50 disabled:!text-white/50">
          @if (saving()) {
            <mat-spinner diameter="16" class="inline-block mr-2" />
          }
          Salvar
        </button>
      </div>
    </div>
  `
})
export class AlterarSenhaDialogComponent {
  private readonly ref = inject(MatDialogRef);
  private readonly usuarioService = inject(UsuarioService);

  novaSenha = '';
  confirmarSenha = '';

  erro = signal<string | null>(null);
  saving = signal(false);

  close() {
    this.ref.close();
  }

  salvar() {
    this.erro.set(null);

    if (this.novaSenha !== this.confirmarSenha) {
      this.erro.set('A nova senha e a confirmação não conferem.');
      return;
    }

    if (this.novaSenha.length < 6) {
      this.erro.set('A nova senha deve ter pelo menos 6 caracteres.');
      return;
    }

    this.saving.set(true);
    this.usuarioService.alterarSenha(this.novaSenha).subscribe({
      next: () => {
        this.saving.set(false);
        this.ref.close(true); // Retorna true para indicar sucesso
      },
      error: (err) => {
        this.saving.set(false);
        this.erro.set('Erro ao alterar senha. Verifique sua conexão e tente novamente.');
      }
    });
  }
}
