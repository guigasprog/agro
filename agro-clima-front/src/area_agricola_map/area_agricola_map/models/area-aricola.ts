

export type AreaAgricolaProps = {
    id: string,
    geometria: GeoJSON.MultiPolygon | GeoJSON.Polygon,
    nome: string,
    cidade: string | undefined | null,
    estado: string | undefined | null,
    hectares: number
}

export class AreaAgricola {

    constructor (private props: AreaAgricolaProps) {}

    get id() { return this.props.id; }
    get geometria() { return this.props.geometria; }
    get nome() { return this.props.nome; }
    get cidade() { return this.props.cidade; }
    get estado() { return this.props.estado; }
    get hectares() { return this.props.hectares; }

    public toGeojsonFeature(): GeoJSON.Feature<GeoJSON.MultiPolygon | GeoJSON.Polygon, Omit<AreaAgricolaProps, 'geometria'>> {
        return {
            id: this.id,
            geometry: this.geometria,
            type: "Feature",
            properties: {
                id: this.id,
                nome: this.nome,
                cidade: this.cidade,
                estado: this.estado,
                hectares: this.hectares
            }
        }
    }

}
