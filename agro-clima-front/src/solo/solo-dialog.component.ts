import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { GenericDialogComponent } from '../ui/dialog/dialog.component';
import { DynamicFormComponent } from '../ui/forms_dinamico/dynamic-form.component';
import { DynamicField } from '../ui/forms_dinamico/dynamic-form.model';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../ui/dialog/confirm-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SuccessSnackbarComponent } from '../ui/snackbar/success-snackbar.component';
import { Solo, SoloType } from './solo.model';
import { SoloService } from './solo.service';

export interface SoloDialogData { id?: string; }

@Component({
  selector: 'app-solo-dialog',
  standalone: true,
  providers:[SoloService],
  imports: [ReactiveFormsModule, MatDialogModule, MatButtonModule,
            GenericDialogComponent, DynamicFormComponent],
  template: `
    <app-dialog
      [title]="isEdit ? 'Editar Solo' : 'Novo Solo'"
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
      <p class="text-white/30 p-2">* Caso uma informação não seja informada será usado a Textura do solo para determina-la na estimativa da janela operacional</p>
    </app-dialog>
  `
})
export class SoloDialogComponent implements OnInit {
  private readonly fb      = inject(FormBuilder);
  private readonly service = inject(SoloService);
  readonly dialogData      = inject<SoloDialogData>(MAT_DIALOG_DATA);
  readonly ref             = inject(MatDialogRef);
  private readonly dialog  = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  readonly saving      = signal(false);
  readonly loadingData = signal(false);
  readonly tipoAtual   = signal<SoloType | null>(null);

  readonly form: FormGroup = this.fb.group({
    texturaSolo:              ['', Validators.required],
    nome:                         ['', Validators.required],
    resistenciaMaximaEstruturalSolo:                    [null],
    taxaDecaimentoSolo:                    [null],
    limiarDureza:                    [null],
    limiarPlasticidade:                    [null],
    densidade:                    [null]

  });

  readonly fields = computed<DynamicField[]>(() => {

    return [
      {
        key: 'texturaSolo', label: 'Textura Solo',
        type: 'select',
        options: [
          { label: 'Argiloso',     value: 'ARGILOSO'     },
          { label: 'Arenoso',      value: 'ARENOSO'       },
          { label: 'Medio', value: 'MEDIO'  },
        ],
        validators: [Validators.required],
      },
      {
        key: 'nome', label: 'Nome', type: 'text',
        validators: [Validators.required],
      },
      {
        key: 'resistenciaMaximaEstruturalSolo', label: 'Resistencia Maxima Estrutural do Solo (MPa)', type: 'number',
      },
      {
        key: 'taxaDecaimentoSolo', label: 'Taxa de Decaimento do Solo (MPa)', type: 'number',
      },
      {
        key: 'limiarDureza', label: 'Limiar Dureza (Mg m-³)', type: 'number',
      },
      {
        key: 'limiarPlasticidade', label: 'Limiar Plasticidade(Mg m-³)', type: 'number',
      },
      {
        key: 'densidade', label: 'Densidade', type: 'number',
      }
    ];
  });

  get isEdit() { return !!this.dialogData.id; }

  ngOnInit(): void {

    if (this.dialogData.id) this.loadSolo(this.dialogData.id);
  }

  private loadSolo(id: string): void {
    this.loadingData.set(true);
    this.service.findById(id).subscribe(eq => {
      if (!eq) return;
      this.form.patchValue(eq);
      this.loadingData.set(false);
    });
  }
  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving.set(true);
    const rawValue = this.form.getRawValue();
    
    // Converte strings vazias para null para evitar que campos numéricos sejam salvos como 0
    Object.keys(rawValue).forEach(key => {
      if (rawValue[key] === '') {
        rawValue[key] = null;
      }
    });

    const payload: Solo = { ...rawValue, id: this.dialogData.id };
    this.service.save(payload).subscribe({
      next:  () => {
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
      error: ()  =>   this.saving.set(false),
    });
  }

  onDelete(): void {
    if (!this.dialogData.id) return;
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Deletar Solo', message: 'Tem certeza que deseja deletar este solo?' },
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
