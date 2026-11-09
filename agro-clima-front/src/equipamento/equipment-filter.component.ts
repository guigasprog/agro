import { Component, output } from '@angular/core';
import { EquipmentType } from './equipment.model';
import { FilterDropdownComponent } from '../ui/filtro/filter-dropdown.component';
import { FilterField, FilterState } from '../ui/filtro/filter.model';

export interface EquipmentFilter {
  tipos:       EquipmentType[];
  fabricante:  string;
  nome:        string;
}

const EQUIPMENT_FIELDS: FilterField[] = [
  {
    key:     'tipos',
    label:   'Tipo',
    type:    'chips',
    options: ['TRATOR', 'DRONE', 'IMPLEMENTO'],
  },
  {
    key:   'fabricante',
    label: 'Fabricante',
    type:  'text',
  },
  {
    key:   'nome',
    label: 'Nome',
    type:  'text',
  },
];

@Component({
  selector: 'app-equipment-filter',
  standalone: true,
  imports: [FilterDropdownComponent],
  template: `
    <app-filter-dropdown
      [fields]="fields"
      (applied)="onApply($event)"
      (cleared)="filterChanged.emit(null)" />
  `
})
export class EquipmentFilterComponent {
  readonly filterChanged = output<EquipmentFilter | null>();
  readonly fields = EQUIPMENT_FIELDS;

  onApply(state: FilterState): void {
    this.filterChanged.emit({
      tipos:      (state['tipos'] as string[] ?? []).map(t => t.toUpperCase() as EquipmentType),
      fabricante: (state['fabricante'] as string) ?? '',
      nome:       (state['nome'] as string) ?? '',
    });
  }
}
