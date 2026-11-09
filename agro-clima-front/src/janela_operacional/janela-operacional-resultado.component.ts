import { Component, inject, OnInit, signal, computed, input, effect } from '@angular/core';
import { ResultadoHeaderComponent } from './janela_resultado/resultado-header.component';
import { ResultadoChartComponent }  from './janela_resultado/resultado-chart.component';
import { ResultadoAvisosComponent } from './janela_resultado/resultado-avisos.component';
import { ResultadoDiasComponent }   from './janela_resultado/resultado-dias.component';
import { JanelaOperacionalService } from './janela_operacional.service';
import { DiaPrevisao, JanelaOperacionalResultado, AnaliseJanelaOperacionalDTO, StatusDia, IconeClima, AvisoPorHora, Aviso, SeveridadeAviso } from './janela-operacional-resultado.model';
import { JanelaOperacional } from './janela-operacional.model';

@Component({
  selector: 'app-janela-operacional-resultado',
  standalone: true,
  imports: [
    ResultadoHeaderComponent,
    ResultadoChartComponent,
    ResultadoAvisosComponent,
    ResultadoDiasComponent,
  ],
  host: {
    class: 'flex flex-col h-full bg-slate-900 w-full rounded-2xl overflow-hidden'
  },
  template: `
    @if (isLoading()) {
      <div class="flex items-center justify-center flex-1">
        <span class="material-symbols-outlined text-white/20 text-[40px] animate-spin">
          progress_activity
        </span>
      </div>
    } @else if (dados()) {

      <app-resultado-header [metricas]="dados()!.metricas" />

      <div class="flex flex-1 overflow-hidden">
        <app-resultado-chart [dados]="dados()!.grafico" />
        <app-resultado-avisos
          [avisos]="avisosDodiaSelecionado()"
          [diaSelecionado]="diaSelecionado()" />
      </div>

      <app-resultado-dias
        [dias]="dados()!.dias"
        [diaSelecionado]="diaSelecionado()"
        (diaSelected)="onDiaSelected($event)" />

    } @else if (error()) {
      <div class="flex flex-col items-center justify-center flex-1 gap-2 text-red-400">
        <span class="material-symbols-outlined text-[32px]">error_outline</span>
        <span class="text-sm">{{ error() }}</span>
        <button (click)="load()" class="text-xs text-white/40 hover:text-white/60 mt-1">
          Tentar novamente
        </button>
      </div>
    }
  `
})
export class JanelaOperacionalResultadoComponent {
  private readonly service = inject(JanelaOperacionalService);

  readonly dados      = signal<JanelaOperacionalResultado | null>(null);
  readonly isLoading  = signal(false);
  readonly error      = signal<string | null>(null);
  readonly diaSelecionado = signal<string>('');
  readonly payload = input<JanelaOperacional | null>(null);

  private analisesList: AnaliseJanelaOperacionalDTO[] = [];

  readonly avisosDodiaSelecionado = computed(() => {
    const d = this.dados();
    if (!d) return [];
    return d.avisosPorHora;
  });

  constructor() {
    effect(() => {
      const p = this.payload();
      if (p) this.load();
    });
  }

  load(): void {
    const p = this.payload();
    if (!p) return;

    this.isLoading.set(true);
    this.error.set(null);
    this.service.getResultado(p).subscribe({
      next: res => {
        this.analisesList = res;
        this.dados.set(this.mapToResultado(res));
        if (this.dados()) {
          this.diaSelecionado.set(this.dados()!.diaSelecionado);
        }
        this.isLoading.set(false);
      },
      error: err => {
        this.error.set(err.message);
        this.isLoading.set(false);
      }
    });
  }

  onDiaSelected(dia: DiaPrevisao): void {
    this.diaSelecionado.set(dia.data);
    this.dados.set(this.mapToResultado(this.analisesList, dia.data));
  }

  private mapToResultado(list: AnaliseJanelaOperacionalDTO[], selectedDate?: string): JanelaOperacionalResultado | null {
    if (!list || list.length === 0) return null;

    const dias: DiaPrevisao[] = list.map((analise, index) => {
      const dateObj = new Date(analise.data + 'T00:00:00');
      const diaSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][dateObj.getDay()];
      const status: StatusDia = analise.qtProblemaCritico > 0 ? 'ruim' : (analise.qtProblemaModerado > 0 ? 'alerta' : 'ok');
      
      let icone: IconeClima = 'sunny';
      if (analise.probabilidadePrecipitacao > 50) icone = 'rainy';
      else if (analise.umidadeMedia > 70) icone = 'partly_cloudy_day';

      const d = analise.data.split('-');
      const dataStr = d.length === 3 ? `${d[2]}/${d[1]}` : analise.data;

      return {
        data: dataStr,
        diaSemana: index === 0 ? 'Hoje' : (index === 1 ? 'Amanhã' : diaSemana),
        icone,
        status,
      };
    });

    const getRawDate = (dateStr: string) => {
       const [dia, mes] = dateStr.split('/');
       if(!dia || !mes) return dateStr;
       const year = new Date().getFullYear();
       return `${year}-${mes}-${dia}`;
    }

    const diaSelecionadoFormat = selectedDate || dias[0].data;
    const rawSelectedDate = selectedDate ? getRawDate(selectedDate) : list[0].data;
    
    let analiseSelecionada = list.find(a => a.data === rawSelectedDate);
    if (!analiseSelecionada) {
       analiseSelecionada = list[0];
    }

    const metricas = {
      horasLivres: analiseSelecionada.horasLivres,
      temperaturaMax: Math.round(analiseSelecionada.temperaturaMedia),
      umidade: Math.round(analiseSelecionada.umidadeMedia),
      vento: Math.round(analiseSelecionada.velocidadeVentoMedia),
      chuva: Math.round(analiseSelecionada.precipitacaoAcumulada),
      probabilidadeChuva: Math.round(analiseSelecionada.probabilidadePrecipitacao || 0),
    };

    const grafico = {
      horas: analiseSelecionada.climaList.map(c => {
        const h = new Date(c.data).getHours();
        return h.toString().padStart(2, '0') + 'h';
      }),
      temperatura: analiseSelecionada.climaList.map(c => Math.round(c.temperaturaBulboSeco)),
      umidade: analiseSelecionada.climaList.map(c => Math.round(c.umidade)),
    };

    const rawAvisos = analiseSelecionada.climaList.map(c => {
      const horaInt = new Date(c.data).getHours();
      const hora = horaInt.toString().padStart(2, '0') + ':00';
      const severity: SeveridadeAviso = c.ocorrenciaList.some(o => o.nivelAlerta === 'ALTO') ? 'critico' : (c.ocorrenciaList.some(o => o.nivelAlerta === 'MEDIO') ? 'alerta' : 'ok');
      
      const avisos: Aviso[] = c.ocorrenciaList.map(o => {
          const avSev: SeveridadeAviso = o.nivelAlerta === 'ALTO' ? 'critico' : 'alerta';
          return {
            titulo: o.titulo,
            descricao: o.descricao || '',
            severidade: avSev
          }
      });
      
      if(avisos.length === 0) {
        avisos.push({
           titulo: 'Condições ideais para operação',
           descricao: '',
           severidade: 'ok'
        });
      }

      return {
        horaInt,
        hora,
        severidade: severity,
        avisos
      };
    });

    const avisosPorHora: AvisoPorHora[] = [];
    let currentGroup: any = null;

    const formatGroup = (group: any): AvisoPorHora => {
        let horaStr = `${group.horaStart.toString().padStart(2, '0')}:00`;
        if (group.horaStart !== group.horaEnd) {
           horaStr += ` - ${group.horaEnd.toString().padStart(2, '0')}:00`;
        }
        return {
           hora: horaStr,
           severidade: group.severidade,
           avisos: group.avisos
        };
    };

    for (const aviso of rawAvisos) {
      if (aviso.severidade === 'ok') {
        if (!currentGroup) {
          currentGroup = {
            horaStart: aviso.horaInt,
            horaEnd: aviso.horaInt,
            severidade: aviso.severidade,
            avisos: aviso.avisos
          };
        } else {
          if (aviso.horaInt === currentGroup.horaEnd + 1) {
             currentGroup.horaEnd = aviso.horaInt;
          } else {
             avisosPorHora.push(formatGroup(currentGroup));
             currentGroup = {
                horaStart: aviso.horaInt,
                horaEnd: aviso.horaInt,
                severidade: aviso.severidade,
                avisos: aviso.avisos
             };
          }
        }
      } else {
        if (currentGroup) {
           avisosPorHora.push(formatGroup(currentGroup));
           currentGroup = null;
        }
        avisosPorHora.push({
           hora: aviso.hora,
           severidade: aviso.severidade,
           avisos: aviso.avisos
        });
      }
    }

    if (currentGroup) {
       avisosPorHora.push(formatGroup(currentGroup));
    }

    return {
      metricas,
      grafico,
      avisosPorHora,
      dias,
      diaSelecionado: diaSelecionadoFormat
    };
  }
}
