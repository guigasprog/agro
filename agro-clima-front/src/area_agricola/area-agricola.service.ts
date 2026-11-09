import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AreaAgricola, AreaAgricolaReduzida } from './area-agricola.model';
import { delay, Observable, of } from 'rxjs';
import { environment } from '../app/environment';

@Injectable()
export class AreaAgricolaService {
  private readonly _http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/area-agricola`;

  readonly areaAgricolaList = signal<AreaAgricola[]>([]);
  readonly isLoading  = signal<boolean>(false);
  readonly error      = signal<string | null>(null);

  load(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this._http.get<AreaAgricola[]>(this.apiUrl).subscribe({
      next:  (data) => { this.areaAgricolaList.set(data); this.isLoading.set(false); },
      error: (err)  => { this.error.set(err.message); this.isLoading.set(false); }
    });
  }

  findById(id: string): Observable<AreaAgricola> {
    return this._http.get<AreaAgricola>(`${this.apiUrl}/${id}`);
  }

  buscarTodasReduzida(): Observable<AreaAgricolaReduzida[]> {
    return this._http.get<AreaAgricolaReduzida[]>(this.apiUrl);
  }

  save(areaAgricola: AreaAgricola): Observable<any> {
    if (areaAgricola.id) {
      return this._http.put(this.apiUrl, areaAgricola);
    } else {
      return this._http.post(this.apiUrl, areaAgricola);
    }
  }

  searchSolos(term: string): Observable<any[]> {
    return this._http.get<any[]>(`${environment.apiUrl}/solo`);
  }

  findSoloById(id: string): Observable<any> {
    return this._http.get<any>(`${environment.apiUrl}/solo/${id}`);
  }

  delete(id: string): Observable<any> {
    return this._http.delete(`${this.apiUrl}/${id}`);
  }
}
