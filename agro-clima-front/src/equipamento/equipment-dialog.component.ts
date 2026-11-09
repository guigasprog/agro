import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { GenericDialogComponent } from '../ui/dialog/dialog.component';
import { ConfirmDialogComponent } from '../ui/dialog/confirm-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SuccessSnackbarComponent } from '../ui/snackbar/success-snackbar.component';
import { EquipmentService } from './equipment.service';
import { Equipment, EquipmentType, TipoLimite } from './equipment.model';
import { DynamicFormComponent } from '../ui/forms_dinamico/dynamic-form.component';
import { DynamicField } from '../ui/forms_dinamico/dynamic-form.model';

export interface EquipmentDialogData { id?: string; }

const TIPOS_LIMITE: TipoLimite[] = ['TEMPERATURA', 'UMIDADE', 'VENTO'];

@Component({
  selector: 'app-equipment-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogModule, MatButtonModule,
    GenericDialogComponent, DynamicFormComponent],
  template: `
    <app-dialog
      [title]="isEdit ? 'Editar Equipamento' : 'Novo Equipamento'"
      [saving]="saving()"
      [showDelete]="isEdit"
      (delete)="onDelete()"
      (submit)="onSubmit()">

      @if (loadingData()) {
        <div class="flex justify-center py-10">
          <span class="material-symbols-outlined text-white/30 text-[40px] animate-spin">
            progress_activity
          </span>
        </div>
      } @else {
        <app-dynamic-form [form]="form" [fields]="fields()" />
      }
    </app-dialog>
  `
})
export class EquipmentDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly service = inject(EquipmentService);
  readonly dialogData = inject<EquipmentDialogData>(MAT_DIALOG_DATA);
  readonly ref = inject(MatDialogRef);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  readonly saving = signal(false);
  readonly loadingData = signal(false);
  readonly tipoAtual = signal<EquipmentType | null>(null);

  readonly form: FormGroup = this.fb.group({
    tipoEquipamento: ['', Validators.required],
    tipoImplemento: [null],
    nome: ['', Validators.required],
    nomeFabricante: ['', Validators.required],
    pesoTotal: [null, Validators.required],
    distribuicaoEstaticaTraseira: [null],
    pressaoPneuDianteiro: [null],
    pressaoPneuTraseiro: [null],
    qtRodasDianteiras: [null],
    qtRodasTraseiras: [null],
    limiteList: this.fb.array([]),
  });

  readonly fields = computed<DynamicField[]>(() => {
    const tipo = this.tipoAtual();
    const isTrator = tipo === 'TRATOR';
    const isImplemento = tipo === 'IMPLEMENTO';

    return [
      {
        key: 'tipoEquipamento', label: 'Tipo de equipamento',
        type: 'select',
        options: [
          { label: 'Trator', value: 'TRATOR' },
          { label: 'Drone', value: 'DRONE' },
          { label: 'Implemento', value: 'IMPLEMENTO' },
        ],
        validators: [Validators.required],
      },
      {
        key: 'tipoImplemento', label: 'Tipo de implemento',
        type: 'select',
        options: [
          { label: 'Acessório', value: 'ACESSORIO' },
          { label: 'Montado Traseiro', value: 'MONTADO_TRASEIRO' },
          { label: 'Arrasto (Barra de tração)', value: 'ARRASTO_BARRA_TRACAO' },
          { label: 'Frontal', value: 'FRONTAL' },
        ],
        validators: [Validators.required],
        visibleWhen: v => v.tipoEquipamento === 'IMPLEMENTO',
      },
      {
        key: 'nome', label: 'Nome', type: 'text',
        validators: [Validators.required],
      },
      {
        key: 'nomeFabricante', label: 'Fabricante', type: 'text',
        validators: [Validators.required],
      },
      {
        key: 'pesoTotal', label: 'Peso total (kg)', type: 'number',
        validators: [Validators.required], min: 1,
      },
      {
        key: 'distribuicaoEstaticaTraseira',
        label: 'Dist. estática traseira (%)', type: 'number',
        validators: [Validators.required],
        visibleWhen: v => v.tipoEquipamento === 'TRATOR',
      },
      {
        key: 'pressaoPneuDianteiro',
        label: 'Pressão pneu dianteiro (kPa)', type: 'number',
        validators: [Validators.required],
        visibleWhen: v => v.tipoEquipamento === 'TRATOR',
      },
      {
        key: 'pressaoPneuTraseiro',
        label: 'Pressão pneu traseiro (kPa)', type: 'number',
        validators: [Validators.required],
        visibleWhen: v => v.tipoEquipamento === 'TRATOR',
      },
      {
        key: 'qtRodasDianteiras',
        label: 'Qtd. rodas dianteiras', type: 'number',
        validators: [Validators.required],
        visibleWhen: v => v.tipoEquipamento === 'TRATOR',
      },
      {
        key: 'qtRodasTraseiras',
        label: 'Qtd. rodas traseiras', type: 'number',
        validators: [Validators.required],
        visibleWhen: v => v.tipoEquipamento === 'TRATOR',
      },
      {
        key: 'limiteList',
        label: 'Limites operacionais',
        type: 'group-array',
        addLabel: 'Adicionar limite',
        children: [
          {
            key: 'tipo', label: 'Tipo', type: 'select',
            options: TIPOS_LIMITE.map(t => ({ label: t, value: t })),
            validators: [Validators.required],
          },
          {
            key: 'valorMinimo', label: 'Mínimo', type: 'number',
          },
          {
            key: 'valorMaximo', label: 'Máximo', type: 'number',
          },
        ],
      },
    ];
  });

  get isEdit() { return !!this.dialogData.id; }

  ngOnInit(): void {
    this.form.get('tipoEquipamento')?.valueChanges.subscribe((tipo: EquipmentType) => {
      this.tipoAtual.set(tipo);
      this.updateValidators(tipo);
    });
    if (this.dialogData.id) this.loadEquipment(this.dialogData.id);
  }

  private updateValidators(tipo: EquipmentType): void {
    const rodas = ['distribuicaoEstaticaTraseira', 'pressaoPneuDianteiro',
      'pressaoPneuTraseiro', 'qtRodasDianteiras', 'qtRodasTraseiras'];
    rodas.forEach(f => {
      const ctrl = this.form.get(f);
      if (tipo !== 'TRATOR') { ctrl?.clearValidators(); ctrl?.setValue(null); }
      else { ctrl?.setValidators(Validators.required); }
      ctrl?.updateValueAndValidity();
    });
    const impl = this.form.get('tipoImplemento');
    if (tipo === 'IMPLEMENTO') impl?.setValidators(Validators.required);
    else { impl?.clearValidators(); impl?.setValue(null); }
    impl?.updateValueAndValidity();
  }

  private loadEquipment(id: string): void {
    this.loadingData.set(true);
    this.service.findById(id).subscribe(eq => {
      if (!eq) return;
      this.form.patchValue(eq);
      this.tipoAtual.set(eq.tipoEquipamento);
      const arr = this.form.get('limiteList') as FormArray;
      arr.clear();
      eq.limiteList?.forEach(l => arr.push(this.fb.group({
        tipo: [l.tipo, Validators.required],
        valorMinimo: [l.valorMinimo],
        valorMaximo: [l.valorMaximo],
      })));
      this.updateValidators(eq.tipoEquipamento);
      this.loadingData.set(false);
    });
  }

  onSubmit(): void {
    const limites = this.form.get('limiteList') as FormArray;
    let limitesValidos = true;
    for (let i = 0; i < limites.length; i++) {
      const group = limites.at(i) as FormGroup;
      const minCtrl = group.get('valorMinimo');
      const maxCtrl = group.get('valorMaximo');
      if (minCtrl?.value == null && maxCtrl?.value == null) {
        minCtrl?.setErrors({ requiredEither: true });
        maxCtrl?.setErrors({ requiredEither: true });
        limitesValidos = false;
      } else {
        if (minCtrl?.hasError('requiredEither')) {
          const errs = { ...minCtrl.errors };
          delete errs['requiredEither'];
          minCtrl.setErrors(Object.keys(errs).length ? errs : null);
        }
        if (maxCtrl?.hasError('requiredEither')) {
          const errs = { ...maxCtrl.errors };
          delete errs['requiredEither'];
          maxCtrl.setErrors(Object.keys(errs).length ? errs : null);
        }
      }
    }

    if (this.form.invalid || !limitesValidos) { this.form.markAllAsTouched(); return; }
    this.saving.set(true);
    const payload: Equipment = { ...this.form.getRawValue(), id: this.dialogData.id };
    this.service.save(payload).subscribe({
      next: () => {
        this.saving.set(false);
        this.snackBar.openFromComponent(SuccessSnackbarComponent, {
          data: 'Salvo com sucesso!',
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['custom-error-snackbar']
        });
        this.ref.close(true);
      },
      error: () => this.saving.set(false),
    });
  }

  onDelete(): void {
    if (!this.dialogData.id) return;
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Deletar Equipamento', message: 'Tem certeza que deseja deletar este equipamento?' },
      panelClass: 'dark-dialog'
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res && this.dialogData.id) {
        this.saving.set(true);
        this.service.delete(this.dialogData.id).subscribe({
          next: () => {
            this.saving.set(false);
            this.snackBar.openFromComponent(SuccessSnackbarComponent, {
              data: 'Excluído com sucesso!',
              duration: 3000,
              horizontalPosition: 'end',
              verticalPosition: 'top',
              panelClass: ['custom-error-snackbar']
            });
            this.ref.close(true);
          },
          error: () => this.saving.set(false)
        });
      }
    });
  }
}
