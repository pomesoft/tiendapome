import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Cliente, ClienteLista } from '../models/cliente';
import { GlobalService } from './global.service';

@Injectable({
	providedIn: 'root'
})
export class ClienteService {
	public url: string;

	constructor(
		private _http: HttpClient,
		private _globalService: GlobalService
	) {
		this.url = _globalService.url;
		//this.url = sessionStorage.getItem('UrlApi');
	}

	getClientes(): Observable<any> {
		let headers = new HttpHeaders().set('Content-Type', 'application/json');
		return this._http.get(this.url + 'cliente', { headers: headers });
	}

	getCliente(id): Observable<any> {
		let headers = new HttpHeaders().set('Content-Type', 'application/json');
		return this._http.get(this.url + 'cliente/' + id, { headers: headers });
	}

	searchClientes(
		buscar: string
	): Observable<any> {
		let headers = new HttpHeaders().set('Content-Type', 'application/json');
		return this._http.get(this.url + 'cliente/buscar/' + buscar, { headers: headers });
	}

	searchClientesAutocompleta(
		buscar: string
	): Observable<any> {
		let headers = new HttpHeaders().set('Content-Type', 'application/json');
		return this._http.get(this.url + 'cliente/autocompleta/' + buscar, { headers: headers });
	}

	getClientesSinListasPrecio(): Observable<any> {
		let headers = new HttpHeaders().set('Content-Type', 'application/json');
		return this._http.get(this.url + 'cliente/listarsinlista', { headers: headers });
	}



	saveCliente(cliente: Cliente): Observable<any> {
		let params = JSON.stringify(cliente);
		let headers = new HttpHeaders().set('Content-Type', 'application/json');
		return this._http.post(this.url + 'cliente', params, { headers: headers });
	}
	deleteCliente(id: number): Observable<any> {
		let headers = new HttpHeaders().set('Content-Type', 'application/json');
		return this._http.post(this.url + 'cliente/eliminar/' + id, { headers: headers });
	}


	saveClienteLista(clienteLista: ClienteLista): Observable<any> {
		let params = JSON.stringify(clienteLista);
		let headers = new HttpHeaders().set('Content-Type', 'application/json');
		return this._http.post(this.url + 'cliente/ListaPrecioCliente', params, { headers: headers });
	}
	deleteClienteLista(id: number): Observable<any> {
		let headers = new HttpHeaders().set('Content-Type', 'application/json');
		return this._http.post(this.url + 'cliente/listapreciocliente/eliminar/' + id, { headers: headers });
	}


	getRoles(): Observable<any> {
		let headers = new HttpHeaders().set('Content-Type', 'application/json');
		return this._http.get(this.url + 'catalogo/roles', { headers: headers });
	}

	getProvincias(): Observable<any> {
		let headers = new HttpHeaders().set('Content-Type', 'application/json');
		return this._http.get(this.url + 'catalogo/provincias', { headers: headers });
	}

	getSituacionesIVA(): Observable<any> {
		let headers = new HttpHeaders().set('Content-Type', 'application/json');
		return this._http.get(this.url + 'catalogo/situacionesiva', { headers: headers });
	}
}
