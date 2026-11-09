import { ValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs';

export type FieldType = 'text' | 'number' | 'select' | 'lookup' | 'group-array';

export interface SelectOption {
  label: string;
  value: any;
}

export interface LookupConfig<T = any> {
  search:       (term: string) => Observable<T[]>;
  labelKey:     keyof T;
  valueKey:     keyof T;
  columns:      { key: keyof T; label: string }[];
  placeholder?: string;
}

export interface DynamicField {
  key:          string;
  label:        string;
  type:         FieldType;
  defaultValue?: any;
  validators?:  ValidatorFn[];
  visibleWhen?: (values: any) => boolean;
  options?:     SelectOption[];
  lookup?:      LookupConfig;
  children?:    DynamicField[];
  addLabel?:    string;
  cols?:        1 | 2;
  min?:         number;   // ← novo
  max?:         number;   // ← novo
}
