import { Categoria } from './categoria';

export class Tipo {
    Id: number;
    Descripcion: string;
    Vigente: boolean;
    Carpeta: string;
    Foto: string;
    Visible: boolean;
    Orden: number;
    Categorias: Array<Categoria>;
    CantidadProductos: number;
    
    constructor(
        _id: number
    ) { 
        this.Id = _id;
    }
}