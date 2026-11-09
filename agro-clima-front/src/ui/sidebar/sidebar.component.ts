import { routesRegistry } from '../../app/app.routes';
import { Component, computed, HostListener, inject, signal } from "@angular/core";
import { SidebarService } from "./sidebar.service";
import { Router } from '@angular/router';
import { UsuarioService } from '../../login/usuario-service';
import { Usuario } from '../../login/usuario.model';
import { LoginService } from '../../login/login-service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AlterarSenhaDialogComponent } from '../dialog/alterar-senha-dialog.component';
import { EditarPerfilDialogComponent } from '../dialog/editar-perfil-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SuccessSnackbarComponent } from '../snackbar/success-snackbar.component';

@Component({
  selector: 'app-sidebar',
  imports: [MatDialogModule],
  template: `
    @for (route of Routes; track $index) {
      <div (click)="navigate(route.path)"
           class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 cursor-pointer"
           [class]="isActive(route.path)
             ? 'bg-sky-400/10'
             : 'hover:bg-white/5'">

        <span class="material-symbols-outlined text-[20px] transition-colors"
              [class]="isActive(route.path) ? 'text-sky-400' : 'text-white/30'">
          {{ route.icon }}
        </span>

        @if (expanded()) {
          <span class="text-sm whitespace-nowrap overflow-hidden transition-colors"
                [class]="isActive(route.path) ? 'text-white font-medium' : 'text-white/30'">
            {{ route.label }}
          </span>
        }
      </div>
    }

    <div class="flex-auto"></div>

    <div class="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 cursor-pointer transition-colors relative"
         (click)="toggleMenu($event)">
      <div class="w-7 h-7 rounded-full bg-sky-400/20 flex items-center justify-center flex-shrink-0">
        <span class="text-sky-400 text-[11px] font-medium">{{ iniciais() }}</span>
      </div>
      @if (expanded() && usuarioLogado()) {
        <div class="flex flex-col leading-tight overflow-hidden">
          <span class="text-white/70 text-xs font-medium whitespace-nowrap" [title]="usuarioLogado()?.nome">{{ usuarioLogado()?.nome }}</span>
          <span class="text-white/30 text-[10px] whitespace-nowrap" [title]="usuarioLogado()?.email">{{ usuarioLogado()?.email }}</span>
        </div>
      }

      @if (menuAberto()) {
        <div class="absolute bottom-full left-0 mb-2 w-full bg-slate-800 rounded-lg shadow-lg border border-white/10 py-1 overflow-hidden z-50">
           <button (click)="editarPerfil($event)" class="w-full text-left px-4 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white transition-colors">
             Editar
           </button>
           <button (click)="abrirAlterarSenha($event)" class="w-full text-left px-4 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white transition-colors">
             Alterar Senha
           </button>
           <button (click)="logout($event)" class="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-400/10 transition-colors">
             Sair
           </button>
        </div>
      }
    </div>
  `,
  host: {
    '[class]': 'computedClasses()'
  }
})
export class SidebarComponent {
  private readonly sidebarService = inject(SidebarService);
  private readonly router         = inject(Router);
  private readonly usuarioService = inject(UsuarioService);
  private readonly loginService   = inject(LoginService);
  private readonly dialog         = inject(MatDialog);
  private readonly snackBar       = inject(MatSnackBar);

  readonly expanded = this.sidebarService.isExpanded.asReadonly();
  readonly Routes   = routesRegistry;

  usuarioLogado = signal<Usuario | null>(null);
  menuAberto = signal(false);
  
  iniciais = computed(() => {
    const nome = this.usuarioLogado()?.nome;
    if (!nome) return '';
    const partes = nome.trim().split(' ');
    if (partes.length === 1) return partes[0].substring(0, 2).toUpperCase();
    return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
  });

  constructor() {
    this.usuarioService.getUsuarioLogado().subscribe({
      next: (usuario) => this.usuarioLogado.set(usuario),
      error: (err) => console.error('Erro ao buscar usuário logado', err)
    });
  }

  readonly computedClasses = computed(() => {
    const isExpanded = this.sidebarService.isExpanded();
    const classes = ['flex flex-col gap-1 h-full py-4 bg-slate-900 duration-300 transition-all rounded-2xl'];
    if (isExpanded) { classes.push('w-[15rem]! px-3'); }
    else            { classes.push('w-[4rem]! items-center!'); }
    return classes.join(' ');
  });

  navigate(path: string): void {
    this.router.navigate([path]);
  }

  isActive(path: string): boolean {
    return this.router.url === `/${path}` || this.router.url.startsWith(`/${path}/`);
  }

  @HostListener('document:click')
  onDocumentClick() {
    this.menuAberto.set(false);
  }

  @HostListener('mouseover')
  public onHover() { this.sidebarService.isExpanded.set(true); }
  
  @HostListener('mouseleave')
  public onLeave() { 
    this.sidebarService.isExpanded.set(false); 
    this.menuAberto.set(false); 
  }

  toggleMenu(event: Event) {
    event.stopPropagation();
    this.menuAberto.update(v => !v);
  }

  editarPerfil(event: Event) {
    event.stopPropagation();
    this.menuAberto.set(false);
    this.dialog.open(EditarPerfilDialogComponent, {
       panelClass: 'bg-transparent',
       data: { usuario: this.usuarioLogado() }
    }).afterClosed().subscribe((usuarioAtualizado) => {
       if (usuarioAtualizado) {
         this.usuarioLogado.set(usuarioAtualizado);
         this.snackBar.openFromComponent(SuccessSnackbarComponent, {
           data: 'Perfil atualizado com sucesso!',
           duration: 3000,
           horizontalPosition: 'end',
           verticalPosition: 'top',
           panelClass: ['custom-error-snackbar']
         });
       }
    });
  }

  abrirAlterarSenha(event: Event) {
    event.stopPropagation();
    this.menuAberto.set(false);
    this.dialog.open(AlterarSenhaDialogComponent, {
       panelClass: 'bg-transparent'
    }).afterClosed().subscribe(sucesso => {
       if (sucesso) {
         this.snackBar.openFromComponent(SuccessSnackbarComponent, {
           data: 'Senha alterada com sucesso!',
           duration: 3000,
           horizontalPosition: 'end',
           verticalPosition: 'top',
           panelClass: ['custom-error-snackbar']
         });
       }
    });
  }

  logout(event: Event) {
    event.stopPropagation();
    this.menuAberto.set(false);
    this.loginService.logout();
  }
}
