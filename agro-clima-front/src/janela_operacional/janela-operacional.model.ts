export type TipoOperacao = 'pulverizacao' | 'mapeamento' | 'plantio' | 'colheita';



export interface JanelaOperacional {
  tipoOperacao:             TipoOperacao;
  areaAgricolaId:           string;
  equipamentoId:            string;
  implementoIdList:        string[];
}
