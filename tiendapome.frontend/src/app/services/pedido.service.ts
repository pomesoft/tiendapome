import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { GlobalService } from './global.service';
import { Pedido, PedidoItem, Estado } from '../models/pedido';


@Injectable({
      providedIn: 'root'
})
export class PedidoService {
      public url: string;

      constructor(
            private _http: HttpClient,
            private _globalService: GlobalService
      ) {
            this.url = _globalService.url;
            //this.url = sessionStorage.getItem('UrlApi');
      }

      getPedido(id: number): Observable<any> {
            let headers = new HttpHeaders().set('Content-Type', 'application/json');
            console.log('this.urlpedido/id', this.url + 'pedido/' + id);
            return this._http.get(this.url + 'pedido/' + id, { headers: headers });
      }

      getPedidoObtener(
            id: number,
            numeroPagina: number,
            cantidadRegistros: number
      ): Observable<any> {
            let headers = new HttpHeaders().set('Content-Type', 'application/json');
            let urlParams: string = '/' + id + '/' + numeroPagina + '/' + cantidadRegistros;
            return this._http.get(this.url + 'pedido/obtener' + urlParams, { headers: headers });
      }

      getPedidoClienteIngresado(
            idCliente: number,
            numeroPagina: number,
            cantidadRegistros: number
      ): Observable<any> {
            let headers = new HttpHeaders().set('Content-Type', 'application/json');
            let urlParams: string = '/' + idCliente;
            console.log(this.url + 'pedido/cliente' + urlParams);
            return this._http.get(this.url + 'pedido/cliente' + urlParams, { headers: headers });
      }


      savePedido(pedido: Pedido): Observable<any> {
            let params = JSON.stringify(pedido);
            let headers = new HttpHeaders().set('Content-Type', 'application/json');
            return this._http.post(this.url + 'pedido', params, { headers: headers });
      }

      savePedidoProveedor(pedido: Pedido): Observable<any> {
            let headers = new HttpHeaders().set('Content-Type', 'application/json');
            return this._http.post(this.url + 'Pedido/Proveedor/' + pedido.Id, { headers: headers });
      }

      savePedidoItem(item: PedidoItem): Observable<any> {
            let params = JSON.stringify(item);
            let headers = new HttpHeaders().set('Content-Type', 'application/json');
            return this._http.post(this.url + 'pedidoitem', params, { headers: headers });
      }

      savePedidoItemCambioEstado(item: PedidoItem): Observable<any> {
            let params = JSON.stringify(item);
            let headers = new HttpHeaders().set('Content-Type', 'application/json');
            return this._http.post(this.url + 'pedidoitem/cambioestado', params, { headers: headers });
      }

      deletePedidoItem(id): Observable<any> {
            let headers = new HttpHeaders().set('Content-Type', 'application/json');
            return this._http.post(this.url + 'pedidoitem/eliminar/' + id, { headers: headers });
      }

      avanzarPedido(pedido: Pedido): Observable<any> {
            let params = JSON.stringify(pedido);
            let headers = new HttpHeaders().set('Content-Type', 'application/json');
            return this._http.post(this.url + 'pedido/avanzar', params, { headers: headers });
      }
      crearPedido(idCliente: number): Observable<any> {
            let headers = new HttpHeaders().set('Content-Type', 'application/json');
            return this._http.post(this.url + 'pedido/crear/' + idCliente, { headers: headers });
      }
      liberarStockPedido(idPedido: number): Observable<any> {
            let headers = new HttpHeaders().set('Content-Type', 'application/json');
            return this._http.post(this.url + 'pedido/liberarstock/' + idPedido, { headers: headers });
      }
      cancelarPedido(idPedido: number): Observable<any> {
            let headers = new HttpHeaders().set('Content-Type', 'application/json');
            return this._http.post(this.url + 'pedido/cancelar/' + idPedido, { headers: headers });
      }

      getPedidosList(
            estados: string,
            idCliente: number,
            fechaDesde: string,
            fechaHasta: string
      ): Observable<any> {
            let headers = new HttpHeaders().set('Content-Type', 'application/json');
            let paramEstados = 'estados=' + estados;
            let paramCliente = '&idCliente=' + idCliente;
            let paramDesde = '&fechaDesde=' + fechaDesde;
            let paramHasta = '&fechaHasta=' + fechaHasta;
            console.log(this.url + 'pedido/List?' + paramEstados + paramCliente + paramDesde + paramHasta);
            return this._http.get(this.url + 'pedido/List?' + paramEstados + paramCliente + paramDesde + paramHasta, { headers: headers });
      }

      getPedidosListPaginado(
            estados: string,
            idCliente: number,
            fechaDesde: string,
            fechaHasta: string,
            numeroPagina: number,
            cantidadRegistros: number
      ): Observable<any> {
            let headers = new HttpHeaders().set('Content-Type', 'application/json');
            let paramEstados = 'estados=' + estados;
            let paramCliente = '&idCliente=' + idCliente;
            let paramDesde = '&fechaDesde=' + fechaDesde;
            let paramHasta = '&fechaHasta=' + fechaHasta;
            let paramsPagina = '&numeroPagina=' + numeroPagina;
            let paramsRegistros = '&cantidadRegistros=' + cantidadRegistros;

            let urlAPI: string = this.url + 'pedido/ListPaginado?' + paramEstados + paramCliente + paramDesde + paramHasta + paramsPagina + paramsRegistros;
            console.log(urlAPI);
            return this._http.get(urlAPI, { headers: headers });
      }

      getEstados(): Observable<any> {
            let headers = new HttpHeaders().set('Content-Type', 'application/json');
            return this._http.get(this.url + 'catalogo/estados', { headers: headers });
      }


      
      exportListadoEtiquetas(
            idPedido: number
      ) {
            let urlAPI: string = 'https://backend.tradingjoyas.com/api/pedido/listadoetiquetas?idPedido=' + idPedido;
            console.log(urlAPI);
            window.open(urlAPI, '_blank');
      }
}
