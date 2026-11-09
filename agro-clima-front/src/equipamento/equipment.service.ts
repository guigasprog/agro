import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable, delay, of } from 'rxjs';
import { Equipment, EquipmentType } from './equipment.model';
import { AbstractCrudService } from '../app/abstract-crud.service';
import { environment } from '../app/environment';

@Injectable({
  providedIn: 'root'
})
export class EquipmentService extends AbstractCrudService<Equipment> {

  // A ÚNICA coisa que sobrescrevemos é a URL base, usando o override.
  // Note que não declaramos 'http' nem 'entities' aqui!
  protected override apiUrl = `${environment.apiUrl}/equipamento`;

  // GET /equipamento/tipos?tipoList=TRATOR,DRONE
  findByTipoEquipamento(tipoEquipamentoList: EquipmentType[]): Observable<Equipment[]> {
    // Usamos o this.http normalmente, pois ele foi herdado do AbstractCrudService
    const params = new HttpParams().set('tipoList', tipoEquipamentoList.join(','));
    return this.http.get<Equipment[]>(`${this.apiUrl}/tipos`, { params });
  }

  // MOCK de Solos mantido temporariamente
  searchSolos(term: string) {
    const solos = [
      { id: '1', nome: 'Latossolo Vermelho',      textura: 'Argilosa'},
      { id: '2', nome: 'Latossolo Amarelo',       textura: 'Média' },
      { id: '3', nome: 'Argissolo Vermelho-Amarelo', textura: 'Argilosa' },
      { id: '4', nome: 'Neossolo Quartzarênico',  textura: 'Arenosa'},
      { id: '5', nome: 'Cambissolo Háplico',      textura: 'Média' },
    ];
    return of(solos.filter(s =>
      !term || s.nome.toLowerCase().includes(term.toLowerCase())
    )).pipe(delay(400));
  }
}
