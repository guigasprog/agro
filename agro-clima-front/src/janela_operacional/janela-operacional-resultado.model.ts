export type StatusDia       = 'ruim' | 'alerta' | 'ok';
export type SeveridadeAviso = 'critico' | 'alerta' | 'ok';
export type IconeClima      = 'rainy' | 'partly_cloudy_day' | 'sunny' | 'thunderstorm';

export interface MetricasDia {
  horasLivres:     number;
  temperaturaMax:  number;
  umidade:         number;
  vento:           number;
  chuva:           number;
  probabilidadeChuva: number;
}

export interface DadosGrafico {
  horas:       string[];
  temperatura: number[];
  umidade:     number[];
}

export interface Aviso {
  titulo?:     string;
  descricao:   string;
  valorAtual?:  number;
  valorLimite?: number;
  unidade?:     string;
  tipo?:        'min' | 'max';
  severidade:  SeveridadeAviso;
}

export interface AvisoPorHora {
  hora:       string;
  horaFim?:   string;
  avisos:     Aviso[];
  severidade: SeveridadeAviso;
}

export interface DiaPrevisao {
  data:       string;
  diaSemana:  string;
  icone:      IconeClima;
  status:     StatusDia | null;
}

export interface JanelaOperacionalResultado {
  metricas:       MetricasDia;
  grafico:        DadosGrafico;
  avisosPorHora:  AvisoPorHora[];
  dias:           DiaPrevisao[];
  diaSelecionado: string;
}

export interface OcorrenciaDTO {
  nivelAlerta: string;
  titulo: string;
  descricao: string;
}

export interface ClimaDTO {
  data: string; // ISO LocalDateTime
  umidade: number;
  precipitacao: number;
  pressaoSuperficie: number;
  velocidadeVento: number;
  umidadeVolumetrica: number;
  visibilidade: number;
  temperaturaBulboSeco: number;
  temperaturaBulboUmido: number;
  deltaT: number;
  capacidadeSuporteSolo: number;
  ocorrenciaList: OcorrenciaDTO[];
}

export interface AnaliseJanelaOperacionalDTO {
  horasLivres: number;
  data: string; // ISO LocalDate
  qtProblemaCritico: number;
  qtProblemaModerado: number;
  umidadeMedia: number;
  precipitacaoAcumulada: number;
  probabilidadePrecipitacao: number;
  velocidadeVentoMedia: number;
  visibilidadeMedia: number;
  temperaturaMedia: number;
  climaList: ClimaDTO[];
}
