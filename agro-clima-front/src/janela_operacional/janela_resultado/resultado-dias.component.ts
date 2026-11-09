import { Component, input, output } from '@angular/core';
import { DiaPrevisao, StatusDia } from '../janela-operacional-resultado.model';

@Component({
  selector: 'app-resultado-dias',
  standalone: true,
  host: { class: 'block border-t border-white/[.06] px-3 py-2.5' },
  template: `
    <div class="grid grid-cols-7 gap-1.5">
      @for (dia of dias(); track dia.data) {
        <div (click)="diaSelected.emit(dia)"
             class="flex flex-col gap-1 rounded-xl p-2 cursor-pointer border transition-colors"
             [class]="dia.data === diaSelecionado()
               ? 'border-sky-400/40 bg-sky-400/7'
               : 'border-white/[.07] bg-white/5 hover:bg-white/8'">

          <div class="text-[10px]" [class]="dia.data === diaSelecionado() ? 'text-sky-400/70' : 'text-white/35'">
            {{ dia.diaSemana }}
          </div>

          <span class="material-symbols-outlined text-[16px]"
                [class]="iconeColor(dia.icone)">{{ dia.icone }}</span>

          <div class="text-[11px] font-medium"
               [class]="dia.data === diaSelecionado() ? 'text-sky-300' : 'text-white'">
            {{ dia.data }}
          </div>

          @if (dia.status) {
            <span class="text-[9px] px-1.5 py-0.5 rounded-full font-medium self-start"
                  [class]="tagClass(dia.status)">
              {{ tagLabel(dia.status) }}
            </span>
          }
        </div>
      }
    </div>
  `
})
export class ResultadoDiasComponent {
  readonly dias           = input.required<DiaPrevisao[]>();
  readonly diaSelecionado = input.required<string>();
  readonly diaSelected    = output<DiaPrevisao>();

  iconeColor(icone: string): string {
    return {
      sunny:              'text-amber-400',
      partly_cloudy_day:  'text-amber-400',
      rainy:              'text-white/40',
      thunderstorm:       'text-red-400',
    }[icone] ?? 'text-white/40';
  }

  tagClass(status: StatusDia): string {
    return {
      ok:    'bg-green-400/15 text-green-400',
      alerta: 'bg-amber-400/15 text-amber-400',
      ruim:  'bg-red-400/15 text-red-400',
    }[status];
  }

  tagLabel(status: StatusDia): string {
    return { ok: 'Ideal', alerta: 'Alerta', ruim: 'Ruim' }[status];
  }
}
