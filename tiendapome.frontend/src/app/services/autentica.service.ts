import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { isNullOrUndefined } from "util";

import { Cliente } from '../models/cliente';
import { PouchDBServices } from './pouch-db.services';
import { GlobalService } from './global.service';
import { PedidoService } from './pedido.service';
import { Pedido } from '../models/pedido';

@Injectable({
      providedIn: 'root'
})
export class AutenticaService {

      //TODO: hay que implementar JWT en el backend se hace login y logout tambien.

      private _idUserDB = 'USER_01';//id Usuario del pouchDB / indexedDB
      private _idPedidoDB: string = 'PEDIDO_01'; //id pedido del pouchDB / indexedDB
      private url: string;

      constructor(
            private _http: HttpClient,
            private _pouchDBServices: PouchDBServices,
            private _globalService: GlobalService,
            private _pedidoServices: PedidoService
      ) {

            this.url = _globalService.url;
            //this.url = sessionStorage.getItem('UrlApi');
      }

      login(
            usuario: string,
            clave: string
      ): Observable<any> {
            let headers = new HttpHeaders().set('Content-Type', 'application/json');
            return this._http.get(this.url + 'login/' + usuario + '/' + clave, { headers: headers });
      }

      logout(): Observable<any> {
            let params = JSON.stringify(this.getClienteLoguin());
            localStorage.removeItem("dboCLI");
            let headers = new HttpHeaders().set('Content-Type', 'application/json');
            return this._http.post(this.url + 'login', params, { headers: headers });
      }

      clienteAutenticado(): boolean {
            let clienteLogin: Cliente = this.getClienteLoguin();
            return (clienteLogin != null);
      }
      autenticadoBackOffice(): boolean {
            let clienteLogin: Cliente = this.getClienteLoguin();
            return (clienteLogin != null && clienteLogin.Rol.Id != 3);
      }
      autenticadoCliente(): boolean {
            let clienteLogin: Cliente = this.getClienteLoguin();
            return (clienteLogin != null && clienteLogin.Rol.Id == 3);
      }


      setClienteLoguin(cliente: Cliente): void {
            let cliente_string = JSON.stringify(cliente);
            localStorage.setItem("dboCLI", cliente_string);
      }

      getClienteLoguin(): Cliente {
            let cliente_string = localStorage.getItem("dboCLI");
            if ( !isNullOrUndefined(cliente_string)) {
                  let cliente: Cliente = JSON.parse(cliente_string);
                  return cliente;
            } else {
                  return null;
            }
      }


      registrarUsuario(clienteLogin: Cliente) {
            return new Promise((resolve, reject) => {

                  var userLogin = {
                        _id: this._idUserDB,
                        clienteLogin: clienteLogin
                  };

                  this._pouchDBServices.get(this._idUserDB)
                        .then(doc => {
                              if (doc) {
                                    return this._pouchDBServices.update(userLogin)
                                          .then(result => { resolve(result); });
                              } else {
                                    return this._pouchDBServices.put(this._idUserDB, userLogin)
                                          .then(result => { resolve(result); });
                              }
                        })
                        .catch(err => {
                              if (err.status == 404) {
                                    return this._pouchDBServices.put(this._idUserDB, userLogin)
                                          .then(result => { resolve(result); });
                              } else { reject(err); }
                        });
            });
      }

      registrarPedido(
            clienteLogin: Cliente
      ) {
            return new Promise((resolve, reject) => {
                  this._pedidoServices.getPedidoClienteIngresado(clienteLogin.Id, -1, -1).subscribe(
                        (response: Pedido) => {

                              this._pouchDBServices.get(this._idPedidoDB)
                                    .then(doc => {
                                          if (doc) {
                                                response._id = this._idPedidoDB;
                                                this._pouchDBServices.update(response);
                                          } else {
                                                this._pouchDBServices.put(this._idPedidoDB, response);
                                          }
                                    })

                              resolve(response);
                        },
                        error => { reject(error); }
                  );
            });
      }

}
