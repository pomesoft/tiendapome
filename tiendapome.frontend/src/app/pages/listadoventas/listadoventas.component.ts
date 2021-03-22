import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Observable, of, pipe } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, filter, map, tap, switchMap } from 'rxjs/operators';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';


import { AutenticaService } from 'src/app/services/autentica.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { DocumentoVentaService } from '../../services/venta.service';

import { Cliente } from '../../models/cliente';
import { DocumentoVenta, DocumentoVentaItem, DocumentoVentaList, VentaTipoComprobante } from '../../models/documentoVenta';
import { ListadoCtaCte } from '../../models/itemListado';


declare var $: any;

@Component({
    selector: 'app-listadoventas',
    templateUrl: './listadoventas.component.html',
    styleUrls: ['./listadoventas.component.css']
})
export class ListadoventasComponent implements OnInit {

    public mostrarPanelBotones: boolean = false;
    public cargando: boolean;

    public numeroPaginaRS: number = 1;
    public totalFilasRS: number;
    public listadoResumenSaldo: Array<ListadoCtaCte>;

    public numeroPaginaCC: number = 1;
    public totalFilasCC: number;
    public listadoCtaCte: Array<DocumentoVenta>;
    public saldoCC: number = 0;
    public ctaCteSinDeuda: boolean = true;
    public saldoInicialClienteCC: number = 0;
    public calculoSaldoClienteCC: number = 0;

    public numeroPaginaCOB: number = 1;
    public totalFilasCOB: number;
    public listadoCobranzas: Array<DocumentoVenta>;
    public saldoCOB: number = 0;

    public numeroPaginaCA: number = 1;
    public totalFilasCA: number;
    public listadoAnulados: Array<DocumentoVenta>;


    public usuarioLogin: Cliente;
    public clienteSeleccionado: Cliente;
    public searching: boolean = false;
    public searchFailed: boolean = false;

    public fechaDesde: NgbDateStruct;
    public fechaHasta: NgbDateStruct;
    public listadoClientes: Array<Cliente>;

    public docVenta_IdTipoComprobante: number;
    public docVenta_IdDocumentoVenta: number;

    public docVentaProcesar: DocumentoVenta;
    public textoConfirmaAnulacion: string = '';

    public procesando: boolean = false;

    constructor(
        private _router: Router,
        private _route: ActivatedRoute,
        private _autenticaServices: AutenticaService,
        private _documentoVentaService: DocumentoVentaService,
        private _clienteService: ClienteService,
        private calendar: NgbCalendar,
        private _notifier: NotifierService

    ) {


    }

    ngOnInit() {

        this.fechaDesde = {
            year: this.calendar.getPrev(this.calendar.getToday(), 'm', 1).year,
            month: this.calendar.getPrev(this.calendar.getToday(), 'm', 1).month,
            day: this.calendar.getPrev(this.calendar.getToday(), 'm', 1).day
        };
        this.fechaHasta = {
            year: this.calendar.getToday().year,
            month: this.calendar.getToday().month,
            day: this.calendar.getToday().day
        };

        this.usuarioLogin = this._autenticaServices.getClienteLoguin();

        this._route.params.subscribe((params: Params) => {
            if (params.cargarListados) {

                this.clienteSeleccionado = JSON.parse(sessionStorage.getItem("lv_ClienteSeleccionado"));
                this.cargarListados();

            } else {
                this.getClientes();
            }
        });
    }

    async cargarListados() {

        this.cargando = true;
        await this.getSaldoInicialCliente()
            .then(result => {
                return this.getCuentaCorriente(this.numeroPaginaCC);
            })
            .then(result => {
                return this.getSaldoActualCliente();
            })
            .then(result => {
                return this.getResumenSaldo(this.numeroPaginaRS);
            })
            .then(result => {
                return this.getCobranzas(this.numeroPaginaCOB);
            })
            .then(result => {
                return this.getComprobantesAnulados(this.numeroPaginaCA);
            })
            .then(result => {
                return this.getClientes();
            })
            .then(result => {
                this.cargando = false;
            })
            .catch(err => {
                this.cargando = false;
                console.log(err);
                this.showNotification('error', 'Ocurrió un error al cargar la página.');
            });
    }

    aplicarFiltros(
        $event: any
    ) {
        $event.preventDefault();
        this.cargarListados();
    }

    getResumenSaldo(pagina: number) {
        debugger;
        return new Promise((resolve, reject) => {

            this._documentoVentaService
                .getResumenSaldoCtaCte()
                .subscribe(
                    (response: Array<ListadoCtaCte>) => {

                        console.log('response', response);

                        if (response) {
                            this.numeroPaginaRS = pagina;
                            this.listadoResumenSaldo = response;
                        }
                        resolve();
                    },
                    error => { reject(<any>error); }
                );
        });
    }


    pageChangeRS(pagina: number) {
        this.getResumenSaldo(pagina);
    }


    getSaldoInicialCliente() {
        return new Promise((resolve, reject) => {

            if (!this.clienteSeleccionado) {
                resolve();
            }
            else {

                let fDesde: string = this.fechaDesde ? this.fechaDesde.year.toString() + '-' + this.fechaDesde.month.toString() + '-' + this.fechaDesde.day.toString() : null;

                this._documentoVentaService
                    .getSaldoIniciaCliente(this.clienteSeleccionado.Id, fDesde)
                    .subscribe(
                        (response: number) => {
                            this.saldoInicialClienteCC = response;
                            this.calculoSaldoClienteCC = this.saldoInicialClienteCC;
                            resolve();
                        },
                        error => { reject(<any>error); }
                    );
            }
        });
    }

    getSaldoActualCliente() {
        return new Promise((resolve, reject) => {

            if (!this.clienteSeleccionado) {
                resolve();
            }
            else {

                this._documentoVentaService
                    .getSaldoIniciaCliente(this.clienteSeleccionado.Id, '')
                    .subscribe(
                        (response: number) => {
                            this.saldoCC = response;
                            this.ctaCteSinDeuda = this.saldoCC <= 0;
                            resolve();
                        },
                        error => { reject(<any>error); }
                    );
            }
        });
    }

    getCuentaCorriente(pagina: number) {
        return new Promise((resolve, reject) => {

            let idCliente: number = -1;

            if (!this.clienteSeleccionado) {
                resolve();
            }
            else {

                idCliente = this.clienteSeleccionado.Id;

                let fDesde: string = this.fechaDesde ? this.fechaDesde.year.toString() + '-' + this.fechaDesde.month.toString() + '-' + this.fechaDesde.day.toString() : null;
                let fHasta: string = this.fechaHasta ? this.fechaHasta.year.toString() + '-' + this.fechaHasta.month.toString() + '-' + this.fechaHasta.day.toString() : null;

                this._documentoVentaService
                    .getDocumentosVentas(-1, idCliente, fDesde, fHasta, -1, -1, -1)
                    .subscribe(

                        (response: DocumentoVentaList) => {
                            if (response) {
                                this.numeroPaginaCC = pagina;
                                this.totalFilasCC = response.TotalFilas;
                                this.listadoCtaCte = response.DocumentosVenta;

                                this.listadoCtaCte.forEach(item => {
                                    item.Debe = item.TipoComprobante.EsDebe ? item.Total : 0;
                                    item.Haber = !item.TipoComprobante.EsDebe ? item.Total : 0;
                                    this.calculoSaldoClienteCC = this.calculoSaldoClienteCC + item.Debe - item.Haber;
                                    item.Saldo = this.calculoSaldoClienteCC;
                                });

                            }
                            resolve();
                        },
                        error => { reject(<any>error); }
                    );
            }
        });
    }

    pageChangeCC(pagina: number) {
        this.getCuentaCorriente(pagina);
    }

    getCobranzas(pagina: number) {
        return new Promise((resolve, reject) => {

            let idCliente: number = -1;
            if (this.clienteSeleccionado)
                idCliente = this.clienteSeleccionado.Id;

            let fDesde: string = this.fechaDesde ? this.fechaDesde.year.toString() + '-' + this.fechaDesde.month.toString() + '-' + this.fechaDesde.day.toString() : null;
            let fHasta: string = this.fechaHasta ? this.fechaHasta.year.toString() + '-' + this.fechaHasta.month.toString() + '-' + this.fechaHasta.day.toString() : null;

            this._documentoVentaService
                .getDocumentosVentas(-1, idCliente, fDesde, fHasta, pagina, 10, 2)
                .subscribe(
                    (response: DocumentoVentaList) => {

                        if (response) {
                            this.numeroPaginaCOB = pagina;
                            this.totalFilasCOB = response.TotalFilas;
                            this.listadoCobranzas = response.DocumentosVenta;

                            this.saldoCOB = 0;

                            this.listadoCobranzas.forEach(item => {
                                this.saldoCOB = this.saldoCOB + item.Total;
                            });
                        }
                        resolve();

                    },
                    error => { reject(<any>error); }
                );
        });
    }

    pageChangeCOB(pagina: number) {
        this.getCobranzas(pagina);
    }


    getComprobantesAnulados(pagina: number) {
        return new Promise((resolve, reject) => {

            let idCliente: number = -1;
            if (this.clienteSeleccionado)
                idCliente = this.clienteSeleccionado.Id;

            let fDesde: string = this.fechaDesde ? this.fechaDesde.year.toString() + '-' + this.fechaDesde.month.toString() + '-' + this.fechaDesde.day.toString() : null;
            let fHasta: string = this.fechaHasta ? this.fechaHasta.year.toString() + '-' + this.fechaHasta.month.toString() + '-' + this.fechaHasta.day.toString() : null;

            this._documentoVentaService
                .getDocumentosVentas(-1, idCliente, fDesde, fHasta, pagina, 10, 3)
                .subscribe(
                    (response: DocumentoVentaList) => {

                        if (response) {
                            this.numeroPaginaCA = pagina;
                            this.totalFilasCA = response.TotalFilas;
                            this.listadoAnulados = response.DocumentosVenta;

                        }
                        resolve();
                    },
                    error => { reject(<any>error); }
                );
        });
    }

    getClientes() {
        return new Promise((resolve, reject) => {

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

    pageChangeCA(pagina: number) {
        this.getComprobantesAnulados(pagina);
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
        const lc = of(this.listadoClientes.filter(item=>{
            return (item.NombreFantasia!=null && item.NombreFantasia.toLowerCase().includes(buscar.toLowerCase()))
                || (item.Apellido!=null && item.Apellido.toLowerCase().includes(buscar.toLowerCase()))
                || (item.Nombre!=null && item.Nombre.toLowerCase().includes(buscar.toLowerCase()))
                || item.Codigo.toLowerCase().includes(buscar.toLowerCase())
                || item.Email.toLowerCase().includes(buscar.toLowerCase());
        }));

        return lc;
    }


    mostrarOcultarPanelBotones(
        $event: any
    ) {
        $event.preventDefault();
        this.mostrarPanelBotones = !this.mostrarPanelBotones;
    }

    onClickNotaPedido(
        event: any
    ) {
        event.preventDefault();
        this.guardarFiltros();
        this._router.navigate(['/documentoventa/1']);
    }

    onClickNotaCredito(
        event: any
    ) {
        event.preventDefault();
        this.guardarFiltros();
        this._router.navigate(['/documentoventa/2']);
    }

    onClickRecibo(
        event: any
    ) {
        event.preventDefault();
        this.guardarFiltros();
        this._router.navigate(['/recibo/']);
    }

    onClickAjustePositivo(
        event: any
    ) {
        event.preventDefault();
        this.guardarFiltros();
        this._router.navigate(['/documentoventa/4']);
    }
    onClickAjusteNegativo(
        event: any
    ) {
        event.preventDefault();
        this.guardarFiltros();
        this._router.navigate(['/documentoventa/5']);
    }

    verComprobante(
        event: any,
        item: DocumentoVenta
    ) {
        event.preventDefault();

        this.guardarFiltros();

        if (item.TipoComprobante.Id === 6)
            this._router.navigate(['/recibo/' + item.Id]);
        else
            this._router.navigate(['/documentoventa/' + item.TipoComprobante.Id + '/' + item.Id]);
    }

    imprimirComprobante(
        event: any,
        item: DocumentoVenta
    ) {
        event.preventDefault();
        if (item.TipoComprobante.Id != 6)
            this._documentoVentaService.printNotaPedido(item.Id);
    }

    guardarFiltros() {
        if (this.clienteSeleccionado)
            sessionStorage.setItem("lv_ClienteSeleccionado", JSON.stringify(this.clienteSeleccionado));
        else
            sessionStorage.removeItem("lv_ClienteSeleccionado");
    }

    formatNumero(text: number) {
        let padChar: string = '0';
        let size: number = 5;
        return (String(padChar).repeat(size) + text.toString()).substr((size * -1), size);
    }


    estaVencido(
        item: DocumentoVenta
    ) {
        return item.DiasVencido > 15;
    }

    formatFechaToString(
        fecha: Date
    ): string {


        var dd = String(fecha.getDate()).padStart(2, '0');
        var mm = String(fecha.getMonth() + 1).padStart(2, '0');
        var yyyy = fecha.getFullYear();

        return mm + '/' + dd + '/' + yyyy;

    }

    onClickExportCtaCtePDF(
        $event: any
    ) {
        $event.preventDefault();

        let fDesde: string = this.fechaDesde ? this.fechaDesde.year.toString() + '-' + this.fechaDesde.month.toString() + '-' + this.fechaDesde.day.toString() : null;
        let fHasta: string = this.fechaHasta ? this.fechaHasta.year.toString() + '-' + this.fechaHasta.month.toString() + '-' + this.fechaHasta.day.toString() : null;

        this._documentoVentaService.exportCtaCteToPDF(this.clienteSeleccionado.Id, fDesde, fHasta);
    }

    onClickExportCtaCteExcel(
        $event: any
    ) {
        $event.preventDefault();

        let fDesde: string = this.fechaDesde ? this.fechaDesde.year.toString() + '-' + this.fechaDesde.month.toString() + '-' + this.fechaDesde.day.toString() : null;
        let fHasta: string = this.fechaHasta ? this.fechaHasta.year.toString() + '-' + this.fechaHasta.month.toString() + '-' + this.fechaHasta.day.toString() : null;

        this._documentoVentaService.exportCtaCteToExcel(this.clienteSeleccionado.Id, fDesde, fHasta);
    }

    onClickExportrResumenSaldoExcel(
        $event: any
    ) {
        $event.preventDefault();
        this._documentoVentaService.exportResumenSaldosToExcel();
    }



    onClickConfirmarAnularComprobante(
        $event: any,
        item: DocumentoVenta
    ) {
        $event.preventDefault();

        this.docVentaProcesar = item;
        this.textoConfirmaAnulacion = '¿Desea anular el comprobante: ' + this.docVentaProcesar.TipoComprobante.Descripcion + ' ' + this.formatNumero(this.docVentaProcesar.Numero) + '?'
        $('#modalConfirmaAnular').modal('show');

    }

    onClickDeshacerAnulado(
        $event: any,
        item: DocumentoVenta
    ) {
        $event.preventDefault();

        this.docVentaProcesar = item;
        this.textoConfirmaAnulacion = '¿Deshacer anulación del comprobante: ' + this.docVentaProcesar.TipoComprobante.Descripcion + ' ' + this.formatNumero(this.docVentaProcesar.Numero) + '?'
        $('#modalConfirmaAnular').modal('show');
    }


    onClickAnularComprobante(
        $event: any
    ) {
        $event.preventDefault();

        if (this.docVentaProcesar) {

            //usamos el mismo modal para confirmar anular y deshacer
            if (this.docVentaProcesar.Anulado)
                this.docVentaProcesar.Anulado = false;
            else
                this.docVentaProcesar.Anulado = true;

            this.procesando = true;
            this._documentoVentaService.saveComprobanteAnulado(this.docVentaProcesar)
                .subscribe(
                    response => {
                        this.procesando = false;
                        this.cargarListados();
                        this.showNotification('success', 'El comprobante se actualizó correctamente.');
                        $('#modalConfirmaAnular').modal('hide');
                    },
                    error => {
                        this.procesando = false;
                        this.showNotification('error', 'Ocurrió un error al actualizar el comprobante.');
                        $('#modalConfirmaAnular').modal('hide');
                        console.log(<any>error);
                    }
                );
        }
    }

    onClickLimpiarCliente(
        event: any
    ) {
        event.preventDefault();
        this.clienteSeleccionado = null

        this.listadoCtaCte = [];
        this.listadoCobranzas = [];
        this.listadoAnulados = [];
    }


    colapsarMenu($event: any) {
        $event.preventDefault();
        $('.navbar-collapse').collapse('hide');
        return false;
    }

    public showNotification(type: string, message: string): void {
        this._notifier.notify(type, message);
    }
    public hideOldestNotification(): void {
        this._notifier.hideOldest();
    }

}
