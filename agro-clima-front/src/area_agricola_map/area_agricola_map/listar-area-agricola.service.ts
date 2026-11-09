import { Injectable, inject, signal } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { AreaAgricola, AreaAgricolaProps } from "./models/area-aricola";
import { environment } from "../../app/environment";
import { map, Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ListarAreaAgricolaService {
    private readonly _http = inject(HttpClient);
    private readonly apiUrl = `${environment.apiUrl}/area-agricola`;

    readonly requesting = signal(false);
    readonly data = signal<AreaAgricola[] | undefined>(undefined);

    /** Faz a requisição e retorna Observable<AreaAgricola[]>.
     *  Os sinais `requesting` e `data` são atualizados via tap.
     *  O caller pode encadear .subscribe() para agir após a resposta. */
    public request(): Observable<AreaAgricola[]> {
        this.requesting.set(true);
        return this._http.get<AreaAgricolaProps[]>(this.apiUrl).pipe(
            map(dtoList => dtoList.map(dto => new AreaAgricola(dto))),
            tap({
                next: (areas) => {
                    this.data.set(areas);
                    this.requesting.set(false);
                },
                error: (err) => {
                    console.error('Erro ao carregar áreas agrícolas para o mapa:', err);
                    this.requesting.set(false);
                }
            })
        );
    }

}
