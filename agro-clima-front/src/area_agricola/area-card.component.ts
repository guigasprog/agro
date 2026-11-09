import { Component, input, output } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { AreaAgricola } from './area-agricola.model';
import { DecimalPipe } from '@angular/common';


@Component({
  selector: 'app-area-card',
  standalone: true,
  imports: [MatRippleModule, DecimalPipe],
  host: { class: 'block' },
  template: `
    <div matRipple
         (click)="select.emit(area())"
         class="flex items-center gap-3 rounded-xl px-3 py-2 bg-white/[.06]
                hover:bg-white/[.09] cursor-pointer transition-colors">

      <div class="flex flex-col flex-1 min-w-0">
        <span class="text-white text-sm font-medium truncate">{{ area().nome }}</span>
        <div class="flex items-center gap-2 mt-1">
          @if (area().cidade) {
            <span class="text-white/35 text-xs truncate">{{ area().cidade }}</span>
            <span class="text-white/15 text-xs flex-shrink-0">·</span>
          }
          @if (area().estado) {
            <span class="text-white/35 text-xs truncate">{{ area().estado }}</span>
            <span class="text-white/15 text-xs flex-shrink-0">·</span>
          }
          <span class="text-white/35 text-xs flex-shrink-0">{{ area().hectares | number:'1.0-0' }} ha</span>
        </div>
      </div>

      <span class="material-symbols-outlined text-white/20 text-[20px] flex-shrink-0">chevron_right</span>
    </div>
  `
})
export class AreaCardComponent {
  readonly area   = input.required<AreaAgricola>();
  readonly select = output<AreaAgricola>();

}
