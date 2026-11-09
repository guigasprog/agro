import { Component, input } from '@angular/core';
import { MetricasDia } from '../janela-operacional-resultado.model';

@Component({
  selector: 'app-resultado-header',
  standalone: true,
  template: `
    <div class="flex items-center border-b border-white/[.06]">

      <div class="flex items-center divide-x divide-white/[.06]">
        <div class="px-4 py-3">
          <div class="text-[10px] text-white/30 mb-1">Horas livres</div>
          <div class="text-xl font-medium text-white">{{ metricas().horasLivres }}h</div>
        </div>
        <div class="px-4 py-3">
          <div class="text-[10px] text-white/30 mb-1">Temperatura</div>
          <div class="flex items-baseline gap-1">
            <span class="text-xl font-medium text-orange-400">{{ metricas().temperaturaMax }}°C</span>
          </div>
        </div>
        <div class="px-4 py-3">
          <div class="text-[10px] text-white/30 mb-1">Umidade</div>
          <div class="text-xl font-medium text-sky-400">{{ metricas().umidade }}%</div>
        </div>
        <div class="px-4 py-3">
          <div class="text-[10px] text-white/30 mb-1">Vento</div>
          <div class="flex items-baseline gap-1">
            <span class="text-xl font-medium text-white">{{ metricas().vento }}</span>
            <span class="text-[10px] text-white/30">km/h</span>
          </div>
        </div>
        <div class="px-4 py-3">
          <div class="text-[10px] text-white/30 mb-1">Chuva</div>
          <div class="flex items-baseline gap-1">
            <span class="text-xl font-medium text-green-400">{{ metricas().chuva }}</span>
            <span class="text-[10px] text-white/30">mm</span>
          </div>
        </div>
        <div class="px-4 py-3">
          <div class="text-[10px] text-white/30 mb-1">Prob. Chuva</div>
          <div class="flex items-baseline gap-1">
            <span class="text-xl font-medium text-green-400">{{ metricas().probabilidadeChuva }}</span>
            <span class="text-[10px] text-white/30">%</span>
          </div>
        </div>
      </div>

      <div class="flex-1"></div>

      <!-- legenda + ações -->
      <div class="flex items-center gap-4 px-4">
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-1.5">
            <div class="w-4 h-0.5 bg-orange-400"></div>
            <span class="text-[11px] text-white/40">Temp.</span>
          </div>
          <div class="flex items-center gap-1.5">
            <div class="w-4 border-t-2 border-dashed border-sky-400"></div>
            <span class="text-[11px] text-white/40">Umidade</span>
          </div>
        </div>

      </div>

    </div>
  `
})
export class ResultadoHeaderComponent {
  readonly metricas = input.required<MetricasDia>();
}
