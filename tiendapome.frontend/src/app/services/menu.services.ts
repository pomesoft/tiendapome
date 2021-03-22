import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { GlobalService } from './global.service';
import { Tipo } from '../models/tipo';
import { Categoria } from '../models/categoria';
import { Subcategoria } from '../models/subcategoria';

@Injectable({
	providedIn: 'root'
})
export class MenuServices {

	public url: string;

	constructor(
		private _http: HttpClient,
		private _globalService: GlobalService
	) {
		this.url = _globalService.url;
		//this.url = sessionStorage.getItem('UrlApi');
	}


	getMenu(): Observable<any> {
		let headers = new HttpHeaders().set('Content-Type', 'application/json');
		return this._http.get(this.url + 'tipo', { headers: headers });
	}
	getTiposABM(): Observable<any> {
		let headers = new HttpHeaders().set('Content-Type', 'application/json');
		return this._http.get(this.url + 'tipo/listarabm', { headers: headers });
	}

	getItemMenu(id): Observable<any> {
		let headers = new HttpHeaders().set('Content-Type', 'application/json');
		return this._http.get(this.url + 'tipo/' + id, { headers: headers });
	}

	saveItemMenu(item: Tipo): Observable<Tipo> {
		let params = JSON.stringify(item);
		let headers = new HttpHeaders().set('Content-Type', 'application/json');
		return this._http.post<Tipo>(this.url + 'tipo', params, { headers: headers });
	}

	deleteItemMenu(idTipo): Observable<Tipo> {
		let headers = new HttpHeaders().set('Content-Type', 'application/json');
		return this._http.post<Tipo>(this.url + 'tipo/eliminar?id=' + idTipo, { headers: headers });
	}


	getItemSubcategoria(id): Observable<any> {
		let headers = new HttpHeaders().set('Content-Type', 'application/json');
		return this._http.get(this.url + 'subcategoria/' + id, { headers: headers });
	}

	saveCategoria(item: Categoria): Observable<Categoria> {
		let params = JSON.stringify(item);
		let headers = new HttpHeaders().set('Content-Type', 'application/json');
		return this._http.post<Categoria>(this.url + 'categoria', params, { headers: headers });
	}

	deleteCategoria(idCategoria: number): Observable<Categoria> {
		let headers = new HttpHeaders().set('Content-Type', 'application/json');
		return this._http.post<Categoria>(this.url + 'categoria/eliminar?id=' + idCategoria, { headers: headers });
	}

	saveSubcategoria(item: Subcategoria): Observable<Subcategoria> {
		let params = JSON.stringify(item);
		let headers = new HttpHeaders().set('Content-Type', 'application/json');
		return this._http.post<Subcategoria>(this.url + 'subcategoria', params, { headers: headers });
	}

	deleteSubcategoria(idSubcategoria: number): Observable<Subcategoria> {
		let headers = new HttpHeaders().set('Content-Type', 'application/json');
		return this._http.post<Subcategoria>(this.url + 'subcategoria/eliminar?id=' + idSubcategoria, { headers: headers });
	}

	getMedidas(): Observable<any> {
		let headers = new HttpHeaders().set('Content-Type', 'application/json');
		return this._http.get(this.url + 'catalogo/medida', { headers: headers });
	}



}
