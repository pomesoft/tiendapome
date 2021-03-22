import { Subcategoria } from './subcategoria';
import { Tipo } from './tipo';

export class Categoria {
    Id: number;
    Descripcion?: string;
    Vigente: boolean;
    Tipo: Tipo;
    Carpeta: string;
    Foto: string;
    Subcategorias: Array<Subcategoria>;
    CantidadProductos: number;
    Orden: number;
    Visible: boolean;
    IdTipo: number;

    constructor(
        _id: number
    ) { 
        this.Id = _id;
    }
}
