export type SoloType = 'ARGILOSO' | 'ARENOSO' | 'MEDIO';
export interface Solo {
  id: string;
  nome: string;
  texturaSolo: SoloType;
  resistenciaMaximaEstruturalSolo?:number;
  taxaDecaimentoSolo?:number;
  limiarDureza?:number;
  limiarPlasticidade?:number;
  densidade?:number;


}
