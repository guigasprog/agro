import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoginService } from './login-service';

export const loginInterceptor: HttpInterceptorFn = (req, next) => {
  const service = inject(LoginService);
  const token = service.getToken();

  // Se existe um token, clonamos a requisição original adicionando o cabeçalho
  if (token) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedRequest);
  }

  // Se não houver token (ex: na própria requisição de login), segue normalmente
  return next(req);
};
