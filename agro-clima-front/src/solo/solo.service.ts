import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Solo } from './solo.model';
import { environment } from '../app/environment';

@Injectable()
export class SoloService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/solo`;

  readonly soloList = signal<Solo[]>([]);
  readonly isLoading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  load(): void {
    this.isLoading.set(true);

    this.http.get<Solo[]>(this.baseUrl).subscribe({
      next: (data) => {
        this.soloList.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.isLoading.set(false);
      }
    });
  }

  findById(id: string) {
    return this.http.get<Solo>(`${this.baseUrl}/${id}`);
  }

  save(solo: Solo) {
    return solo.id
      ? this.http.put(this.baseUrl, solo)
      : this.http.post(this.baseUrl, solo);
  }

  delete(id: string) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
