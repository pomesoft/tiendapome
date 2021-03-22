import { Component, OnInit, NgZone, HostListener } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { interval } from 'rxjs';

import { PouchDBServices } from './services/pouch-db.services';
import { Cliente } from './models/cliente';
import { Parametro } from './models/parametro';
import { AutenticaService } from './services/autentica.service';
import { ParametroServices } from './services/parametro.services';
import { disableDebugTools } from '@angular/platform-browser';
import { version } from 'process';

declare var $: any;

@Component({
      selector: 'app-root',
      templateUrl: './app.component.html',
      styleUrls: ['./app.component.css']
})
export class AppComponent {

      public title: string = 'tiendapome';
      private _idUserDB = 'USER_01';
      private clienteLogin: Cliente;
      public identificado: boolean;
      public usuario: string;
      public clave: string;

      public textoBuscar: string = '';


      public panelInstalar: boolean = true;

      public textIOS: string = '';
      public reqLanding: boolean = false;

      deferredPrompt: any;

      @HostListener('window:beforeinstallprompt', ['$event'])
      onbeforeinstallprompt(e) {
            console.log(e);
            // Prevent Chrome 67 and earlier from automatically showing the prompt
            e.preventDefault();
            // Stash the event so it can be triggered later.
            this.deferredPrompt = e;

            //si estamos con un celular
            //if (this.isMobile() && !this.appInstalada()) {
            if (this.isMobile()) {
                  $('#modalInstall').modal('show');
            }
      }

      constructor(
            private _route: ActivatedRoute,
            private _autenticaService: AutenticaService,
            private _parametroServices: ParametroServices,
            private _router: Router,
            private _zone: NgZone,
            private _pouchDBServices: PouchDBServices
      ) {

            // this._globalService.inicializar();
            // this._titleService.setTitle( this._globalService.TittleIndex );
      }

      public ngOnInit() {

            this.reqLanding = window.location.hash.endsWith('jqmlndng1973');

            if (window.location.protocol != 'https:' && window.location.hostname != 'localhost') {

                  window.location.href = 'https://' + window.location.hostname + window.location.pathname + window.location.hash;

            } else {

                  this.verificarInstalacionIPhone();

                  this.clienteLogin = null;
                  this.identificado = false;

                  this._pouchDBServices.cambios();
                  this._pouchDBServices.getChangeListener().subscribe(data => {
                        this._zone.run(() => {
                              //this._router.navigate(['/mantenimiento']);
                              this.verificarUsuario();
                        });
                  });

                  this.verificarUsuario();
            }
      }

      appInstalada(): boolean {
            let versionAPP = localStorage.getItem("versionAPP") ? localStorage.getItem("versionAPP") : '';
            return (versionAPP != '')
      }


      verificarInstalacionIPhone() {
            //si estamos con un celular y no esta instalada
            if (this.isMobile() && !this.appInstalada()) {
                  let isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
                  if (isIOS) {
                        this.textIOS = navigator.userAgent + 'isIOS => ' + (isIOS ? 'true' : 'false');
                        $('#modalIPhone').modal('show');
                  }
            }
      }



      instalarAPP(event: any) {
            event.preventDefault();
            localStorage.setItem('versionAPP', 'VERSION_INICIAL');
            $('#modalInstall').modal('hide');
            // Show the prompt
            this.deferredPrompt.prompt();
            // Wait for the user to respond to the prompt
            this.deferredPrompt.userChoice
                  .then((choiceResult) => {
                        if (choiceResult.outcome === 'accepted') {
                              console.log('User accepted the A2HS prompt');
                        } else {
                              console.log('User dismissed the A2HS prompt');
                        }
                        this.deferredPrompt = null;
                  });
      }

      cancelarInstalacionANDROID(event: any) {
            event.preventDefault();
            localStorage.setItem('versionAPP', 'VERSION_INICIAL');
            $('#modalInstall').modal('hide');
      }

      cancelarInstalacionIOS(event: any) {
            event.preventDefault();
            localStorage.setItem('versionAPP', 'VERSION_INICIAL');
            $('#modalIPhone').modal('hide');
      }


      //por defecto que entre al carrito
      esRolCliente(): boolean {
            let valor: boolean = false;
            if (this.clienteLogin)
                  valor = (this.clienteLogin.Rol.Id == 3);
            return valor;
      }
      //por defecto que entre al carrito
      esRolAdministrador(): boolean {
            let valor: boolean = false;
            if (this.clienteLogin)
                  valor = (this.clienteLogin.Rol.Id == 1);
            return valor;
      }


      verificarUsuario() {

            this.clienteLogin = this._autenticaService.getClienteLoguin();
            if (this.clienteLogin != null) {
                  this.identificado = true;
            } else {
                  this.identificado = false;
                  if (!this.reqLanding)
                        this._router.navigate(['/carrito']);
            }

      }

      irAlCarrito($event: any) {
            $event.preventDefault();
            this._router.navigate(['/pedido/-1/' + this.clienteLogin.Id]);
      }

      cerrarSesion($event: any) {
            $event.preventDefault();
            this.clienteLogin = null;
            var userLogin = {
                  _id: this._idUserDB,
                  clienteLogin: null
            };
            this._pouchDBServices.update(userLogin);
            this._autenticaService.logout().subscribe(
                  response => { this._router.navigate(['/carrito']); },
                  error => {
                        this._router.navigate(['/carrito']);
                        console.log(<any>error);
                  }
            );
      }

      enviarWhatsApp(
            $event: any
      ) {

            $event.preventDefault();

            let urlDesktop = 'https://web.whatsapp.com/';
            let urlMobile = 'https://api.whatsapp.com/';

            let mensaje = 'send?phone=' + localStorage.getItem("numeroWhatsApp") + '&text=%20';
            //let mensaje = 'send?phone=5493624098916&text=%20';

            if (this.isMobile()) {
                  window.open(urlMobile + mensaje, '_blank')
            } else {
                  window.open(urlDesktop + mensaje, '_blank')
            }
      }

      isMobile() {
            if (sessionStorage.desktop)
                  return false;
            else if (localStorage.mobile)
                  return true;
            var mobile = ['iphone', 'ipad', 'android', 'blackberry', 'nokia', 'opera mini', 'windows mobile', 'windows phone', 'iemobile'];
            for (var i in mobile)
                  if (navigator.userAgent.toLowerCase().indexOf(mobile[i].toLowerCase()) > 0) return true;
            return false;
      }
}


