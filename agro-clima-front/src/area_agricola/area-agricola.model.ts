

export interface AreaAgricola {
  id: string;
  geometria: GeoJSON.MultiPolygon | GeoJSON.Polygon | undefined;
  nome: string;
  cidade: string | undefined | null;
  estado: string | undefined | null;
  hectares: number;
  idSolo?: string;
  nomeSolo?: string;
}
export interface AreaAgricolaReduzida {
  id: string;
  nome: string;
  cidade?: string;
  estado?: string;
}
