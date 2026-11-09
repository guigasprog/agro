import { computed, Injectable, signal, NgZone, inject } from "@angular/core";
import * as M from 'maplibre-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { AreaAgricola } from "./models/area-aricola";


import { MapboxDrawStyles } from './mapbox-draw-styles';

// @ts-ignore
if (M.setWorkerUrl) {
    M.setWorkerUrl('/assets/maplibre-gl-worker.js');
}

import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AreaAgricolaMapService {
    private mapa = signal<M.Map | undefined>(undefined);
    public readonly areaClicada$ = new Subject<string>();

    // Subjects to notify form
    public readonly geometriaDesenhada$ = new Subject<GeoJSON.MultiPolygon | GeoJSON.Polygon | undefined>();
    public readonly editAreaId = signal<string | null>(null);
    public readonly hasDrawnGeometry = signal<boolean>(false);
    public readonly isDrawMode = signal<boolean>(false);
    public readonly isFormActive = signal<boolean>(false);

    readonly mapa$ = this.mapa.asReadonly();
    readonly isMapaInitialized = computed(() => this.mapa() !== undefined);

    readonly removeSubject = new Subject<string>();

    private drawControl: MapboxDraw | undefined;
    private ngZone = inject(NgZone);

    public setMapa(htmlDivElement: HTMLDivElement) {
        const map = new M.Map({
            container: htmlDivElement,
            style: {
                version: 8,
                sources: {
                    esri: {
                        type: 'raster',
                        tiles: [
                            'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
                        ],
                        tileSize: 256,
                        attribution: '© Esri'
                    }
                },
                layers: [
                    {
                        id: 'esri-world-imagery',
                        type: 'raster',
                        source: 'esri'
                    }
                ]
            },
            center: [-50.48, -22.65],
            zoom: 14,
            doubleClickZoom: false // disable to allow double click edits without zooming
        });

        this.drawControl = new MapboxDraw({
            displayControlsDefault: false,
            controls: {
                polygon: false,
                trash: false
            },
            styles: MapboxDrawStyles
        });

        map.addControl(this.drawControl as unknown as M.IControl);

        map.on('draw.modechange' as any, (e: any) => {
            this.ngZone.run(() => {
                this.isDrawMode.set(e.mode === 'draw_polygon');
            });
        });

        map.on('draw.create' as any, this.updateGeometria.bind(this));
        map.on('draw.delete' as any, this.updateGeometria.bind(this));
        map.on('draw.update' as any, this.updateGeometria.bind(this));

        this.mapa.set(map);
    }

    public destroyMapa() {
        const map = this.mapa();
        if (map) {
            map.remove();
            this.mapa.set(undefined);
            this.drawControl = undefined;
            this.hasDrawnGeometry.set(false);
            this.isDrawMode.set(false);
        }
    }

    private updateGeometria() {
        if (!this.drawControl) return;
        const data = this.drawControl.getAll();
        this.ngZone.run(() => {
            if (data.features.length > 0) {
                const coords = data.features.filter(f => f.geometry.type === 'Polygon').map(f => (f.geometry as GeoJSON.Polygon).coordinates);
                if (coords.length > 0) {
                    this.hasDrawnGeometry.set(true);
                    this.geometriaDesenhada$.next({
                        type: 'MultiPolygon',
                        coordinates: coords
                    });
                } else {
                    this.hasDrawnGeometry.set(false);
                    this.geometriaDesenhada$.next(undefined);
                }
            } else {
                this.hasDrawnGeometry.set(false);
                this.geometriaDesenhada$.next(undefined);
            }
        });
    }

    public enableDrawMode(geometria?: GeoJSON.MultiPolygon | GeoJSON.Polygon) {
        if (!this.drawControl) return;
        this.drawControl.deleteAll();
        if (geometria) {
            this.hasDrawnGeometry.set(true);
            if (geometria.type === 'MultiPolygon') {
                for (const polyCoords of geometria.coordinates) {
                     this.drawControl.add({
                         type: 'Feature',
                         properties: {},
                         geometry: { type: 'Polygon', coordinates: polyCoords }
                     });
                }
            } else if (geometria.type === 'Polygon') {
                this.drawControl.add({
                    type: 'Feature',
                    properties: {},
                    geometry: geometria
                });
            }
        } else {
            this.hasDrawnGeometry.set(false);
            this.drawControl.changeMode('simple_select');
        }
    }

    public clearDrawAndStart() {
        console.log("...")
        this.removeSubject.next("a")
        if (!this.drawControl) return;
        this.drawControl.deleteAll();
        this.hasDrawnGeometry.set(false);
        this.geometriaDesenhada$.next(undefined);
        this.drawControl.changeMode('simple_select');
    }

    public clearDraw() {
        if (this.drawControl) {
            this.drawControl.changeMode('simple_select');
            this.drawControl.deleteAll();
            this.hasDrawnGeometry.set(false);
        }
    }

    public setMode(mode: string) {
        if (this.drawControl) {
            this.drawControl.changeMode(mode);
            this.isDrawMode.set(mode === 'draw_polygon');
        }
    }

    public flyToArea(areaId: string, mapAreas: AreaAgricola[] | undefined) {
        const map = this.mapa();
        if (!map || !mapAreas) return;

        const area = mapAreas.find(a => a.id === areaId);
        if (!area || !area.geometria) return;

        let geom = area.geometria as any;
        if (typeof geom === 'string') {
            try { geom = JSON.parse(geom); } catch(e) {}
        }
        if (!geom || !geom.coordinates) return;

        let minLng = 180, minLat = 90, maxLng = -180, maxLat = -90;
        let hasValidCoords = false;

        const extractCoords = (array: any[]) => {
            if (array.length >= 2 && !Array.isArray(array[0]) && !Array.isArray(array[1])) {
                const lng = Number(array[0]);
                const lat = Number(array[1]);
                if (!isNaN(lng) && !isNaN(lat)) {
                    if (lng < minLng) minLng = lng;
                    if (lat < minLat) minLat = lat;
                    if (lng > maxLng) maxLng = lng;
                    if (lat > maxLat) maxLat = lat;
                    hasValidCoords = true;
                }
            } else if (Array.isArray(array)) {
                for (const item of array) {
                    if (Array.isArray(item)) {
                        extractCoords(item);
                    }
                }
            }
        };

        extractCoords(geom.coordinates);

        if (hasValidCoords) {
            map.fitBounds([
                [minLng, minLat],
                [maxLng, maxLat]
            ], { padding: 50, duration: 1500 });
        }
    }
}
