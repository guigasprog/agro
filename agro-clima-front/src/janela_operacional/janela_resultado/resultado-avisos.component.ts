import { Component, input } from '@angular/core';
import { AvisoPorHora, SeveridadeAviso } from '../janela-operacional-resultado.model';

@Component({
  selector: 'app-resultado-avisos',
  standalone: true,
  host: { class: 'flex flex-col w-94 flex-shrink-0 border-l border-white/[.06]' },
  template: `
    <!-- Header -->
    <div class="flex items-center justify-between px-4 py-2.5 border-b border-white/[.06] flex-shrink-0">
      <span class="text-[11px] text-white/50 font-medium">Avisos — {{ diaSelecionado() }}</span>
      <div class="flex gap-3">
        @if (totalCriticos() > 0) {
          <div class="flex items-center gap-1">
            <div class="w-1.5 h-1.5 rounded-full bg-red-400"></div>
            <span class="text-[10px] text-white/30">{{ totalCriticos() }} crítico{{ totalCriticos() > 1 ? 's' : '' }}</span>
          </div>
        }
        @if (totalAlertas() > 0) {
          <div class="flex items-center gap-1">
            <div class="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
            <span class="text-[10px] text-white/30">{{ totalAlertas() }} alerta{{ totalAlertas() > 1 ? 's' : '' }}</span>
          </div>
        }
      </div>
    </div>

    <!-- Timeline -->
    <div class="flex-1 overflow-y-auto px-4 py-3 flex flex-col">
      @for (bloco of avisos(); track bloco.hora; let last = $last) {
        <div class="flex gap-2.5 items-start">

          <!-- fio + ponto -->
          <div class="flex flex-col items-center flex-shrink-0">
            <div class="w-2 h-2 rounded-full mt-0.5 flex-shrink-0"
                 [class]="dotClass(bloco.severidade)"></div>
            @if (!last) {
              <div class="w-px flex-1 min-h-[2rem]"
                   style="background: rgba(255,255,255,0.06)"></div>
            }
          </div>

          <!-- conteúdo -->
          <div class="pb-3 flex-1 min-w-0">
            <div class="text-[10px] text-white/30 mb-1.5">
              {{ bloco.hora }}{{ bloco.horaFim ? ' — ' + bloco.horaFim : '' }}
            </div>

            @if (bloco.avisos.length === 1 && bloco.severidade === 'ok') {
              <div class="text-xs text-white/60">{{ bloco.avisos[0].titulo }}</div>
            } @else {
              <div class="flex flex-col gap-1.5">
                @for (aviso of bloco.avisos; track aviso.titulo) {
                  <div class="rounded-lg px-2.5 py-1.5"
                       [class]="cardClass(aviso.severidade)">
                    <div class="text-[11px] font-medium" [class]="textClass(aviso.severidade)">
                      {{ aviso.titulo }}
                    </div>
                    @if(aviso.descricao) {
                      <div class="text-[10px] text-white/30 mt-0.5">
                        {{ aviso.descricao }}
                      </div>
                    }
                  </div>
                }
              </div>
            }
          </div>
        </div>
      }

      @if (avisos().length === 0) {
        <div class="flex flex-col items-center justify-center gap-2 py-8 text-white/20">
          <span class="material-symbols-outlined text-[28px]">check_circle</span>
          <span class="text-xs">Sem avisos para este dia</span>
        </div>
      }
    </div>
  `
})
export class ResultadoAvisosComponent {
  readonly avisos         = input.required<AvisoPorHora[]>();
  readonly diaSelecionado = input.required<string>();

  get totalCriticos(): () => number {
    return () => this.avisos()
      .flatMap(b => b.avisos)
      .filter(a => a.severidade === 'critico').length;
  }

  get totalAlertas(): () => number {
    return () => this.avisos()
      .flatMap(b => b.avisos)
      .filter(a => a.severidade === 'alerta').length;
  }

  dotClass(s: SeveridadeAviso): string {
    return { critico: 'bg-red-400', alerta: 'bg-amber-400', ok: 'bg-green-400' }[s];
  }

  cardClass(s: SeveridadeAviso): string {
    return {
      critico: 'bg-red-400/8 border border-red-400/20',
      alerta:  'bg-amber-400/8 border border-amber-400/20',
      ok:      'bg-green-400/8 border border-green-400/20',
    }[s];
  }

  textClass(s: SeveridadeAviso): string {
    return { critico: 'text-red-400', alerta: 'text-amber-400', ok: 'text-green-400' }[s];
  }
}
