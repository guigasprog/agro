import { Component, input, output } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { Solo } from './solo.model';

const ESTADO_BADGE: Record<string, string> = {
  ARGILOSO: 'bg-red-600/20 text-red-400',
  ARENOSO: 'bg-amber-400/20 text-amber-400',
  MEDIO: 'bg-orange-600/20 text-orange-400'
};

const DEFAULT_BADGE = 'bg-white/10 text-white/50';
@Component({
  selector: 'app-solo-card',
  standalone: true,
  imports: [MatRippleModule],
  host: { class: 'block' },
  template: `
    <div matRipple
         (click)="select.emit(solo())"
         class="flex items-center gap-3 rounded-xl px-3 py-2 bg-white/[.06]
                hover:bg-white/[.09] cursor-pointer transition-colors">

      <div class="flex flex-col flex-1 min-w-0">
        <span class="text-white text-sm font-medium truncate">{{ solo().nome }}</span>
        <div class="flex items-center gap-2 mt-1">
          <span class="text-[10px] px-2 py-0.5 rounded-full font-medium flex-shrink-0"
                [class]="badgeClass">
            {{ solo().texturaSolo.charAt(0).toUpperCase() +  solo().texturaSolo.slice(1).toLowerCase()}}
          </span>
        </div>
      </div>

      <span class="material-symbols-outlined text-white/20 text-[20px] flex-shrink-0">chevron_right</span>
    </div>
  `
})
export class SoloCardComponent {
  readonly solo   = input.required<Solo>();
  readonly select = output<Solo>();
    get badgeClass(): string {
    const textura = this.solo().texturaSolo ?? '';
    return ESTADO_BADGE[textura] ?? DEFAULT_BADGE;
  }

}
