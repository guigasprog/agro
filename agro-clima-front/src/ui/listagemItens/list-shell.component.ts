import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-list-shell',
  standalone: true,
  imports: [MatIconModule],
  host: {
    class: 'flex w-75 flex-col h-full bg-slate-900 rounded-2xl p-4 overflow-hidden'
  },
  template: `
    <!-- Header -->
    <div class="flex items-center justify-between mb-2 flex-shrink-0">
      <span class="text-white font-medium text-base">{{ title() }}</span>
      <div class="flex gap-2">
        <ng-content select="[listActions]" />
      </div>
    </div>

    <!-- Loading -->
    @if (isLoading()) {
      <div class="flex flex-col gap-2">
        @for (i of skeletons; track i) {
          <div class="flex items-center gap-3 rounded-xl p-3 bg-white/5 animate-pulse">
            <div class="w-10 h-10 rounded-xl bg-white/10"></div>
            <div class="flex flex-col gap-2 flex-1">
              <div class="h-3 w-2/3 rounded bg-white/10"></div>
              <div class="h-2.5 w-1/3 rounded bg-white/5"></div>
            </div>
          </div>
        }
      </div>
    }

    <!-- Erro -->
    @if (error()) {
      <div class="flex flex-col items-center justify-center gap-2 py-8 text-red-400">
        <mat-icon>error_outline</mat-icon>
        <span class="text-sm">{{ error() }}</span>
        <ng-content select="[listError]" />
      </div>
    }

    <!-- Região scrollável -->
    @if (!isLoading() && !error()) {
      <div class="flex-1 overflow-y-auto overflow-x-hidden flex flex-col gap-1 pr-1">
        <ng-content select="[listItems]" />
      </div>
    }

    <!-- Footer fixo -->
    <div class="flex-shrink-0 flex flex-col gap-1 pt-2 border-t border-white/[.06]">
      <ng-content select="[listFooter]" />
      @if (count()) {
        <span class="text-white/30 text-xs text-right px-1">{{ count() }}</span>
      }
    </div>
  `
})
export class ListShellComponent {
  readonly title     = input.required<string>();
  readonly isLoading = input<boolean>(false);
  readonly error     = input<string | null>(null);
  readonly count     = input<string | null>(null);

  readonly skeletons = [1, 2, 3];
}
