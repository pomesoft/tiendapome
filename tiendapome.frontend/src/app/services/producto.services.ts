import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { MovimientoStockDetalle, Producto, ProductoGrupoOrden, ProductoStockMovimiento, TipoMovimientoStock } from '../models/producto';
import { GlobalService } from './global.service';

@Injectable({
      providedIn: 'root'
})
export class ProductoServices {

      public url: string;

      private productos: Array<Producto>;

      constructor(
            private _http: HttpClient,
            private _globalService: GlobalService
      ) {
            this.url = _globalService.url + 'producto';
            //this.url = sessionStorage.getItem('UrlApi') + 'producto';
      }

      getProductosABM(
            subCategoria: number,
            tipoListado: number,
            numeroPagina: number,
            cantidadRegistros: number
      ): Observable<any> {
            let headers = new HttpHeaders().set('Content-Type', 'application/json');
            let urlParams: string;
            urlParams = '/' + subCategoria + '/' + tipoListado + '/' + numeroPagina + '/' + cantidadRegistros;
            console.log(this.url + '/listarabm' + urlParams);
            return this._http.get(this.url + '/listarabm' + urlParams, { headers: headers });
      }

      //este se utiliza desde el carrito
      getProductos(
            conStock: boolean,
            subCategoria: number,
            textoBuscar: string,
            cliente: number,
            numeroPagina: number,
            cantidadRegistros: number
      ): Observable<any> {
            let headers = new HttpHeaders().set('Content-Type', 'application/json');
            let urlParams: string;
            urlParams =
                  '/' + conStock +
                  '/' + subCategoria +
                  '/' + textoBuscar +
                  '/' + cliente +
                  '/' + numeroPagina +
                  '/' + cantidadRegistros;
            //console.log(this.url + '/listarbusqueda' + + urlParams);
            return this._http.get(this.url + '/listarbusqueda' + urlParams, { headers: headers });
      }

      //este se utiliza buscar producto por codigo y devuelva el precio del cliente
      //[Route("api/producto/buscarcodigo/{conStock}/{codigo}/{cliente}")]
      getProductoCodigo(
            conStock: boolean,
            codigo: string,
            cliente: number
      ): Observable<Producto> {
            let headers = new HttpHeaders().set('Content-Type', 'application/json');
            let urlParams: string;
            urlParams = '/' + conStock + '/' + codigo + '/' + cliente;
            console.log(this.url + '/buscarcodigo' + + urlParams);
            return this._http.get<Producto>(this.url + '/buscarcodigo' + urlParams, { headers: headers });
      }

      getAllProductos(): Observable<any> {
            let headers = new HttpHeaders().set('Content-Type', 'application/json');
            return this._http.get(this.url, { headers: headers });
      }

      //este buscar se utiliza desde el ABM de Productos
      searchProductos(
            buscar: string,
            soloCodigo: boolean,
            numeroPagina: number,
            cantidadRegistros: number
      ): Observable<any> {
            let headers = new HttpHeaders().set('Content-Type', 'application/json');
            let urlParams: string;
            urlParams = '/' + buscar +
                  '/' + soloCodigo +
                  '/' + numeroPagina +
                  '/' + cantidadRegistros;
            return this._http.get(this.url + '/buscar' + urlParams, { headers: headers });
      }

      getProducto(id: number): Observable<any> {
            let headers = new HttpHeaders().set('Content-Type', 'application/json');
            return this._http.get(this.url + '/' + id, { headers: headers });
      }

      saveProducto(prod: Producto): Observable<any> {
            let params = JSON.stringify(prod);
            let headers = new HttpHeaders().set('Content-Type', 'application/json');
            return this._http.post(this.url, params, { headers: headers });
      }

      deleteProducto(id: number): Observable<any> {
            let headers = new HttpHeaders().set('Content-Type', 'application/json');
            //return this._http.delete(this.url + '/' + id, { headers: headers });
            return this._http.post(this.url + '/eliminar/' + id, { headers: headers });
      }


      printListadoProductos(
            idSubcategoria: number,
            tipoListado: number
      ) {
            let urlAPI: string = this.url + 'producto/listadoproductos?idSubcategoria=' + idSubcategoria + '&tipoListado=' + tipoListado;
            console.log(urlAPI);
            window.open(urlAPI, '_blank');
      }


      getGruposOrden(): Observable<Array<ProductoGrupoOrden>> {
            let headers = new HttpHeaders().set('Content-Type', 'application/json');
            return this._http.get<Array<ProductoGrupoOrden>>(this._globalService.url + 'catalogo/grupoorden', { headers: headers });
      }
      getGrupoOrden(id: number): Observable<ProductoGrupoOrden> {
            let headers = new HttpHeaders().set('Content-Type', 'application/json');

            return this._http.get<ProductoGrupoOrden>(this._globalService.url + 'catalogo/grupoorden' + '/' + id, { headers: headers });
      }
      saveGrupoOrden(parametro: ProductoGrupoOrden): Observable<any> {
            let params = JSON.stringify(parametro);
            let headers = new HttpHeaders().set('Content-Type', 'application/json');

            return this._http.post(this._globalService.url + 'catalogo/grupoorden', params, { headers: headers });
      }


      getTiposMovimientosStock(): Array<TipoMovimientoStock> {
            let tipos: Array<TipoMovimientoStock> = new Array<TipoMovimientoStock>();

            tipos.push({ Id: 2, Descripcion: 'INGRESO', Vigente: true, Tipo: 1 });
            tipos.push({ Id: 3, Descripcion: 'SALIDA', Vigente: true, Tipo: 2 });
            tipos.push({ Id: 4, Descripcion: 'AJUSTE POSITIVO', Vigente: true, Tipo: 1 });
            tipos.push({ Id: 5, Descripcion: 'AJUSTE NEGATIVO', Vigente: true, Tipo: 2 });

            return tipos;
      }
      // /api/producto/movimientostock/
      saveMovimientoStock(parametro: ProductoStockMovimiento): Observable<any> {
            let params = JSON.stringify(parametro);
            let headers = new HttpHeaders().set('Content-Type', 'application/json');

            return this._http.post(this._globalService.url + 'producto/movimientostock', params, { headers: headers });
      }


      getProductoMovimientosStock(
            idProductoStock: number
      ): Observable<Array<MovimientoStockDetalle>> {
            let headers = new HttpHeaders().set('Content-Type', 'application/json');
            return this._http.get<Array<MovimientoStockDetalle>>(this._globalService.url + 'producto/movimientostock/' + idProductoStock.toString(), { headers: headers });
      }

      exportMovimientosStockDetalle(
            idProductoStock: number
      ) {
            let urlAPI: string = this.url + 'producto/movimientostockcsv/' + idProductoStock;
            console.log('exportMovimientosStockDetalle=>urlAPI', urlAPI);
            window.open(urlAPI, '_blank');
      }

}
