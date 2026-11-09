export interface FilterField {
  key:     string;
  label:   string;
  type:    'chips' | 'text' ;
  options?: string[]; // apenas para type: 'chips'
}

export interface FilterState {
  [key: string]: string | string[];
}
