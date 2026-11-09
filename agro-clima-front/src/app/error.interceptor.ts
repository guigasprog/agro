import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, throwError } from 'rxjs';
import { ErrorSnackbarComponent } from '../ui/snackbar/error-snackbar.component';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBar = inject(MatSnackBar);

  // Não intercepta erros de login/cadastro — esses são tratados pelo próprio componente
  if (req.url.includes('/auth/login') || req.url.includes('/usuarios')) {
    return next(req);
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let msg = 'Erro inesperado no servidor.';

      // Tenta ler o formato padrão do Spring (detail) ou o seu antigo (message)
      if (error.error && typeof error.error === 'object') {
        msg = error.error.detail || error.error.message || msg;
      } else if (error.status === 0) {
        msg = 'Erro de conexão: Servidor offline.';
      }

      // Abre o pop-up customizado
      snackBar.openFromComponent(ErrorSnackbarComponent, {
        data: msg,
        duration: 5000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: ['custom-error-snackbar'] // Classe no styles.css para remover o padding padrão
      });

      return throwError(() => error);
    })
  );
};
