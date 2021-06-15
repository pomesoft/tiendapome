import { Subcategoria, Medida } from './subcategoria';
import { ListaPrecio } from './listaPrecio';

export class Producto {
    constructor(
        public Id: number,
        public Codigo: string,
        public Descripcion: string,
        public Subcategoria: Subcategoria,
        public Peso: number,
        public ListaPrecio: ListaPrecio,
        public Ubicacion: number,
        public Stock: number,
        public Foto: string,
        public Path: string,
        public CantidadPedido: number,
        public IdTipo?: number,
        public IdCategoria?: number,
        public DescripcionTipo?: string,
        public DescripcionCategoria?: string,
        public DescripcionSubcategoria?: string,
        public TipoPrecio?: number,
        public PrecioUnitario?: number,
        public PrecioPorPeso?: boolean,
        public PrecioPorPieza?: boolean,
        public PrecioUnitarioFinal?: number,
        public ProductoPedido?: boolean,
        public MonedaVenta?: string,
        public FotoLink?: string,
        public MostrarMedidas?: boolean,
        public ObservacionesPedido?: string,
        public StockReal?: number,
        public StockReservado?: number,
        public ProductoStock?: Array<ProductoStock>,
        public IdDocumentoVenta?: number,
        public GrupoOrden?: ProductoGrupoOrden,
        public PrecioUnitarioFinalSinDescuento?: number
    ) {
        this.ProductoStock = new Array<ProductoStock>()
        this.Stock = 0;
        this.StockReal = 0;
        this.StockReservado = 0;
        this.GrupoOrden = new ProductoGrupoOrden();
    }
}

export class ProductoList {
    TotalFilas: number;
    Productos: Producto[];
    constructor() { }
}

export class ProductoStock {

    public Id: number;
    public IdProducto: number;
    public Medida: Medida;
    public Stock: number;
    public Reservado: number;
    public CantidadPedido: number;
    public StockDisponible: number;

    constructor() {
        this.Medida = new Medida();
    }
}


export class ProductoGrupoOrden {
    public Id: number;
    public Descripcion: string;
    public Vigente: boolean;
    constructor() {
        this.Id = -1;
    }
}

export class TipoMovimientoStock {
    public Id: number;
    public Descripcion: string;
    public Vigente: boolean;
    public Tipo: number;
    constructor() {
        this.Id = -1;
    }
}

export class ProductoStockMovimiento {
    public Id: number;
    public Descripcion: string;
    public IdProductoStock: number;
    public Fecha: Date;
    public TipoMovimiento: TipoMovimientoStock;
    public Cantidad: number;
    public Observaciones: string;
    constructor() {
        this.Id = -1;
        this.IdProductoStock = -1;
        this.TipoMovimiento = new TipoMovimientoStock();
        this.Cantidad = 0;
    }
}



export class MovimientoStockDetalle {
    public Id: number;
    public Tipo: string;
    public Categoria: string;
    public Subcategoria: string;
    public Codigo: string;
    public IdProductoStock: string;
    public Orden: string;
    public Movimiento: string;
    public Fecha: string;
    public Pedido: string;
    public Observaciones: string;
    public IdMedida: string;
    public Medida: string;
    public Cantidad: string;

    constructor() {
        this.Id = -1;
    }
}


