import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Cliente, ClienteLista } from '../models/cliente';

import { Cotizacion } from '../models/Cotizacion';
import { GlobalService } from './global.service';


@Injectable({
	providedIn: 'root'
})
export class CotizacionesService {

	private headers = new HttpHeaders().set('Content-Type', 'application/json');
	public url: string;

	constructor(
		private _http: HttpClient,
		private _globalService: GlobalService
	) {
		this.url = _globalService.url;
		//this.url = sessionStorage.getItem('UrlApi');
	}
	getCotizaciones(): Observable<Array<Cotizacion>> {
		return this._http.get<Array<Cotizacion>>(this.url + 'cotizacion', { headers: this.headers });
	}
	getCotizacion(id): Observable<Cotizacion> {
		return this._http.get<Cotizacion>(this.url + 'cotizacion' + id, { headers: this.headers });
	}
	saveCotizacion(item: Cotizacion): Observable<any> {
		let params = JSON.stringify(item);
		return this._http.post(this.url + 'cotizacion', params, { headers: this.headers });
	}
	deleteCotizacion(id: number): Observable<any> {
		return this._http.post(this.url + 'cotizacion//eliminar/' + id, { headers: this.headers });
	}

}
