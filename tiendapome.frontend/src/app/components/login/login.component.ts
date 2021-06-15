import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ClienteService } from '../../services/cliente.service';
import { PouchDBServices } from '../../services/pouch-db.services';

import { Cliente, Login } from '../../models/cliente';
import { AutenticaService } from '../../services/autentica.service';
import { PedidoService } from '../../services/pedido.service';
import { Pedido } from '../../models/pedido';

declare var $: any;

@Component({
      selector: 'login',
      templateUrl: './login.component.html',
      styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

      public loginData: Login = new Login();

      public mensajeError: string = '';
      public versionAPP: string = '';
      public ingresando: boolean = false;

      private clienteLogin: Cliente;

      constructor(
            private _autenticaServices: AutenticaService,
            private _pouchDBServices: PouchDBServices,
            private _router: Router,
            private _clienteService: ClienteService,
            private _pedidoServices: PedidoService
      ) { }

      ngOnInit() {
            $("#alertError").hide();
            this.versionAPP = localStorage.getItem("versionAPP") ? localStorage.getItem("versionAPP") : '';
      }

      verificarUsuarioBackEnd(
            $event: any
      ) {
            $event.preventDefault();

            if (this.loginData.Usuario != '' && this.loginData.Clave != '') {
                  this.ingresando = true;
                  this._autenticaServices.login(this.loginData)
                        .subscribe(
                              response => {
                                    if (response) {
                                          this.clienteLogin = response;
                                          this._autenticaServices.setClienteLoguin(this.clienteLogin);

                                          this._autenticaServices.registrarPedido(this.clienteLogin)
                                                .then(result => {
                                                      return this._autenticaServices.registrarUsuario(this.clienteLogin);
                                                })
                                                .then(result => {
                                                      this.ingresando = false;

                                                      if (this.clienteLogin.Rol.Id == 3) {
                                                            let reqLanding_HashHref = localStorage.getItem('reqLanding_HashHref') ? localStorage.getItem('reqLanding_HashHref') : '';

                                                            if (reqLanding_HashHref != '')
                                                                  this._router.navigate(['/' + reqLanding_HashHref.substr(1)]);
                                                            else
                                                                  this._router.navigate(['/carrito']);
                                                      }
                                                      else
                                                            this._router.navigate(['/backoffice']);

                                                })
                                                .catch(err => {
                                                      this.ingresando = false;
                                                      console.error(err);
                                                });
                                    }
                              },
                              error => {
                                    this.ingresando = false;
                                    this.showAlert(<any>error.error.Message);
                                    console.error(<any>error);
                              }
                        );
            }
      }

      ocurrioError() {
            return this.mensajeError.length > 0;
      }

      showAlert(mensaje: string) {
            this.mensajeError = mensaje;
            $("#alertError").fadeTo(2000, 500).slideUp(500, function () {
                  $("#alertError").slideUp(1500);
            });
      }



}
