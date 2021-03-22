import { Producto } from './producto';
import { Cliente } from './cliente';
import { Medida } from './subcategoria';

export class Pedido {
    _id: string;
    Id: number;
    Numero: number;
    Fecha: string;
    Cliente: Cliente;
    Observaciones: string;
    Estado: Estado;
    Total: number;
    CantidadItems: number;
    Porcentaje: number;
    Moneda: string;
    CompraMinima: number;
    Items: Array<PedidoItem>;
    IdPedidoProveedor: number;
    NumeroPedidoProveedor: number;
    IdPedidoMinorista: number;
    NumeroPedidoMinorista: number;

    constructor() {
        this.Items = new Array<PedidoItem>();
        this.CompraMinima = -1;
    }
}

export class PedidoItem {
    Id: number;
    IdPedido: number;
    Producto: Producto;
    Precio: number;
    Cantidad: number;
    Porcentaje: number;
    Subtotal: number;
    EstadoItem: number;
    Observaciones: string;
    StockDisponible: number;
    MostrarMedidas: boolean;
    Confirmado: boolean;
    SinStock: boolean;
    Modificado: boolean;
    ItemProductos: Array<PedidoItemProducto>;
    StockReservado: boolean;

    constructor() {
        this.Modificado = false;
        this.ItemProductos = new Array<PedidoItemProducto>();
        this.StockReservado = false;
    }
}


export class Estado {
    Id: number;
    Descripcion: string;
    Vigente: boolean;
    Chequed: boolean;

    constructor() { }
}


export class PedidoList {
    TotalFilas: number;
    Pedidos: Pedido[];
    constructor() { }
}


export class PedidoItemProducto {
    Id: number;
    IdPedidoItem: number;
    IdProductoStock: number;
    Medida: Medida;
    Cantidad: number;
    IdEstadoItem: number;
    constructor() { }
}