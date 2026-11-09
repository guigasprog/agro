import { Component, input, output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { inject } from '@angular/core';
import { LookupConfig } from './dynamic-form.model';
import { MatRippleModule } from '@angular/material/core';
import { LookupDialogComponent } from '../dialog/lookup-dialog.component';

@Component({
  selector: 'app-lookup-field',
  standalone: true,
  imports: [MatRippleModule],
  template: `
    <div>
      <span class="text-white/35 text-[14px] block mb-1.5">{{ label() }}</span>
      <div matRipple
           (click)="open()"
           class="flex items-center gap-2 bg-white/5 border rounded-xl px-3 py-2.5
                  cursor-pointer transition-colors hover:bg-white/8"
           [class]="errorMessage() ? 'border-red-400/50' : 'border-white/8'">

        @if (displayValue()) {
          <span class="flex-1 text-white/80 text-sm truncate">{{ displayValue() }}</span>
          <span class="material-symbols-outlined text-white/25 text-[16px] cursor-pointer flex-shrink-0"
                (click)="$event.stopPropagation(); cleared.emit()">close</span>
        } @else {
          <span class="flex-1 text-white/25 text-sm">{{ config().placeholder ?? 'Selecionar...' }}</span>
          <span class="material-symbols-outlined text-white/30 text-[18px] flex-shrink-0">search</span>
        }
      </div>
      @if (errorMessage()) {
        <span class="text-red-400 text-[11px] mt-1 block pl-1">{{ errorMessage() }}</span>
      }
    </div>
  `
})
export class LookupFieldComponent {
  private readonly dialog = inject(MatDialog);

  readonly label        = input.required<string>();
  readonly config       = input.required<LookupConfig>();
  readonly displayValue = input<string | null>(null);
  readonly errorMessage = input<string | null>(null);
  readonly selected     = output<any>();
  readonly cleared      = output<void>();

  open(): void {
    this.dialog.open(LookupDialogComponent, {
      data:         { config: this.config(), title: this.label() },
      panelClass:   'dark-dialog',
      disableClose: false,
    }).afterClosed().subscribe(item => {
      if (item) this.selected.emit(item);
    });
  }
}
