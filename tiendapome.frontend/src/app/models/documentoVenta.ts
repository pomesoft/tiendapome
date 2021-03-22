import { Cliente } from './cliente';

export class DocumentoVenta {
    Id: number;
    IdEmpresa: number;
    Usuario: Cliente;
    Cliente: Cliente;
    IdPedido: number;
    NumeroPedido: number;
    TipoComprobante: VentaTipoComprobante;
    Letra: string;
    Sucursal: number;
    Numero: number;
    Fecha: Date;
    Vencimiento: Date;
    Gravado: number;
    Descuento: number;
    PorcentajeIVA: number;
    IVA: number;
    Total: number;
    Pendiente: number;
    Comision: number;
    Efectivo: number;
    EfectivoCotizaDolar: number;
    Dolares: number;
    DolaresCotizaDolar: number;
    Euros: number;
    EurosCotizaDolar: number;
    Cheques: number;
    ChequesCotizaDolar: number;
    Tarjeta: number;
    TarjetaCotizaDolar: number;
    MercadoPago: number;
    MercadoPagoCotizaDolar: number;
    DepositoTransferencia: number;
    DepositoTransferCotizaDolar: number;
    RetencionIVA: number;
    RetencionGanancia: number;
    RetencionIngBrutos: number;
    Anulado: boolean;
    Items: Array<DocumentoVentaItem>;
    Observaciones: DocumentoVentaObservaciones;
    
    DiasVencido:number;

    Debe: number;
    Haber: number;
    Saldo: number;

    constructor() {
        this.Id = -1;
        this.Usuario = new Cliente();
        this.Cliente = new Cliente();
        this.TipoComprobante = new VentaTipoComprobante();
        this.Items = new Array<DocumentoVentaItem>();
        this.Observaciones = new DocumentoVentaObservaciones();
        this.Numero = 0;
        this.Gravado = 0;
        this.Descuento = 0;
        this.Total = 0;
        this.Fecha = new Date();
        this.Vencimiento = new Date();

    }
}


export class DocumentoVentaItem {
    Id: number;
    IdVenta: number;
    NroItem: number;
    IdProductoStock: number;
    IdPedidoItemProducto: number;
    Descripcion: string;
    Cantidad: number;
    PrecioUnitario: number;
    Precio: number;

    constructor() {
        this.Id = -1;
        this.IdVenta = -1;
        this.NroItem = -1;
    }
}


export class DocumentoVentaObservaciones {
    Id: number;
    IdVenta: number;
    Observaciones: string;
    Adjunto: string;
    AdjuntoLink: string;

    constructor() {
        this.Id = -1;
        this.IdVenta = -1;
    }
}


export class DocumentoVentaList {
    TotalFilas: number;
    DocumentosVenta: DocumentoVenta[];
    constructor() { }
}


export class VentaTipoComprobante {
    Id: number;
    Descripcion: string;
    Vigente: boolean;
    Abreviado: string;
    EsDebe: boolean;

    constructor() {
        this.Id = -1;
    }
}
