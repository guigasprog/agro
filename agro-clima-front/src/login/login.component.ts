import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { LoginService } from './login-service';
import { UsuarioService } from './usuario-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SuccessSnackbarComponent } from '../ui/snackbar/success-snackbar.component';

type Modo = 'login' | 'cadastro';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, MatInputModule, MatFormFieldModule, MatButtonModule],
  host: {
    class: 'flex h-full w-full items-center justify-center bg-slate-950'
  },
  template: `
    <div class="flex flex-col w-full max-w-sm gap-6">

      <!-- Logo / título -->
      <div class="flex flex-col items-center gap-2">
        <div class="w-12 h-12 rounded-2xl bg-sky-500/20 flex items-center justify-center">
          <span class="material-symbols-outlined text-sky-400 text-[28px]">agri</span>
        </div>
        <h1 class="text-white text-xl font-medium">AgroClima</h1>
        <p class="text-white/35 text-sm">
          {{ modo() === 'login' ? 'Acesse sua conta' : 'Crie sua conta' }}
        </p>
      </div>

      <!-- Card -->
      <div class="bg-slate-900 rounded-2xl p-6 flex flex-col gap-4 border border-white/[.06]">

        <!-- Erro -->
        @if (erro()) {
          <div class="bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">
            <span class="text-red-400 text-sm">{{ erro() }}</span>
          </div>
        }

        <!-- Nome — só no cadastro -->
        @if (modo() === 'cadastro') {
          <mat-form-field appearance="outline" class="w-full"
                          [class.field-error]="isError('nome')">
            <mat-label>Nome completo</mat-label>
            <input matInput [formControl]="$any(form.get('nome'))" />
          </mat-form-field>
        }

        <!-- Email -->
        <mat-form-field appearance="outline" class="w-full"
                        [class.field-error]="isError('email')">
          <mat-label>E-mail</mat-label>
          <input matInput type="email" [formControl]="$any(form.get('email'))" />
        </mat-form-field>

        <!-- Senha -->
        <mat-form-field appearance="outline" class="w-full"
                        [class.field-error]="isError('senha')">
          <mat-label>Senha</mat-label>
          <input matInput [type]="senhaVisivel() ? 'text' : 'password'"
                 [formControl]="$any(form.get('senha'))" />
          <button mat-icon-button matSuffix type="button"
                  (click)="senhaVisivel.set(!senhaVisivel())">
            <span class="material-symbols-outlined text-white/40 text-[18px]">
              {{ senhaVisivel() ? 'visibility_off' : 'visibility' }}
            </span>
          </button>
        </mat-form-field>

        <!-- Botão principal -->
        <button mat-flat-button
                [disabled]="loading()"
                (click)="submit()"
                class="!bg-sky-500 !text-white !rounded-xl !py-2 !text-sm w-full">
          @if (loading()) {
            <span class="material-symbols-outlined text-[16px] animate-spin mr-1">
              progress_activity
            </span>
          }
          {{ modo() === 'login' ? 'Entrar' : 'Criar conta' }}
        </button>

      </div>

      <!-- Alternar modo -->
      <div class="flex items-center justify-center gap-1.5">
        <span class="text-white/35 text-sm">
          {{ modo() === 'login' ? 'Não tem uma conta?' : 'Já tem uma conta?' }}
        </span>
        <button (click)="alternarModo()"
                class="text-sky-400 text-sm hover:text-sky-300 transition-colors">
          {{ modo() === 'login' ? 'Criar conta' : 'Fazer login' }}
        </button>
      </div>

    </div>
  `
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly loginService = inject(LoginService);
  private readonly usuarioService = inject(UsuarioService);
  private readonly router: Router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  readonly modo = signal<Modo>('login');
  readonly loading = signal(false);
  readonly erro = signal<string | null>(null);
  readonly senhaVisivel = signal(false);

  form = this.buildForm('login');

  alternarModo(): void {
    const novo = this.modo() === 'login' ? 'cadastro' : 'login';
    this.modo.set(novo);
    this.erro.set(null);
    this.form = this.buildForm(novo); // Isso resolve as validações automaticamente
  }

  submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.loading.set(true);
    this.erro.set(null);

    // Como usamos nonNullable no form, o TS sabe que são strings
    const { email, senha, nome } = this.form.getRawValue();

    if (this.modo() === 'login') {
      const payloadLogin = { username: email, senha: senha };

      this.loginService.login(payloadLogin).subscribe({
        next: () => { this.loading.set(false); this.router.navigate(['/equipamentos']); },
        error: (e: HttpErrorResponse) => { this.loading.set(false); this.erro.set((e.error as Record<string, string>)?.['message'] ?? 'E-mail ou senha incorretos'); },
      });
    } else {
      const payloadCadastro = { nome: nome, email: email, senha: senha };

      // Se o TypeScript ainda reclamar aqui, é porque a interface 'Usuario' no Angular
      // está diferente do payload acima. O uso do 'as any' resolve temporariamente,
      // mas o ideal é garantir que a interface Usuario reflita o objeto acima.
      this.usuarioService.cadastrar(payloadCadastro).subscribe({
        next: () => {
          this.loading.set(false);
          this.snackBar.openFromComponent(SuccessSnackbarComponent, {
            data: 'Conta criada com sucesso!',
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
            panelClass: ['custom-error-snackbar']
          });
          this.alternarModo();
        }, // alternarModo já recria o form
        error: (e: HttpErrorResponse) => { this.loading.set(false); this.erro.set((e.error as Record<string, string>)?.['message'] ?? 'Erro ao criar conta'); },
      });
    }
  }

  isError(key: string): boolean {
    const ctrl = this.form.get(key);
    return !!(ctrl?.invalid && ctrl?.touched);
  }

  private buildForm(modo: Modo) {
    // Usamos nonNullable para garantir que os valores nunca sejam null, apenas string
    const form = this.fb.nonNullable.group({
      nome: [''], // Declaramos sempre para manter a tipagem consistente
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(10)]],
    });

    // Aplicamos a validação do nome apenas no modo cadastro
    if (modo === 'cadastro') {
      form.controls.nome.setValidators([Validators.required]);
    }

    return form;
  }
}
