import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from './usuario.model';
import { environment } from '../app/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = `${environment.apiUrl}/usuarios`;

  constructor(private http: HttpClient) {}

  // Este método pode ser chamado na tela de "Sign Up" sem estar logado
  cadastrar(usuario: Usuario): Observable<any> {
    return this.http.post(this.apiUrl, usuario);
  }

  // Estes métodos usarão automaticamente o Token JWT graças ao Interceptor que criamos!
  atualizar(id: string, usuario: Usuario): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, usuario);
  }

  excluir(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getUsuarioLogado(): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/me`);
  }

  atualizarLogado(usuario: Partial<Usuario>): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/me`, usuario);
  }

  alterarSenha(novaSenha: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/me/senha`, { novaSenha });
  }
}
