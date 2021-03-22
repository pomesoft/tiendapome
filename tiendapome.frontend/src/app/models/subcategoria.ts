import { Categoria } from './categoria';

export class Subcategoria {

    Id: number;
    Descripcion: string;
    Vigente: boolean;
    Categoria: Categoria
    Carpeta: string;
    CantidadProductos: number;
    MostrarMedidas: boolean;
    Orden: number;
    Visible: boolean;
    Medidas: Array<SubcategoriaMedida>;
    DescripcionFull: string;
    IdCategoria: number;

    constructor(
        _id: number
    ) {
        this.Id = _id;
        this.Medidas = new Array<SubcategoriaMedida>();
    }
}

export class Medida {
    public Id: number;
    public Descripcion: string;
    public Observaciones: string;
    public Vigente: boolean;
    public IdDescripcion: string;
    public Chequed: boolean;
    constructor() { }
}

export class SubcategoriaMedida {
    Id: number;
    Medida: Medida;
    constructor() {
        this.Medida = new Medida();
    }
}