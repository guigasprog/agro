import { Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { Equipment, EquipmentType } from './equipment.model';

const TYPE_CONFIG: Record<EquipmentType, { icon: string; label: string }> = {
  TRATOR:     { icon: 'agriculture',  label: 'Trator'     },
  DRONE:      { icon: 'drone',  label: 'Drone'      }, // 'drone' não existe no Material Icons
  IMPLEMENTO: { icon: 'construction', label: 'Implemento' },
};

const ICON_BG: Record<EquipmentType, string> = {
  TRATOR:     'bg-green-600/20',
  DRONE:      'bg-blue-600/20',
  IMPLEMENTO: 'bg-amber-400/20',
};


@Component({
  selector: 'app-equipment-card',
  standalone: true,
  imports: [MatIconModule, MatRippleModule],
  host: { class: 'block' },
  template: `
  <div matRipple
       (click)="select.emit(equipment())"
       class="flex items-center gap-3 rounded-xl px-3 py-2 bg-white/[.06]
              hover:bg-white/[.09] cursor-pointer transition-colors">

    <div class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
         [class]="iconBg">
      <span class="material-symbols-outlined text-white text-[20px]">{{ config.icon }}</span>
    </div>

    <div class="flex flex-col flex-1 min-w-0">
      <span class="text-white text-sm font-medium truncate">{{ equipment().nome }}</span>
      <div class="flex items-center gap-2 mt-0.5">
        <span class="text-white/40 text-xs">{{ equipment().nomeFabricante }}</span>
      </div>
    </div>

    <span class="material-symbols-outlined text-white/20 text-[20px]">chevron_right</span>
  </div>
`
})
export class EquipmentCardComponent {
  readonly equipment = input.required<Equipment>();
  readonly select    = output<Equipment>();

  get config()     { return TYPE_CONFIG[this.equipment().tipoEquipamento]; }
  get iconBg()     { return ICON_BG[this.equipment().tipoEquipamento]; }
}
