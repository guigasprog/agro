import { Component, output } from '@angular/core';
import { FilterDropdownComponent } from '../ui/filtro/filter-dropdown.component';
import { FilterField, FilterState } from '../ui/filtro/filter.model';
import { SoloType } from './solo.model';

export interface SoloFilter {
  nome:        string;
  texturaSolo:       SoloType[];
}

const SOLOS_FIELDS: FilterField[] = [
  {
    key:     'texturaSolo',
    label:   'Tipo',
    type:    'chips',
    options: ['Argiloso', 'Arenoso', 'Medio'],
  },
  {
    key:   'nome',
    label: 'Nome',
    type:  'text',
  },

];

@Component({
  selector: 'app-solo-filter',
  standalone: true,
  imports: [FilterDropdownComponent],
  template: `
    <app-filter-dropdown
      [fields]="fields"
      (applied)="onApply($event)"
      (cleared)="filterChanged.emit(null)" />
  `
})
export class SoloFilterComponent {
  readonly filterChanged = output<SoloFilter | null>();
  readonly fields = SOLOS_FIELDS;

  onApply(state: FilterState): void {
    this.filterChanged.emit({
      nome:       (state['nome'] as string) ?? '',
      texturaSolo:      (state['texturaSolo'] as string[] ?? []).map(t => t.toUpperCase() as SoloType)

    });
  }
}
