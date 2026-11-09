export type EquipmentType = 'TRATOR' | 'DRONE' | 'IMPLEMENTO';
export type TipoLimite = 'TEMPERATURA' | 'UMIDADE' | 'VENTO' | 'VISIBILIDADE';

export interface Limite {
  id?:          string;
  tipo:         TipoLimite;
  valorMinimo:  number;
  valorMaximo:  number;
}

export interface Equipment {
  id:                          string;
  tipoEquipamento:              EquipmentType;
  tipoImplemento?:              string;
  nome:                         string;
  nomeFabricante:               string;
  pesoTotal?:                    number;
  distribuicaoEstaticaTraseira?: number;
  pressaoPneuDianteiro?:        number;
  pressaoPneuTraseiro?:         number;
  qtRodasDianteiras?:           number;
  qtRodasTraseiras?:            number;
  limiteList?:                   Limite[];
}
