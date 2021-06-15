import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Observable, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, tap, switchMap } from 'rxjs/operators';
import { NotifierService } from 'node_modules/angular-notifier';


import { AutenticaService } from '../../services/autentica.service';
import { ClienteService } from '../../services/cliente.service';
import { DocumentoVentaService } from '../../services/venta.service';
import { PedidoService } from '../../services/pedido.service';
import { ArchivoService } from '../../services/archivo.service';
import { ParametroServices } from '../../services/parametro.services';

import { Cliente } from '../../models/cliente';
import { DocumentoVenta, DocumentoVentaItem, DocumentoVentaList, DocumentoVentaObservaciones, VentaTipoComprobante } from '../../models/documentoVenta';
import { Pedido, PedidoList } from '../../models/pedido';


@Component({
    selector: 'app-recibo',
    templateUrl: './recibo.component.html',
    styleUrls: ['./recibo.component.css']
})
export class ReciboComponent implements OnInit {

    public titulo: string = 'Recibo';

    public procesando: boolean = false;

    public usuarioLogin: Cliente;

    public clienteSeleccionado: Cliente;
    public searching: boolean = false;
    public searchFailed: boolean = false;

    public comprobantesPendientes: Array<DocumentoVenta>;

    public IdDocumenotVenta: number = -1;
    public docVenta: DocumentoVenta;

    public MensajeUsuario: string = '';
    public TextoBotonMensajeUsuario: string = '';
    public MensajeUsuario_OK: boolean = true;

    public NumeroDocumento: string = '';

    public saldoCliente: number = 0;
    public saldoPendiente: number = 0;

    public archivoFoto: Array<File>;

    public monedaVenta: string = '';

    constructor(
        private _router: Router,
        private _route: ActivatedRoute,
        private _autenticaServices: AutenticaService,
        private _documentoVentaService: DocumentoVentaService,
        private _clienteService: ClienteService,
        private _pedidoService: PedidoService,
        private _parametroService: ParametroServices,
        private _archivoService: ArchivoService,
        private _notifier: NotifierService
    ) {

    }

    ngOnInit() {
        this._route.params.subscribe((params: Params) => {
            if (params.idDocumenotVenta)
                this.IdDocumenotVenta = +params.idDocumenotVenta;
        });

        this.usuarioLogin = this._autenticaServices.getClienteLoguin();

        this.comprobantesPendientes = new Array<DocumentoVenta>()
        this.docVenta = new DocumentoVenta();

        this.verificartMonedaVenta();

        this.inicializarControles();
    }


    async inicializarControles() {


        await this.getDocumentoVenta()
            .then(result => {
                this.cargarDatos(<DocumentoVenta>result);
                if (this.docVenta.Total == 0)
                    this.verificartMonedaVenta();
            })
            .catch(err => {
                this.showNotification('error', 'Ocurrió un error al cargar la página.');
                console.log(err);
            });
    }


    getDocumentoVenta() {
        return new Promise((resolve, reject) => {

            if (this.IdDocumenotVenta == -1) {
                resolve(new DocumentoVenta());

            } else {

                this._documentoVentaService.getDocumentoVenta(this.IdDocumenotVenta).subscribe(
                    response => { resolve(response); },
                    error => { reject(<any>error); }
                );

            }
        });
    }


    buscarCliente = (text$: Observable<string>) =>
        text$.pipe(
            debounceTime(300),
            distinctUntilChanged(),
            tap(() => this.searching = true),
            switchMap(term =>

                this._clienteService.searchClientes(term).pipe(
                    tap(() => this.searchFailed = false),
                    catchError(() => {
                        this.searchFailed = true;
                        return of([]);
                    }))
            ),
            tap(() => this.searching = false)
        )

    formatterCliente = (item: Cliente) => item.ClienteList;


    onClickVolver(
        event: any
    ) {
        event.preventDefault();

        this._router.navigate(['/ventaslist/true']);
    }

    cargarDatos(
        _docVenta: DocumentoVenta
    ) {
        this.docVenta = _docVenta;

        if (this.docVenta.Id == -1 && sessionStorage.getItem("lv_ClienteSeleccionado")) {
            this.docVenta.Cliente = JSON.parse(sessionStorage.getItem("lv_ClienteSeleccionado"));
        }

        console.log('cargarDatos() => this.docVenta', this.docVenta);
        this.clienteSeleccionado = this.docVenta.Cliente;
        this.NumeroDocumento = this.formatNumero(this.docVenta.Numero);

        this.getSaldoCliente();
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

        this.docVenta.TipoComprobante.Id = 6;

        this.docVenta.Usuario = this.usuarioLogin;
        this.docVenta.Cliente = this.clienteSeleccionado;

        console.log('this.docVenta', this.docVenta);

        this.guardarDocVenta();

    }

    guardarDocVenta() {
        this._documentoVentaService.saveDocVenta(this.docVenta).subscribe(
            response => {
                this.procesando = false;
                if (response) {

                    if (this.IdDocumenotVenta <= 0) {
                        this._router.navigate(['/recibo/' + response.Id]);
                    } else {
                        this.cargarDatos(response);
                    }

                    this.MensajeUsuario_OK = true;
                    this.showNotification('success', 'El Recibo se actualizó correctamente.');

                }
            },
            error => {
                this.procesando = false;
                this.showNotification('error', 'Ocurrió un error al actualizar el Recibo.');
                console.log(<any>error);
            }
        );
    }

    onClickComprobantesPendientes(
        event: any
    ) {
        event.preventDefault();
        this.getSaldoCliente();
    }

    getSaldoCliente() {
        return new Promise<void>((resolve, reject) => {

            let idCliente: number = -1;

            if (!this.clienteSeleccionado) {
                resolve();
            }
            else {

                this._documentoVentaService
                    .getSaldoIniciaCliente(this.clienteSeleccionado.Id, '')
                    .subscribe(
                        (response: number) => {
                            this.saldoCliente = response;
                            resolve();
                        },
                        error => { reject(<any>error); }
                    );
            }
        });
    }


    esMonedaVentaDolar(): boolean {
        return this.monedaVenta == 'USD';
    }

    verificartMonedaVenta() {

        this.monedaVenta = this._parametroService.getParametro_MonedaVenta();

        if (this.monedaVenta == 'USD') {
            this.docVenta.DolaresCotizaDolar = 1;
            this.docVenta.EfectivoCotizaDolar = 0;
            this.docVenta.ChequesCotizaDolar = 0;
            this.docVenta.TarjetaCotizaDolar = 0;
            this.docVenta.MercadoPagoCotizaDolar = 0;
            this.docVenta.DepositoTransferCotizaDolar = 0;

        } else {
            this.docVenta.DolaresCotizaDolar = 0;
            this.docVenta.EfectivoCotizaDolar = 1;
            this.docVenta.ChequesCotizaDolar = 1;
            this.docVenta.TarjetaCotizaDolar = 1;
            this.docVenta.MercadoPagoCotizaDolar = 1;
            this.docVenta.DepositoTransferCotizaDolar = 1;
        }

    }

    calcularTotales() {

        this.docVenta.Total = 0;

        let _dolares: number = 0;
        if (this.docVenta.Dolares)
            _dolares = (this.docVenta.Dolares * this.docVenta.DolaresCotizaDolar);

        let _efectivo: number = 0;
        if (this.docVenta.Efectivo > 0 && this.docVenta.EfectivoCotizaDolar > 0)
            _efectivo = (this.docVenta.Efectivo / this.docVenta.EfectivoCotizaDolar);

        let _cheques: number = 0;
        if (this.docVenta.Cheques > 0 && this.docVenta.ChequesCotizaDolar > 0)
            _cheques = (this.docVenta.Cheques / this.docVenta.ChequesCotizaDolar);

        let _tarjeta: number = 0;
        if (this.docVenta.Tarjeta > 0 && this.docVenta.TarjetaCotizaDolar > 0)
            _tarjeta = (this.docVenta.Tarjeta / this.docVenta.TarjetaCotizaDolar);

        let _mercadoPago: number = 0;
        if (this.docVenta.MercadoPago > 0 && this.docVenta.MercadoPagoCotizaDolar > 0)
            _mercadoPago = (this.docVenta.MercadoPago / this.docVenta.MercadoPagoCotizaDolar);

        let _deposito: number = 0;
        if (this.docVenta.DepositoTransferencia > 0 && this.docVenta.DepositoTransferCotizaDolar > 0)
            _deposito = (this.docVenta.DepositoTransferencia / this.docVenta.DepositoTransferCotizaDolar);


        this.docVenta.Total = _efectivo + _dolares + _cheques + _tarjeta + _mercadoPago + _deposito

        this.saldoPendiente = this.saldoCliente - this.docVenta.Total;

    }

    formatNumero(text: number): string {
        let padChar: string = '0';
        let size: number = 6;
        return (String(padChar).repeat(size) + text.toString()).substr((size * -1), size);
    }


    fileCapturarEvento(
        fileInput: any
    ) {
        this.archivoFoto = <Array<File>>fileInput.target.files;
        this.docVenta.Observaciones.Adjunto = this.archivoFoto[0].name;

        this._documentoVentaService.saveDocVenta(this.docVenta).subscribe(
            response => {
                this.procesando = false;
                if (response) {

                    this._archivoService.postArchivo('/venta/adjunto', this.archivoFoto[0].name, this.archivoFoto[0])
                        .then(result => {
                            this.inicializarControles();
                        })
                        .catch(err => {
                            this.showNotification('error', 'No se pudo subir la foto.');
                            console.log(err)
                        });


                    this.MensajeUsuario_OK = true;
                    this.showNotification('success', 'El Recibo se actualizó correctamente.');

                }
            },
            error => {
                this.procesando = false;
                this.showNotification('error', 'Ocurrió un error al actualizar el Recibo.');
                console.log(<any>error);
            }
        );

    }


    public showNotification(type: string, message: string): void {
        this._notifier.notify(type, message);
    }
    public hideOldestNotification(): void {
        this._notifier.hideOldest();
    }
}
