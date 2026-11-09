import { HttpClient } from '@angular/common/http';
import { inject, signal } from '@angular/core';
import { Observable, finalize } from 'rxjs';

// O <T> representa o tipo da sua entidade (Equipment, Solo, etc.)
export abstract class AbstractCrudService<T> {
  protected readonly http = inject(HttpClient);

  // A URL base será fornecida pela classe filha
  protected abstract apiUrl: string;

  // Sinais de Estado genéricos
  readonly entities = signal<T[]>([]);
  readonly isLoading = signal<boolean>(false);

  // Carrega todos os registros
  load(): void {
    this.isLoading.set(true);
    this.http.get<T[]>(this.apiUrl).pipe(
      finalize(() => this.isLoading.set(false))
    ).subscribe({
      next: (data) => this.entities.set(data)
      // Não há bloco de erro! O Interceptor cuida disso e abre o pop-up.
    });
  }

  // Busca por ID
  findById(id: string): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}/${id}`);
  }

  // Salva ou atualiza
  save(entity: T): Observable<void> {
    return this.http.post<void>(this.apiUrl, entity);
  }

  // Deleta
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
