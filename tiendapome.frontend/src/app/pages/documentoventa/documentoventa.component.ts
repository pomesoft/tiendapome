import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Observable, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, tap, switchMap } from 'rxjs/operators';
import { NotifierService } from 'node_modules/angular-notifier';

import { AutenticaService } from '../../services/autentica.service';
import { ClienteService } from '../../services/cliente.service';
import { DocumentoVentaService } from '../../services/venta.service';
import { PedidoService } from 'src/app/services/pedido.service';
import { ProductoServices } from '../../services/producto.services';
import { ParametroServices } from '../../services/parametro.services';

import { Cliente } from '../../models/cliente';
import { DocumentoVenta, DocumentoVentaItem, DocumentoVentaList, VentaTipoComprobante } from '../../models/documentoVenta';
import { Pedido, PedidoList } from '../../models/pedido';
import { Producto, ProductoList, ProductoStock } from '../../models/producto';


declare var $: any;

@Component({
    selector: 'app-documentoventa',
    templateUrl: './documentoventa.component.html',
    styleUrls: ['./documentoventa.component.css']
})
export class DocumentoventaComponent implements OnInit {


    public IdTipoComprobante: number = -1;
    public IdDocumentoVenta: number = -1;

    public titulo: string = 'Nota de Pedido';

    public procesando: boolean = false;

    public usuarioLogin: Cliente;

    public clienteSeleccionado: Cliente;
    public searching: boolean = false;
    public searchFailed: boolean = false;

    public pedidosFinalizados: Array<Pedido>;

    public itemsNP: Array<DocumentoVentaItem>;

    public docVenta: DocumentoVenta;
    public docVentaItem: DocumentoVentaItem;

    public tipoComprobante: VentaTipoComprobante;

    public MensajeUsuario: string = '';
    public TextoBotonMensajeUsuario: string = '';
    public MensajeUsuario_OK: boolean = true;

    public NumeroDocumento: string = '';
    public NumeroPedidoFacturado: string = '';
    public HabilitarSeleccionPedidos: boolean = true;
    public HabilitarSeleccionProductos: boolean = true;

    public textoConfirmaEliminarItem: string = '';

    public codigoProducto: string = '';
    public productoSeleccionado: Producto;

    public listadoClientes: Array<Cliente>;

    public monedaVenta: string = '';

    constructor(
        private _router: Router,
        private _route: ActivatedRoute,
        private _autenticaServices: AutenticaService,
        private _documentoVentaService: DocumentoVentaService,
        private _clienteService: ClienteService,
        private _pedidoService: PedidoService,
        private _productosServices: ProductoServices,
        private _parametroService: ParametroServices,
        private _notifier: NotifierService
    ) {

    }

    ngOnInit() {

        this._route.params.subscribe((params: Params) => {
            if (params.tipoComprobante)
                this.IdTipoComprobante = +params.tipoComprobante;
            if (params.idDocumentoVenta)
                this.IdDocumentoVenta = +params.idDocumentoVenta;
        });
        
        this.usuarioLogin = this._autenticaServices.getClienteLoguin();
        this.monedaVenta = this._parametroService.getParametro_MonedaVenta();

        this.docVentaItem = new DocumentoVentaItem();
        this.pedidosFinalizados = new Array<Pedido>()
        this.inicializarControles();

    }

    async inicializarControles() {

        await this.getClientes()
            .then(result => {
                return this.getTipoComprobante();

            })
            .then(result => {

                this.tipoComprobante = <VentaTipoComprobante>result;
                return this.getDocumentoVenta();

            })
            .then(result => {

                this.cargarDatos(<DocumentoVenta>result);

            })
            .catch(err => {
                this.showNotification('error', 'Ocurrió un error al cargar la página.');
                console.log(err);
            });
    }


    getTipoComprobante() {
        return new Promise((resolve, reject) => {

            this._documentoVentaService.getTipoComprobante(this.IdTipoComprobante)
                .subscribe(
                    response => { resolve(response); },
                    error => { reject(<any>error); }
                );

        });
    }

    getDocumentoVenta() {
        return new Promise((resolve, reject) => {

            if (this.IdDocumentoVenta == -1) {
                resolve(new DocumentoVenta());

            } else {

                this._documentoVentaService.getDocumentoVenta(this.IdDocumentoVenta).subscribe(
                    response => { resolve(response); },
                    error => { reject(<any>error); }
                );

            }
        });
    }

    getClientes() {
        return new Promise<void>((resolve, reject) => {

            this._clienteService
                .getClientes()
                .subscribe(
                    (response: Array<Cliente>) => {

                        if (response) {
                            this.listadoClientes = response;
                        }
                        resolve();

                    },
                    error => { reject(<any>error); }
                );
        });
    }


    buscarCliente = (text$: Observable<string>) =>
        text$.pipe(
            debounceTime(300),
            distinctUntilChanged(),
            tap(() => this.searching = true),
            switchMap(term =>

                this.buscarClientes(term).pipe(
                    tap(() => this.searchFailed = false),
                    catchError(() => {
                        this.searchFailed = true;
                        return of([]);
                    }))
            ),
            tap(() => this.searching = false)
        )

    formatterCliente = (item: Cliente) => item.ClienteList;


    buscarClientes(
        buscar: string
    ): Observable<any> {
        const lc = of(this.listadoClientes.filter(item => {
            return (item.NombreFantasia != null && item.NombreFantasia.toLowerCase().includes(buscar.toLowerCase()))
                || (item.Apellido != null && item.Apellido.toLowerCase().includes(buscar.toLowerCase()))
                || (item.Nombre != null && item.Nombre.toLowerCase().includes(buscar.toLowerCase()))
                || item.Codigo.toLowerCase().includes(buscar.toLowerCase())
                || item.Email.toLowerCase().includes(buscar.toLowerCase());
        }));

        return lc;
    }


    onClickVolver(
        event: any
    ) {
        event.preventDefault();

        this._router.navigate(['/ventaslist/true']);
    }

    onClickAgregarItem(
        event: any
    ) {
        event.preventDefault();
        this.docVentaItem = new DocumentoVentaItem();

        $('#modalItemManual').modal('show');
    }


    onClickEditarItem(
        event: any,
        item: DocumentoVentaItem
    ) {
        event.preventDefault();
        this.docVentaItem = item;

        $('#modalItemManual').modal('show');
    }

    onClickEliminarItem(
        event: any,
        item: DocumentoVentaItem
    ) {
        event.preventDefault();
        this.docVentaItem = item;

        this.textoConfirmaEliminarItem = '¿Desea eliminar el ítem: ' + this.docVentaItem.Descripcion + '?';

        $('#modalConfirmaEliminarItem').modal('show');

    }


    EliminarItemPedido(
        event: any
    ) {
        if (this.docVentaItem != null && this.docVentaItem.Descripcion.trim().length > 0 && this.docVentaItem.Precio > 0) {

            this._documentoVentaService.deleteItemNotaPedido(this.docVentaItem).subscribe(
                response => {
                    if (response) {

                        this.cargarDatos(response);
                        this.showNotification('success', 'El ítem se eliminó correctamente.');
                        $('#modalConfirmaEliminarItem').modal('hide');

                    }
                },
                error => {
                    this.procesando = false;
                    this.showNotification('error', 'Ocurrió un error al actualizar la Nota de Pedido.');
                    console.log(<any>error);
                }
            );
        }
    }


    cargarDatos(
        _docVenta: DocumentoVenta
    ) {
        this.docVenta = _docVenta;

        if (this.docVenta.Id == -1 && sessionStorage.getItem("lv_ClienteSeleccionado")) {
            this.docVenta.Cliente = JSON.parse(sessionStorage.getItem("lv_ClienteSeleccionado"));
        }

        //Si se esta creando el documento se asigna el tipo que se recibe como parametro
        if (this.docVenta.TipoComprobante.Id == -1) {
            this.docVenta.TipoComprobante = this.tipoComprobante;
        }

        console.log('cargarDatos() => this.docVenta', this.docVenta);

        this.titulo = this.docVenta.TipoComprobante.Descripcion;
        this.clienteSeleccionado = this.docVenta.Cliente;
        this.NumeroDocumento = this.formatNumero(this.docVenta.Numero);

        if (this.docVenta.NumeroPedido)
            this.NumeroPedidoFacturado = this.formatNumero(this.docVenta.NumeroPedido);
        else
            this.NumeroPedidoFacturado = '';

        //la seleccion de pedidos se habilita solo para NOTA DE PEDIDO y si no se selecciono ningun pedido aun   
        this.HabilitarSeleccionPedidos = this.docVenta.TipoComprobante.Id == 1 && this.NumeroPedidoFacturado == '';

        //la seleccion de productos se habilita solo para NOTA DE PEDIDO y NOTA DE CREDITO
        this.HabilitarSeleccionProductos = this.docVenta.TipoComprobante.Id < 3;

    }


    onClickGuardarItem(
        event: any
    ) {
        event.preventDefault();

        if (this.docVentaItem.Descripcion.trim().length > 0 && this.docVentaItem.Precio > 0) {

            if (!this.docVenta.Items) this.docVenta.Items = new Array<DocumentoVentaItem>();

            this.docVentaItem.IdVenta = this.docVenta.Id;
            if (this.docVentaItem.NroItem <= 0)
                this.docVentaItem.NroItem = this.docVenta.Items.length + 1;

            if (this.docVentaItem.Id == -1)
                this.docVenta.Items.push(this.docVentaItem);

            this._documentoVentaService.saveDocVenta(this.docVenta).subscribe(
                response => {
                    this.procesando = false;
                    if (response) {

                        this.cargarDatos(response);
                        this.showNotification('success', 'La Nota de Pedido se actualizó correctamente.');
                        $('#modalItemManual').modal('hide');

                    }
                },
                error => {
                    this.procesando = false;
                    this.showNotification('error', 'Ocurrió un error al actualizar la Nota de Pedido.');
                    console.log(<any>error);
                }
            );

        }

    }

    onClickGuardarItemProducto(
        event: any
    ) {
        event.preventDefault();

        this.procesando = true;
        if (this.productoSeleccionado) {

            this.productoSeleccionado.IdDocumentoVenta = this.docVenta.Id;

            this._documentoVentaService.saveNotaPedidoFacturarProducto(this.productoSeleccionado).subscribe(
                response => {
                    this.procesando = false;
                    if (response) {

                        this.cargarDatos(response);
                        this.showNotification('success', 'La Nota de Pedido se actualizó correctamente.');
                        $('#modalItemProducto').modal('hide');

                    }
                },
                error => {
                    this.procesando = false;
                    this.showNotification('error', 'Ocurrió un error al actualizar la Nota de Pedido.');
                    console.log(<any>error);
                }
            );

        }

    }

    calcularTotales() {
        this.docVenta.Gravado = 0;
        this.docVenta.Total = 0;
        if (!this.docVenta.Descuento) this.docVenta.Descuento = 0;
        this.docVenta.Items.forEach(item => {
            this.docVenta.Gravado = this.docVenta.Gravado + item.Precio;
        });
        this.docVenta.Total = this.docVenta.Gravado - this.docVenta.Descuento;
    }

    onModelChangeCalcularTotalItem() {
        if (this.docVentaItem.Cantidad > 0 && this.docVentaItem.PrecioUnitario > 0) {

            this.docVentaItem.Precio = this.docVentaItem.Cantidad * this.docVentaItem.PrecioUnitario;

        }
    }

    onClickGuardar(
        event: any
    ) {
        event.preventDefault();

        if (this.clienteSeleccionado.Id <= 0) {
            this.showNotification('warning', 'Debe indicar cliente.');
            return;
        }

        this.procesando = true;

        //this.docVenta.IdTipoComprobanteGenerar = 1; // 1 - Nota de Pedido
        this.docVenta.Usuario = this.usuarioLogin;
        this.docVenta.Cliente = this.clienteSeleccionado;
        this.guardarDocVenta();

    }

    guardarDocVenta() {

        this._documentoVentaService.saveDocVenta(this.docVenta).subscribe(
            response => {
                this.procesando = false;
                if (response) {

                    this.MensajeUsuario_OK = true;
                    this.showNotification('success', 'La Nota de Pedido se actualizó correctamente.');

                    if (this.IdDocumentoVenta <= 0) {
                        this._router.navigate(['/documentoventa/' + this.IdTipoComprobante + '/' + response.Id]);
                    } else {
                        this.cargarDatos(response);
                    }

                }
            },
            error => {
                this.procesando = false;
                this.showNotification('error', 'Ocurrió un error al actualizar la Nota de Pedido.');
                console.log(<any>error);
            }
        );
    }

    onClickImprimir(
        event: any
    ) {
        event.preventDefault();
        this._documentoVentaService.printNotaPedido(this.docVenta.Id);
    }

    onClickAgregarItemsPedido(
        event: any
    ) {
        event.preventDefault();

        if (this.clienteSeleccionado) {

            this._pedidoService
                .getPedidosListPaginado('4', this.clienteSeleccionado.Id, '', '', 1, 20)
                .subscribe(
                    (response: PedidoList) => {
                        if (response) {
                            this.pedidosFinalizados = response.Pedidos;
                            $('#modalItemPedido').modal('show');
                        }
                    },
                    error => {
                        this.showNotification('error', 'Ocurrió un error al consultar pedidos finalizados del cliente.');
                        console.log(<any>error);
                    }
                );

        }
    }



    onClickAgregarItemsProducto(
        event: any
    ) {
        event.preventDefault();
        this.codigoProducto = '';
        this.docVentaItem = new DocumentoVentaItem();
        this.productoSeleccionado = null;

        console.log('onClickAgregarItemsProducto()');

        $('#modalItemProducto').modal('show');
    }

    busquedaProducto(
        event: any
    ) {
        this.procesando = true;
        this.productoSeleccionado = null;
        console.log('busquedaProducto() => codigoProducto: ', this.codigoProducto);
        if (this.codigoProducto != '' && this.clienteSeleccionado) {
            this._productosServices.getProductoCodigo(true, this.codigoProducto, this.clienteSeleccionado.Id)
                .subscribe(
                    (response: Producto) => {
                        if (response)
                            this.productoSeleccionado = response;
                        this.procesando = false;
                    },
                    error => {
                        this.procesando = false;
                        if (error.status == 404)
                            this.showNotification('warning', 'No existe el producto buscado.');
                        else
                            this.showNotification('error', 'No se pudo realizar la búsqueda.');
                        console.error(error);
                    }
                );
        }
    }

    sumaCantidadPorMedida(
        event: any,
        prodStock: ProductoStock
    ) {
        event.preventDefault();
        prodStock.CantidadPedido++;
    }

    restaCantidadMedida(
        event: any,
        prodStock: ProductoStock
    ) {
        event.preventDefault();
        if (prodStock.CantidadPedido > 0)
            prodStock.CantidadPedido--;
    }



    onClickGuardarItemsPedido(
        event: any,
        pedido: Pedido
    ) {
        event.preventDefault();

        this.procesando = true;
        this.docVenta.IdPedido = pedido.Id;

        this._documentoVentaService.saveNotaPedidoFacturarPedido(this.docVenta).subscribe(
            response => {
                this.procesando = false;
                if (response) {

                    this.cargarDatos(response);
                    this.MensajeUsuario_OK = true;
                    this.showNotification('success', 'La Nota de Pedido se actualizó correctamente.');

                }
            },
            error => {
                this.procesando = false;
                this.showNotification('error', 'Ocurrió un error al actualizar la Nota de Pedido.');
                console.log(<any>error);
            }
        );
        $('#modalItemPedido').modal('hide');
    }





    formatNumero(text: number): string {
        let padChar: string = '0';
        let size: number = 5;
        return (String(padChar).repeat(size) + text.toString()).substr((size * -1), size);
    }


    public showNotification(type: string, message: string): void {
        this._notifier.notify(type, message);
    }
    public hideOldestNotification(): void {
        this._notifier.hideOldest();
    }

}
