import { Component, output } from '@angular/core';
import { FilterDropdownComponent } from '../ui/filtro/filter-dropdown.component';
import { FilterField, FilterState } from '../ui/filtro/filter.model';

export interface AreaAgricolaFilter {
  nome:        string;
  cidade:      string;
  estado:      string;
 // hectares:    number;
}

const AREA_AGRICOLA_FIELDS: FilterField[] = [

  {
    key:   'nome',
    label: 'Nome',
    type:  'text',
  },
  {
    key:   'cidade',
    label: 'Cidade',
    type:  'text',
  },
  {
    key:   'estado',
    label: 'Estado',
    type:  'text',
  }/*,
  {
    key:   'hectares',
    label: 'Hectares',
    type:  'decimal',
  },*/
];

@Component({
  selector: 'app-area-agricola-filter',
  standalone: true,
  imports: [FilterDropdownComponent],
  template: `
    <app-filter-dropdown
      [fields]="fields"
      (applied)="onApply($event)"
      (cleared)="filterChanged.emit(null)" />
  `
})
export class AreaAgricolaFilterComponent {
  readonly filterChanged = output<AreaAgricolaFilter | null>();
  readonly fields = AREA_AGRICOLA_FIELDS;

  onApply(state: FilterState): void {
    this.filterChanged.emit({
      nome:       (state['nome'] as string) ?? '',
      cidade:     (state['cidade'] as string) ?? '',
      estado:     (state['estado'] as string) ?? ''

    });
  }
}
