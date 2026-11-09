import { Component, effect, ElementRef, inject, untracked, viewChild, OnDestroy } from "@angular/core";
import { AreaAgricolaMapService } from "./area-agricola-map.service";
import { ListarAreaAgricolaService } from "./listar-area-agricola.service";
import { AreaAgricolaRenderService } from "./area-agricola-render.service";

@Component({
    selector: 'app-area-agricola-map',
    standalone: true,
    template: `
    <div #mapa class="w-full h-full rounded-xl overflow-hidden"></div>
    @if (service.isFormActive()) {
        <div class="absolute top-4 right-4 z-10 flex flex-col gap-2">
            @if (!service.hasDrawnGeometry()) {
                <button type="button" 
                        (click)="toggleDrawMode()" 
                        title="Desenhar Área Agrícola"
                        [class.bg-yellow-400]="service.isDrawMode()"
                        [class.text-slate-900]="service.isDrawMode()"
                        [class.border-yellow-400]="service.isDrawMode()"
                        [class.bg-slate-900]="!service.isDrawMode()"
                        [class.bg-opacity-90]="!service.isDrawMode()"
                        [class.text-white]="!service.isDrawMode()"
                        [class.border-white]="!service.isDrawMode()"
                        [class.border-opacity-10]="!service.isDrawMode()"
                        class="w-11 h-11 backdrop-blur-md border rounded-lg flex items-center justify-center shadow-lg transition-all duration-300 hover:bg-opacity-100 group animate-in fade-in zoom-in-95">
                    <span class="material-symbols-outlined text-[26px] transition-transform duration-300 group-hover:scale-110">
                        polyline
                    </span>
                </button>
            } @else {
                <button type="button" 
                        (click)="service.clearDrawAndStart()" 
                        title="Limpar Desenho"
                        class="w-11 h-11 bg-red-500/10 border border-red-500/20 text-red-400 backdrop-blur-md rounded-lg flex items-center justify-center shadow-lg transition-all duration-300 hover:bg-red-500/30 group animate-in fade-in zoom-in-95">
                    <span class="material-symbols-outlined text-[24px] transition-transform duration-300 group-hover:scale-110">
                        delete
                    </span>
                </button>
            }
        </div>
    }
    `,
    host: { class: 'w-full h-full relative' }
})
export class AreaAgricolaMapComponent implements OnDestroy {
    private readonly listagemService = inject(ListarAreaAgricolaService);
    private readonly renderService = inject(AreaAgricolaRenderService);
    public readonly service = inject(AreaAgricolaMapService);
    private readonly mapa = viewChild('mapa', { read: ElementRef<HTMLDivElement> });

    toggleDrawMode() {
        if (this.service.isDrawMode()) {
            this.service.setMode('simple_select');
        } else {
            this.service.setMode('draw_polygon');
        }
    }

    private onMapInit = effect(() => {
        const divMapa = this.mapa();
        if (!divMapa || this.service.isMapaInitialized()) return;

        untracked(() => this.service.setMapa(divMapa.nativeElement));
        this.listagemService.request().subscribe();
    })

    ngOnDestroy(): void {
        this.service.destroyMapa();
    }
}