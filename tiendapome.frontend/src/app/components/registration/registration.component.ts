import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ClienteService } from '../../services/cliente.service';
import { PouchDBServices } from '../../services/pouch-db.services';
import { AutenticaService } from '../../services/autentica.service';
import { ParametroServices } from '../../services/parametro.services';

import { Cliente, Login, Rol } from '../../models/cliente';
import { Parametro } from '../../models/parametro';
import { Pedido } from 'src/app/models/pedido';

declare var $: any;

@Component({
      selector: 'app-registration',
      templateUrl: './registration.component.html',
      styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

      public cliente: Cliente;
      public claveRepetida: string;
      public todoOK: boolean;
      public ocurrioError: boolean;
      public mensajeAlert: string = '';

      public leyendaConfirmaRegistro: string = '';
      public leyendaErrorRegistro: string = '';
      public mostrarBtnMayorista: boolean = false;

      public clienteLogin: Cliente;
      public ingresando: boolean = false;

      constructor(
            private _clientesServices: ClienteService,
            private _parametroServices: ParametroServices,
            private _router: Router,
            private _autenticaServices: AutenticaService,
            private _pouchDBServices: PouchDBServices,

      ) {

      }

      ngOnInit() {
            this.cliente = new Cliente();
            this.inicializarControles();
      }


      async inicializarControles() {
            await this.obtenerLeyenda()
                  .then((result: Parametro) => {
                        this.leyendaConfirmaRegistro = result.Valor;
                        return this.obtenerVariableMostrarBtnMayorista();
                  })
                  .then((result: Parametro) => {
                        if (result)
                              this.mostrarBtnMayorista = (result.Valor == 'SI');
                  })
                  ;
      }

      obtenerLeyenda() {
            return new Promise((resolve, reject) => {
                  this._parametroServices.getParametroValor('LEYENDA_REGISTRO').subscribe(
                        (response: Parametro) => { resolve(response); },
                        error => { reject(<any>error); }
                  );
            });
      }
      obtenerVariableMostrarBtnMayorista() {
            return new Promise((resolve, reject) => {
                  this._parametroServices.getParametroValor('REGISTRO_BTN_MAYORISTA').subscribe(
                        (response: Parametro) => { resolve(response); },
                        error => { reject(<any>error); }
                  );
            });
      }

      registrarUsuarioMayorista(
            $event: any
      ) {
            $event.preventDefault();
            if (this.cliente) {
                  this.cliente.AsignarListaMayorista = true;
                  this.actualizarCliente();
            }
      }

      registrarUsuario(
            $event: any
      ) {
            $event.preventDefault();
            if (this.cliente) {
                  this.cliente.AsignarListaMayorista = false;
                  this.actualizarCliente();
            }
      }

      actualizarCliente() {
            this.cliente.Rol.Id = 3;
            this.cliente.Vigente = true;

            console.log('this.cliente', this.cliente);
            let validacionOK = true;
            this.leyendaErrorRegistro = '';

            if (!this.cliente.Email || this.cliente.Email == '') {
                  validacionOK = false;
                  this.todoOK = false;
                  this.ocurrioError = false;
                  this.leyendaErrorRegistro += 'un email - ';
                  $('#modalConfirmaRegistro').modal('show');
            }
            if (!this.cliente.Codigo || this.cliente.Codigo == '') {
                  validacionOK = false;
                  this.todoOK = false;
                  this.ocurrioError = false;
                  this.leyendaErrorRegistro += 'una contraseña - ';
                  $('#modalConfirmaRegistro').modal('show');
            }

            if (!this.cliente.Celular || this.cliente.Celular == '') {
                  validacionOK = false;
                  this.todoOK = false;
                  this.ocurrioError = false;
                  this.leyendaErrorRegistro += 'un celular - ';
                  $('#modalConfirmaRegistro').modal('show');
            }

            if (!validacionOK) {
                  this.todoOK = false;
                  this.ocurrioError = false;
                  this.leyendaErrorRegistro = 'Para registrarte en la app insgresá ' + this.leyendaErrorRegistro;
                  $('#modalConfirmaRegistro').modal('show');

            } else {

                  if (this.cliente.Codigo != this.claveRepetida) {
                        validacionOK = false;
                        this.todoOK = false;
                        this.ocurrioError = false;
                        this.leyendaErrorRegistro = 'Verificá los datos ingresados, las claves deben ser iguales.';
                        $('#modalConfirmaRegistro').modal('show');
                  } else {
                        this._clientesServices.saveCliente(this.cliente).subscribe(
                              response => {
                                    this.todoOK = true;
                                    $('#modalConfirmaRegistro').modal('show');
                              },
                              error => {
                                    this.todoOK = false;
                                    this.ocurrioError = true;
                                    console.log(<any>error);
                                    this.leyendaErrorRegistro = error.error.Message;
                                    $('#modalConfirmaRegistro').modal('show');
                              }
                        );
                  }
            }
      }

      cerrarConfirmacion($event) {
            $event.preventDefault();

            if (this.todoOK) {
                  this.ingresando = true;

                  let loginData: Login = new Login();
                  loginData.Usuario = this.cliente.Email;
                  loginData.Clave = this.cliente.Codigo

                  this._autenticaServices.login(loginData)
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
                                    this.todoOK = false;
                                    this.ocurrioError = true;
                                    console.log(<any>error);
                                    this.leyendaErrorRegistro = <any>error.error.Message;
                                    $('#modalConfirmaRegistro').modal('show');
                              }
                        );
            }
      }


}