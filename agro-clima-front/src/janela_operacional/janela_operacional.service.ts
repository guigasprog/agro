import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, of } from 'rxjs';
import { JanelaOperacional } from './janela-operacional.model';
import { AnaliseJanelaOperacionalDTO } from './janela-operacional-resultado.model';
import { environment } from '../app/environment';
import { Observable } from 'rxjs';


@Injectable()
export class JanelaOperacionalService {
  private readonly _http = inject(HttpClient);

  readonly isLoading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  save(janelaOperacional: JanelaOperacional) {
    console.log('saving:', janelaOperacional);
    return of(janelaOperacional).pipe(delay(500));
  }

  getResultado(estimativa: JanelaOperacional): Observable<AnaliseJanelaOperacionalDTO[]> {
    return this._http.post<AnaliseJanelaOperacionalDTO[]>(`${environment.apiUrl}/janela-operacional`, estimativa);
  }
}
