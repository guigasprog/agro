import { Component, input, output, signal, computed, ElementRef, inject, HostListener } from '@angular/core';
import { FilterField, FilterState } from './filter.model';

@Component({
  selector: 'app-filter-dropdown',
  standalone: true,
  template: `
    <div class="relative">
      <button (click)="toggleOpen()"
              class="w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
              [class]="isOpen() || hasActiveFilters()
                ? 'bg-sky-400/15'
                : 'bg-white/5 hover:bg-white/10'">
        <span class="material-symbols-outlined text-[18px]"
              [class]="isOpen() || hasActiveFilters() ? 'text-sky-400' : 'text-white/50'">
          filter_list
        </span>
        @if (hasActiveFilters()) {
          <div class="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-sky-400"></div>
        }
      </button>
    </div>

    <!-- Overlay -->
    @if (isOpen()) {
      <div class="fixed inset-0 z-40" (click)="cancel()"></div>

      <!-- Dropdown com posição calculada via style -->
      <div class="fixed z-50 w-64 bg-slate-800 border border-white/[.08] rounded-xl overflow-hidden"
           [style.top.px]="dropdownTop"
           [style.left.px]="dropdownLeft">

        <div class="flex items-center justify-between px-4 py-3 border-b border-white/[.06]">
          <span class="text-white text-sm font-medium">Filtros</span>
          <button (click)="clear()"
                  class="text-sky-400/70 text-[11px] hover:text-sky-400 transition-colors cursor-pointer">
            limpar tudo
          </button>
        </div>

        <div class="flex flex-col gap-4 px-4 py-3">
          @for (field of fields(); track field.key) {
            <div>
              <span class="text-white/35 text-[11px] block mb-2">{{ field.label }}</span>

              @if (field.type === 'chips' && field.options) {
                <div class="flex flex-wrap gap-1.5">
                  @for (opt of field.options; track opt) {
                    <button (click)="toggleChip(field.key, opt)"
                            class="text-[11px] px-2.5 py-1 rounded-full border transition-colors cursor-pointer"
                            [class]="isChipActive(field.key, opt)
                              ? 'bg-sky-400/15 border-sky-400/30 text-sky-400'
                              : 'border-white/10 text-white/40 hover:border-white/20 hover:text-white/60'">
                      {{ opt }}
                    </button>
                  }
                </div>
              }

              @if (field.type === 'text') {
                <input type="text"
                       [placeholder]="'Buscar por ' + field.label.toLowerCase() + '...'"
                       [value]="getTextValue(field.key)"
                       (input)="onTextInput(field.key, $event)"
                       class="w-full bg-white/5 border border-white/8 rounded-lg px-3 py-1.5
                              text-white/60 text-xs placeholder-white/25
                              focus:outline-none focus:border-sky-400/40 transition-colors" />
              }
            </div>
          }
        </div>

        <div class="flex gap-2 px-4 py-3 border-t border-white/[.06]">
          <button (click)="cancel()"
                  class="flex-1 py-2 rounded-lg bg-white/5 text-white/40 text-xs
                         hover:bg-white/10 transition-colors cursor-pointer">
            Cancelar
          </button>
          <button (click)="applyFilter()"
                  class="flex-1 py-2 rounded-lg bg-sky-400/20 text-sky-400 text-xs
                         hover:bg-sky-400/30 transition-colors cursor-pointer">
            Aplicar {{ activeCount() > 0 ? '(' + activeCount() + ')' : '' }}
          </button>
        </div>
      </div>
    }
  `
})
export class FilterDropdownComponent {
  private readonly el = inject(ElementRef);

  readonly fields  = input.required<FilterField[]>();
  readonly applied = output<FilterState>();
  readonly cleared = output<void>();

  readonly isOpen   = signal(false);
  readonly _current = signal<FilterState>({});

  dropdownTop  = 0;
  dropdownLeft = 0;

  readonly hasActiveFilters = computed(() =>
    Object.values(this._current()).some(v => Array.isArray(v) ? v.length > 0 : v !== '')
  );

  readonly activeCount = computed(() =>
    Object.values(this._current()).reduce((acc: number, v) =>
      acc + (Array.isArray(v) ? v.length : v ? 1 : 0), 0)
  );

  toggleOpen(): void {
    if (!this.isOpen()) {
      const rect = this.el.nativeElement.getBoundingClientRect();
      this.dropdownTop  = rect.bottom + 8;
      this.dropdownLeft = rect.left;
    }
    this.isOpen.update(v => !v);
  }

  toggleChip(key: string, value: string): void {
    this._current.update(state => {
      const current = (state[key] as string[] | undefined) ?? [];
      const updated  = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      return { ...state, [key]: updated };
    });
  }

  isChipActive(key: string, value: string): boolean {
    const current = this._current()[key];
    return Array.isArray(current) && current.includes(value);
  }

  getTextValue(key: string): string {
    const v = this._current()[key];
    return typeof v === 'string' ? v : '';
  }

  onTextInput(key: string, event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this._current.update(state => ({ ...state, [key]: value }));
  }

  applyFilter(): void {
    this.applied.emit(this._current());
    this.isOpen.set(false);
  }

  cancel(): void { this.isOpen.set(false); }

  clear(): void {
    this._current.set({});
    this.cleared.emit();
    this.applied.emit({});
  }
}
