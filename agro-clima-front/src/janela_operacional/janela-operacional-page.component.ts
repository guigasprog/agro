import { Component, OnDestroy, inject, signal, viewChild } from '@angular/core';
import { JanelaOperacionalResultadoComponent } from './janela-operacional-resultado.component';
import { JanelaOperacional } from './janela-operacional.model';
import { JanelaOperacionalDialogComponent } from './janela_operacional-form.component';
import { JanelaOperacionalService } from './janela_operacional.service';
import { MapStateService } from '../app/map-state.service';

@Component({
  selector: 'app-janela-operacional-page',
  standalone: true,
  providers:[JanelaOperacionalService],
  imports: [JanelaOperacionalDialogComponent, JanelaOperacionalResultadoComponent],
  host: {
    class: 'flex flex-row gap-2 h-full flex-1 overflow-hidden'
  },
  template: `
    <!-- Formulário sempre visível -->
    <app-janela-opracional-form
      (estimado)="onEstimado($event)" />

    <!-- Resultado aparece após estimar -->
    @if (mostrarResultado()) {
      <app-janela-operacional-resultado
        [payload]="payloadAtual()" />
    } @else {
      <div class="flex-1 flex flex-col items-center justify-center gap-3 text-white/20">
        <span class="material-symbols-outlined text-[48px]">bar_chart</span>
        <span class="text-sm">Preencha o formulário e clique em Estimar</span>
      </div>
    }
  `
})
export class JanelaOperacionalPageComponent implements OnDestroy {
  private readonly mapState = inject(MapStateService);

  readonly mostrarResultado = signal(false);
  readonly payloadAtual     = signal<JanelaOperacional | null>(null);

  constructor() {
    this.mapState.hideMap();
  }

  onEstimado(payload: JanelaOperacional): void {
    this.payloadAtual.set(payload);
    this.mostrarResultado.set(true);
  }

  ngOnDestroy(): void {
    this.mapState.displayMap();
  }
}
