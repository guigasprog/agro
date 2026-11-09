import { effect, inject, Injectable, NgZone } from "@angular/core";
import { AreaAgricolaMapService } from "./area-agricola-map.service";
import { ListarAreaAgricolaService } from "./listar-area-agricola.service";
import { AreaAgricolaCollection } from "./models/area-agricola-collection";
import * as M from 'maplibre-gl';
import { FeatureCollection } from "geojson";

@Injectable({ providedIn: 'root' })
export class AreaAgricolaRenderService {
    private readonly listagemAreasService = inject(ListarAreaAgricolaService);
    private readonly mapaService = inject(AreaAgricolaMapService);
    private readonly ngZone = inject(NgZone);

    private readonly AREAS_SOURCE_ID = 'areas-agricolas';
    private readonly AREAS_LAYER_ID = 'areas-agricolas-layer';

    private lastAreas: any = null;
    private lastEditId: string | null = undefined as any;
    private lastIsFormActive: boolean | null = null;

    constructor () {
      this.mapaService.removeSubject.subscribe(async (id) => {
        console.log("Listened")
        await this.removeFeature('1');
      })
    }

    private readonly onListagemAreas = effect(() => {
        const areas = this.listagemAreasService.data();
        const editId = this.mapaService.editAreaId(); // Track to trigger re-render
        const isFormActive = this.mapaService.isFormActive(); // Track to trigger re-render
        if (!this.mapaService.isMapaInitialized()) return;
        this.render(areas, editId, isFormActive);
    })

    // Effect dedicado à visibilidade — mais direto, sem cache, dispara imediatamente
    private readonly onFormActiveVisibility = effect(() => {
        const isFormActive = this.mapaService.isFormActive();
        if (!this.mapaService.isMapaInitialized()) return;
        const mapa = this.mapaService.mapa$()!;
        const visibility = isFormActive ? 'none' : 'visible';
        const applyVisibility = () => {
            if (mapa.getLayer(this.AREAS_LAYER_ID)) {
                mapa.setLayoutProperty(this.AREAS_LAYER_ID, 'visibility', visibility);
            }
            if (mapa.getLayer(this.AREAS_LAYER_ID + '-stroke')) {
                mapa.setLayoutProperty(this.AREAS_LAYER_ID + '-stroke', 'visibility', visibility);
            }
        };
        if (mapa.loaded()) {
            applyVisibility();
        } else {
            mapa.once('load', applyVisibility);
        }
    })

    private render(areas: any[] | null | undefined, editId: string | null, isFormActive: boolean) {
        const areasData = areas ?? [];
        const mapa = this.mapaService.mapa$()!;

        const addOrUpdateData = () => {
            const source = mapa.getSource(this.AREAS_SOURCE_ID) as M.GeoJSONSource;
            const layerVisibility = isFormActive ? 'none' : 'visible';

            if (source) {
                if (this.lastAreas !== areas || this.lastEditId !== editId || this.lastIsFormActive !== isFormActive) {
                    const areasToRender = isFormActive ? [] : areasData;
                    const geojson = new AreaAgricolaCollection(areasToRender).toGeojsonFeatureCollection();
                    source.setData(geojson);

                    // Garantir visibilidade correta das layers
                    if (mapa.getLayer(this.AREAS_LAYER_ID)) {
                        mapa.setLayoutProperty(this.AREAS_LAYER_ID, 'visibility', layerVisibility);
                    }
                    if (mapa.getLayer(this.AREAS_LAYER_ID + '-stroke')) {
                        mapa.setLayoutProperty(this.AREAS_LAYER_ID + '-stroke', 'visibility', layerVisibility);
                    }

                    this.lastAreas = areas;
                    this.lastEditId = editId;
                    this.lastIsFormActive = isFormActive;
                }
            } else {
                const areasToRender = isFormActive ? [] : areasData;
                const geojson = new AreaAgricolaCollection(areasToRender).toGeojsonFeatureCollection();

                mapa.addSource(this.AREAS_SOURCE_ID, {
                    type: 'geojson',
                    data: geojson
                });

                const layerFill: any = {
                    id: this.AREAS_LAYER_ID,
                    type: 'fill',
                    source: this.AREAS_SOURCE_ID,
                    layout: { visibility: layerVisibility },
                    paint: {
                        'fill-color': '#ffffff',
                        'fill-opacity': 0.45
                    }
                };
                mapa.addLayer(layerFill);

                const layerStroke: any = {
                    id: this.AREAS_LAYER_ID + '-stroke',
                    type: 'line',
                    source: this.AREAS_SOURCE_ID,
                    layout: { visibility: layerVisibility },
                    paint: {
                        'line-color': '#ffffff',
                        'line-width': 2
                    }
                };
                mapa.addLayer(layerStroke);

                this.lastAreas = areas;
                this.lastEditId = editId;
                this.lastIsFormActive = isFormActive;

                mapa.on('dblclick', this.AREAS_LAYER_ID, (e) => {
                    const id = e.features?.[0]?.properties?.['id'];
                    if (id) {
                        this.ngZone.run(() => {
                            this.mapaService.areaClicada$.next(id);
                        });
                    }
                });

                mapa.on('mouseenter', this.AREAS_LAYER_ID, () => {
                    mapa.getCanvas().style.cursor = 'pointer';
                });
                mapa.on('mouseleave', this.AREAS_LAYER_ID, () => {
                    mapa.getCanvas().style.cursor = '';
                });
            }
        };

        if (mapa.loaded()) {
            addOrUpdateData();
        } else {
            mapa.once('load', () => addOrUpdateData());
        }
    }

    public async removeFeature(id: string) {
      const source = this.mapaService.mapa$()?.getSource(this.AREAS_SOURCE_ID) as  M.GeoJSONSource;
      const data = await source.getData() as FeatureCollection<any>;
      console.log(data);
    }
}
