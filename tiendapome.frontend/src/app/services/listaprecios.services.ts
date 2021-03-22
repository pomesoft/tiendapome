import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ListaPrecio, ListaPrecioCliente } from '../models/listaPrecio';
import { GlobalService } from './global.service';

@Injectable({
	providedIn: 'root'
})
export class ListapreciosServices {

	public url: string;

	constructor(
		private _http: HttpClient,
		private _globalService: GlobalService
	) {
		this.url = _globalService.url;
		//this.url = sessionStorage.getItem('UrlApi');
	}

	//API para lista de precios por producto
	getListaPrecios(): Observable<any> {
		let headers = new HttpHeaders().set('Content-Type', 'application/json');
		return this._http.get(this.url + 'listaprecio', { headers: headers });
	}
	getListaPreciosVigentes(): Observable<any> {
		let headers = new HttpHeaders().set('Content-Type', 'application/json');
		return this._http.get(this.url + 'listaprecio/GetVigentes', { headers: headers });
	}
	getItemLitaPrecio(id): Observable<any> {
		let headers = new HttpHeaders().set('Content-Type', 'application/json');
		return this._http.get(this.url + 'listaprecio/' + id, { headers: headers });
	}
	saveListaPrecio(listaprecio: ListaPrecio): Observable<any> {
		let params = JSON.stringify(listaprecio);
		let headers = new HttpHeaders().set('Content-Type', 'application/json');
		return this._http.post(this.url + 'listaprecio', params, { headers: headers });
	}
	deleteListaPrecio(id: number): Observable<any> {
		let headers = new HttpHeaders().set('Content-Type', 'application/json');
		return this._http.post(this.url + 'listaprecio/eliminar/' + id, { headers: headers });
	}

	//API para lista de precios por Cliente
	getListaPreciosClienteVigentes(idListaPrecio): Observable<any> {
		let headers = new HttpHeaders().set('Content-Type', 'application/json');
		return this._http.get(this.url + 'listapreciocliente/GetVigentes?idListaPrecio=' + idListaPrecio, { headers: headers });
	}
	getListaPreciosCliente(idListaPrecio): Observable<any> {
		let headers = new HttpHeaders().set('Content-Type', 'application/json');
		return this._http.get(this.url + 'listapreciocliente/GetAll?idListaPrecio=' + idListaPrecio, { headers: headers });
	}
	getItemLitaPrecioCliente(id): Observable<any> {
		let headers = new HttpHeaders().set('Content-Type', 'application/json');
		return this._http.get(this.url + 'listapreciocliente/' + id, { headers: headers });
	}
	saveListaPrecioCliente(listaprecio: ListaPrecioCliente): Observable<any> {
		let params = JSON.stringify(listaprecio);
		let headers = new HttpHeaders().set('Content-Type', 'application/json');
		return this._http.post(this.url + 'listapreciocliente', params, { headers: headers });
	}
	deleteListaPrecioCliente(id: number): Observable<any> {
		let headers = new HttpHeaders().set('Content-Type', 'application/json');
		return this._http.post(this.url + 'listapreciocliente/eliminar/' + id, { headers: headers });
	}
}
