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
        public GrupoOrden?: ProductoGrupoOrden
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



