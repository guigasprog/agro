import { Component, input, OnDestroy, AfterViewInit, ElementRef, viewChild, effect } from '@angular/core';
import { DadosGrafico } from '../janela-operacional-resultado.model';

declare const Chart: any;

@Component({
  selector: 'app-resultado-chart',
  standalone: true,
  host: { class: 'block flex-1 p-2' },
  template: `
    <canvas #canvas
            role="img"
            aria-label="Gráfico de temperatura e umidade por hora do dia">
      Temperatura e umidade ao longo de 24 horas.
    </canvas>
  `
})
export class ResultadoChartComponent implements AfterViewInit, OnDestroy {
  readonly dados  = input.required<DadosGrafico>();
  readonly canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');

  private chart: any = null;

  constructor() {
    effect(() => {
      const d = this.dados();
      if (this.chart) this.updateChart(d);
    });
  }

  ngAfterViewInit(): void {
    this.loadChartJs().then(() => this.buildChart());
  }

  ngOnDestroy(): void { this.chart?.destroy(); }

  private loadChartJs(): Promise<void> {
    return new Promise(resolve => {
      if ((window as any).Chart) { resolve(); return; }
      const s = document.createElement('script');
      s.src   = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js';
      s.onload = () => resolve();
      document.head.appendChild(s);
    });
  }

  private buildChart(): void {
    const d   = this.dados();
    const ctx = this.canvas().nativeElement;

    this.chart = new (window as any).Chart(ctx, {
      type: 'line',
      data: {
        labels: d.horas,
        datasets: [
          {
            label: 'Temp °C', data: d.temperatura,
            borderColor: '#fb923c', borderWidth: 2,
            pointRadius: 0, tension: 0.4, fill: false,
          },
          {
            label: 'Umidade %', data: d.umidade,
            borderColor: '#38bdf8', borderWidth: 2,
            pointRadius: 0, tension: 0.4, fill: false,
            borderDash: [5, 4],
          },
        ],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            mode: 'index', intersect: false,
            callbacks: {
              label: (ctx: any) =>
                ctx.dataset.label + ': ' +
                Math.round(ctx.parsed.y) +
                (ctx.datasetIndex === 0 ? '°C' : '%'),
            },
          },
        },
        scales: {
          x: {
            ticks: { color: 'rgba(255,255,255,0.3)', font: { size: 10 },
                     maxRotation: 0, autoSkip: true, maxTicksLimit: 12 },
            grid: { color: 'rgba(255,255,255,0.04)' },
          },
          y: {
            min: 0, max: 100,
            ticks: { color: 'rgba(255,255,255,0.3)', font: { size: 10 } },
            grid: { color: 'rgba(255,255,255,0.04)' },
          },
        },
      },
    });
  }

  private updateChart(d: DadosGrafico): void {
    if (!this.chart) return;
    this.chart.data.labels                    = d.horas;
    this.chart.data.datasets[0].data          = d.temperatura;
    this.chart.data.datasets[1].data          = d.umidade;
    this.chart.update();
  }
}
