import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { GlobalService } from './global.service';
import { DocumentoVenta, DocumentoVentaItem, DocumentoVentaList, VentaTipoComprobante } from '../models/documentoVenta';
import { Producto } from '../models/producto';
import { ListadoventasComponent } from '../pages/listadoventas/listadoventas.component';
import { ListadoCtaCte } from '../models/itemListado';

@Injectable({
    providedIn: 'root'
})
export class DocumentoVentaService {
    private headers = new HttpHeaders().set('Content-Type', 'application/json');
    public url: string;

    constructor(
        private _http: HttpClient,
        private _globalService: GlobalService
    ) {
        this.url = _globalService.url;
    }

    getDocumentosVentas(
        idUsuario: number,
        idCliente: number,
        fechaDesde: string,
        fechaHasta: string,
        numeroPagina: number,
        cantidadRegistros: number,
        tipoListado: number
    ): Observable<DocumentoVentaList> {

        let paramsPagina = 'numeroPagina=' + numeroPagina;
        let paramsRegistros = '&cantidadRegistros=' + cantidadRegistros;
        let paramDesde = '&fechaDesde=' + fechaDesde;
        let paramHasta = '&fechaHasta=' + fechaHasta;
        let paramUsuario = '&idUsuario=' + idUsuario;
        let paramCliente = '&idCliente=' + idCliente;
        let paramDocsPendientes = '&tipoListado=' + tipoListado;

        let urlAPI: string = this.url + 'venta/listpaginado?' + paramsPagina + paramsRegistros + paramDesde + paramHasta + paramUsuario + paramCliente + paramDocsPendientes;
        //console.log(urlAPI);

        return this._http.get<DocumentoVentaList>(urlAPI, { headers: this.headers });
    }

    getSaldoIniciaCliente(
        idCliente: number,
        fecha: string
    ): Observable<number> {
        let paramCliente = 'idCliente=' + idCliente;
        let paramDesde = '&fecha=' + fecha;

        let urlAPI: string = this.url + 'venta/saldoinicialcliente?' + paramCliente + paramDesde;
        console.log(urlAPI);

        return this._http.get<number>(urlAPI, { headers: this.headers });
    }

    getDocumentoVenta(id): Observable<DocumentoVenta> {
        return this._http.get<DocumentoVenta>(this.url + 'venta/' + id, { headers: this.headers });
    }

    saveDocVenta(docVenta: DocumentoVenta): Observable<DocumentoVenta> {
        let params = JSON.stringify(docVenta);
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.post<DocumentoVenta>(this.url + 'venta', params, { headers: headers });
    }

    saveItemNotaPedido(item: DocumentoVentaItem): Observable<DocumentoVentaItem> {
        let params = JSON.stringify(item);
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.post<DocumentoVentaItem>(this.url + 'venta/item', params, { headers: headers });
    }

    deleteItemNotaPedido(item: DocumentoVentaItem): Observable<DocumentoVenta> {
        let params = JSON.stringify(item);
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        console.log(this.url + 'venta/eliminaritem');
        return this._http.post<DocumentoVenta>(this.url + 'venta/eliminaritem', params, { headers: headers });
    }

    saveNotaPedidoFacturarPedido(docVenta: DocumentoVenta): Observable<DocumentoVenta> {
        let params = JSON.stringify(docVenta);
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.post<DocumentoVenta>(this.url + 'venta/facturarpedido', params, { headers: headers });
    }

    saveNotaPedidoFacturarProducto(producto: Producto): Observable<DocumentoVenta> {
        let params = JSON.stringify(producto);
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.post<DocumentoVenta>(this.url + 'venta/facturarproducto', params, { headers: headers });
    }

    saveComprobanteAnulado(docVenta: DocumentoVenta): Observable<DocumentoVenta> {
        let params = JSON.stringify(docVenta);
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.post<DocumentoVenta>(this.url + 'venta/anular', params, { headers: headers });
    }

    getTipoComprobante(
        idTipoComprobante: number
    ): Observable<VentaTipoComprobante> {

        let urlAPI: string = this.url + 'venta/tipocomprobate/' + idTipoComprobante;
        return this._http.get<VentaTipoComprobante>(urlAPI, { headers: this.headers });
    }

    getResumenSaldoCtaCte(
    ): Observable<Array<ListadoCtaCte>> {
        let urlAPI: string = this.url + 'venta/listresumensaldoctacte';
        return this._http.get<Array<ListadoCtaCte>>(urlAPI, { headers: this.headers });
    }


    printNotaPedido(
        idVenta: number
    ) {
        //let urlAPI: string = 'https://tiendapome.com.ar/api/venta/imprimirnp?idVenta=' + idVenta
        let urlAPI: string = 'https://backend.tradingjoyas.com/api/venta/imprimirnp?idVenta=' + idVenta
        console.log(urlAPI);
        window.open(urlAPI, '_blank');
    }

    exportCtaCteToPDF(
        idCliente: number,
        fechaDesde: string,
        fechaHasta: string
    ) {
        let urlAPI: string = 'https://backend.tradingjoyas.com/api/venta/exportctactetopdf?fechaDesde=' + fechaDesde + '&fechaHasta=' + fechaHasta + '&idCliente=' + idCliente;
        console.log(urlAPI);
        window.open(urlAPI, '_blank');
    }

    exportCtaCteToExcel(
        idCliente: number,
        fechaDesde: string,
        fechaHasta: string
    ) {
        let urlAPI: string = 'https://backend.tradingjoyas.com/api/venta/exportctactetocsv?fechaDesde=' + fechaDesde + '&fechaHasta=' + fechaHasta + '&idCliente=' + idCliente;
        console.log(urlAPI);
        window.open(urlAPI, '_blank');
    }

    exportResumenSaldosToExcel() {
        let urlAPI: string = 'https://backend.tradingjoyas.com/api/venta/exportresumensaldotocsv';
        console.log(urlAPI);
        window.open(urlAPI, '_blank');
    }

}
