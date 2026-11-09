import { Component, input, OnInit, inject, signal, computed, effect, ChangeDetectorRef } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DynamicField } from './dynamic-form.model';
import { LookupFieldComponent } from './lookup-field.component';

@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [
    ReactiveFormsModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatButtonModule, MatIconModule, LookupFieldComponent,
  ],
template: `
    <form [formGroup]="form()" class="flex flex-col gap-4">
      @for (field of visibleFields(); track field.key) {

        @if (field.type === 'text' || field.type === 'number') {
          <div [class]="field.cols === 2 ? 'col-span-2' : ''">
            <mat-form-field appearance="outline" class="w-full"
                            [class.field-error]="hasError(field.key)">
              <mat-label>{{ field.label }}</mat-label>
              <input matInput
                     [type]="field.type === 'number' ? 'number' : 'text'"
                     [formControlName]="field.key"
                     (blur)="clamp(field, $event)" />
              @if (hasError(field.key)) {
                <mat-error>{{ getErrorMessage(field.key) }}</mat-error>
              }
            </mat-form-field>
          </div>
        }

        @if (field.type === 'select') {
          <mat-form-field appearance="outline" class="w-full"
                          [class.field-error]="hasError(field.key)">
            <mat-label>{{ field.label }}</mat-label>
            <mat-select [formControlName]="field.key">
              @for (opt of field.options; track opt.value) {
                <mat-option [value]="opt.value">{{ opt.label }}</mat-option>
              }
            </mat-select>
            @if (hasError(field.key)) {
              <mat-error>{{ getErrorMessage(field.key) }}</mat-error>
            }
          </mat-form-field>
        }

        @if (field.type === 'lookup' && field.lookup) {
          <app-lookup-field
            [label]="field.label"
            [config]="field.lookup"
            [displayValue]="getLookupDisplay(field)"
            [errorMessage]="getErrorMessage(field.key)"
            (selected)="onLookupSelected(field, $event)"
            (cleared)="onLookupCleared(field)" />
        }

        @if (field.type === 'group-array' && field.children) {
          <div class="flex flex-col gap-3">
            <div class="flex items-center justify-between">
              <span class="text-white/50 text-xs font-medium">{{ field.label }}</span>
              <button type="button" mat-button (click)="addGroup(field)"
                      class="!text-sky-400 !text-xs">
                <span class="material-symbols-outlined !text-[18px] mr-1">add</span>
                {{ field.addLabel ?? 'Adicionar' }}
              </button>
            </div>

            @for (groupCtrl of getArray(field.key).controls; track $index; let i = $index) {
              <div [formGroup]="asGroup(groupCtrl)"
                   class="border border-white/[.06] rounded-xl p-4 flex flex-col gap-3">
                <div class="grid gap-3 items-center"
                     [style.gridTemplateColumns]="getGroupGrid(field) + ' 40px'">

                  @for (child of field.children; track child.key) {

                    @if (child.type === 'select') {
                      <mat-form-field appearance="outline"
                                      [class.field-error]="hasGroupError(asGroup(groupCtrl), child.key)">
                        <mat-label>{{ child.label }}</mat-label>
                        <mat-select [formControlName]="child.key">
                          @for (opt of child.options; track opt.value) {
                            <mat-option [value]="opt.value">{{ opt.label }}</mat-option>
                          }
                        </mat-select>
                        @if (hasGroupError(asGroup(groupCtrl), child.key)) {
                          <mat-error>{{ getGroupErrorMessage(asGroup(groupCtrl), child.key) }}</mat-error>
                        }
                      </mat-form-field>
                    }

                    @if (child.type === 'lookup' && child.lookup) {
                      <app-lookup-field
                        [label]="''"
                        [config]="child.lookup"
                        [displayValue]="getGroupLookupDisplay(field.key, i, child.key)"
                        [errorMessage]="getGroupErrorMessage(asGroup(groupCtrl), child.key)"
                        (selected)="onGroupLookupSelected(field.key, i, child, $event)"
                        (cleared)="onGroupLookupCleared(field.key, i, child)" />
                    }

                    @if (child.type === 'text' || child.type === 'number') {
                      <mat-form-field appearance="outline"
                                      [class.field-error]="hasGroupError(asGroup(groupCtrl), child.key)">
                        <mat-label>{{ child.label }}</mat-label>
                        <input matInput
                               [type]="child.type === 'number' ? 'number' : 'text'"
                               [formControlName]="child.key"
                               (blur)="clampGroup(child, asGroup(groupCtrl), $event)" />
                        @if (hasGroupError(asGroup(groupCtrl), child.key)) {
                          <mat-error>{{ getGroupErrorMessage(asGroup(groupCtrl), child.key) }}</mat-error>
                        }
                      </mat-form-field>
                    }

                  }

                  <button type="button" mat-icon-button
                          (click)="removeGroup(field.key, i)"
                          class="!text-red-400/60 hover:!text-red-400 self-center">
                    <span class="material-symbols-outlined">delete</span>
                  </button>

                </div>
              </div>
            }

            @if (getArray(field.key).length === 0) {
              <div class="text-white/20 text-xs text-center py-3 border border-dashed
                          border-white/[.06] rounded-xl">
                Nenhum item adicionado
              </div>
            }
          </div>
        }
      }
    </form>
  `
})
export class DynamicFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly cdr = inject(ChangeDetectorRef);
  readonly form   = input.required<FormGroup>();
  readonly fields = input.required<DynamicField[]>();

  readonly _lookupLabels = signal<Record<string, string>>({});

  readonly visibleFields = computed(() =>
    this.fields().filter(f => !f.visibleWhen || f.visibleWhen(this.form().value))
  );

  ngOnInit(): void {
    this.form().valueChanges.subscribe(() => {});
  }

  getArray(key: string): FormArray {
    return this.form().get(key) as FormArray;
  }

  asGroup(ctrl: any): FormGroup { return ctrl as FormGroup; }

  addGroup(field: DynamicField): void {
    const group: Record<string, any> = {};
    field.children?.forEach(c => {
      group[c.key] = [c.defaultValue ?? null, ...(c.validators ? [c.validators] : [])];
    });
    this.getArray(field.key).push(this.fb.group(group));
  }

  removeGroup(key: string, index: number): void {
    const field = this.fields().find(f => f.key === key);
    field?.children?.forEach(child => {
      const compositeKey = this.getGroupLookupKey(key, index, child.key);
      this._lookupLabels.update(l => {
        const updated = { ...l };
        delete updated[compositeKey];
        return updated;
      });
    });
    this.getArray(key).removeAt(index);
  }

  getLookupDisplay(field: DynamicField): string | null {
    return this._lookupLabels()[field.key] ?? null;
  }

  onLookupSelected(field: DynamicField, item: any): void {
    const labelKey = field.lookup!.labelKey;
    const valueKey = field.lookup!.valueKey;
    this.form().get(field.key)?.setValue(item[valueKey]);
    this._lookupLabels.update(l => ({ ...l, [field.key]: item[labelKey] }));
  }

  onLookupCleared(field: DynamicField): void {
    this.form().get(field.key)?.setValue(null);
    this._lookupLabels.update(l => ({ ...l, [field.key]: '' }));
  }

  setLookupLabel(key: string, label: string): void {
    this._lookupLabels.update(l => ({ ...l, [key]: label }));
  }

  clearAllLookups(): void {
    this._lookupLabels.set({});
  }

  getGroupGrid(field: DynamicField): string {
    const count = field.children?.length ?? 1;
    if (count === 2) return 'repeat(2, 1fr)';
    return `repeat(${count}, 1fr)`;
  }

  hasError(key: string): boolean {
    const ctrl = this.form().get(key);
    return !!(ctrl?.invalid && ctrl?.touched);
  }

  hasGroupError(group: FormGroup, key: string): boolean {
    const ctrl = group.get(key);
    return !!(ctrl?.invalid && ctrl?.touched);
  }

  getErrorMessage(key: string): string {
    const ctrl = this.form().get(key);
    if (!ctrl || !ctrl.errors || !ctrl.touched) return '';
    return this.mapErrors(ctrl.errors);
  }

  getGroupErrorMessage(group: FormGroup, key: string): string {
    const ctrl = group.get(key);
    if (!ctrl || !ctrl.errors || !ctrl.touched) return '';
    return this.mapErrors(ctrl.errors);
  }

  private mapErrors(errors: any): string {
    const messages: string[] = [];
    if (errors['required']) messages.push('Campo obrigatório');
    if (errors['min']) messages.push(`Valor mínimo: ${errors['min'].min}`);
    if (errors['max']) messages.push(`Valor máximo: ${errors['max'].max}`);
    if (errors['email']) messages.push('E-mail inválido');
    if (errors['requiredEither']) messages.push('Preencha mín. ou máx.');
    if (errors['minlength']) messages.push(`Mínimo de ${errors['minlength'].requiredLength} caracteres`);
    if (errors['pattern']) messages.push('Formato inválido');
    return messages.length > 0 ? messages.join(' • ') : 'Campo inválido';
  }

  clamp(field: DynamicField, event: Event): void {
    if (field.type !== 'number') return;
    const input   = event.target as HTMLInputElement;
    const clamped = this.clampValue(parseFloat(input.value), field);
    if (clamped === null) return;
    const ctrl = this.form().get(field.key);
    ctrl?.setValue(clamped);
    ctrl?.markAsTouched();
    input.value = String(clamped);
    this.cdr.detectChanges();
  }

  clampGroup(child: DynamicField, group: FormGroup, event: Event): void {
    if (child.type !== 'number') return;
    const input   = event.target as HTMLInputElement;
    const clamped = this.clampValue(parseFloat(input.value), child);
    if (clamped === null) return;
    const ctrl = group.get(child.key);
    ctrl?.setValue(clamped);
    ctrl?.markAsTouched();
    input.value = String(clamped);
    this.cdr.detectChanges();
  }

  private clampValue(value: number, field: DynamicField): number | null {
    if (isNaN(value)) return null;
    let result = value;
    if (field.min !== undefined && value < field.min) result = field.min;
    if (field.max !== undefined && value > field.max) result = field.max;
    return result === value ? null : result;
  }
  getGroupLookupKey(fieldKey: string, index: number, childKey: string): string {
  return `${fieldKey}_${index}_${childKey}`;
}

getGroupLookupDisplay(fieldKey: string, index: number, childKey: string): string | null {
  return this._lookupLabels()[this.getGroupLookupKey(fieldKey, index, childKey)] ?? null;
}

onGroupLookupSelected(fieldKey: string, index: number, child: DynamicField, item: any): void {
  const group = this.getArray(fieldKey).at(index) as FormGroup;
  group.get(child.key)?.setValue(item[child.lookup!.valueKey]);
  const compositeKey = this.getGroupLookupKey(fieldKey, index, child.key);
  this._lookupLabels.update(l => ({ ...l, [compositeKey]: String(item[child.lookup!.labelKey]) }));
}

onGroupLookupCleared(fieldKey: string, index: number, child: DynamicField): void {
  const group = this.getArray(fieldKey).at(index) as FormGroup;
  group.get(child.key)?.setValue(null);
  const compositeKey = this.getGroupLookupKey(fieldKey, index, child.key);
  this._lookupLabels.update(l => ({ ...l, [compositeKey]: '' }));
}
}
