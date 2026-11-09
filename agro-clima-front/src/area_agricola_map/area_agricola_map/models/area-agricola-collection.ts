import { AreaAgricola, AreaAgricolaProps } from "./area-aricola";


export class AreaAgricolaCollection {
    constructor (
        private areas: AreaAgricola[]
    ) {}

    public toGeojsonFeatureCollection(): GeoJSON.FeatureCollection<GeoJSON.MultiPolygon | GeoJSON.Polygon, Omit<AreaAgricolaProps, 'geometria'>> {
        return {
            type: "FeatureCollection",
            features: this.areas.map(area => area.toGeojsonFeature())
        }
    }
}