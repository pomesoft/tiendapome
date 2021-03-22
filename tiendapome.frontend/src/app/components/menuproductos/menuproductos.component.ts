import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Tipo } from '../../models/tipo';
import { Categoria } from '../../models/categoria';
import { Subcategoria, SubcategoriaMedida } from '../../models/subcategoria';
import { Pedido } from '../../models/pedido';
import { Cliente } from '../../models/cliente';
import { Parametro } from '../../models/parametro';

import { MenuServices } from '../../services/menu.services';
import { PouchDBServices } from '../../services/pouch-db.services';
import { PedidoService } from '../../services/pedido.service';
import { ParametroServices } from '../../services/parametro.services';
import { AutenticaService } from '../../services/autentica.service';


declare var $: any;

@Component({
      selector: 'menuproductos',
      templateUrl: './menuproductos.component.html',
      styleUrls: ['./menuproductos.component.css'],
      providers: [MenuServices]
})
export class MenuproductosComponent implements OnInit {

      public menu: Array<Tipo>;
      public tipoSeleccionado: Tipo;
      public categoriaSeleccionada: Categoria;

      public pedido: Pedido;

      public listadoSubcategorias: Array<Subcategoria>;

      public listarTipos: boolean;
      public listarCategorias: boolean;
      public listarSubcategorias: boolean;

      public subcatergoriaCarrito: string;

      public cargandoProductos: boolean = true;

      public mostrarWhatsApp: boolean = true;

      public clienteLogin: Cliente;

      public textoBuscarProducto: string = '';

      public imagenBannerPromo: string;

      public nuevaVersionAPP: string = '';

      private _idPedidoDB: string = 'PEDIDO_01';
      private _idUserDB = 'USER_01';

      constructor(
            private _menuServices: MenuServices,
            private _pouchDBServices: PouchDBServices,
            private _pedidoServices: PedidoService,
            private _parametroServices: ParametroServices,
            private _route: ActivatedRoute,
            private _router: Router,
            private _autenticaServices: AutenticaService
      ) {
            this.listarTipos = true;
            this.listarCategorias = false;
            this.listarSubcategorias = false;
            this.subcatergoriaCarrito = '';
      }

      ngOnInit() {
            this.inicializarControles();
      }



      async inicializarControles() {
            await this._parametroServices.obtenerTodosParametros()
                  .then(result => {
                        this.verificarVersionAPP()
                  })
                  .then(result => {
                        return this.obtenerLeyenda();
                  })
                  .then(result => {
                        return this.obtenerNroWhatApp();
                  })
                  .then(result => {
                        return this.getMenu();
                  })
                  .then(result => {
                        if (result) {
                              this.menu = <Array<Tipo>>result;
                              this.cargandoProductos = false;

                              this._route.params.subscribe((params: Params) => {

                                    if (params.tipo != null && +params.tipo > 0) {
                                          let tipoRouting = this.menu.find(tipo => tipo.Id === +params.tipo);
                                          if (tipoRouting != null)
                                                this.mostrarItemsCategorias(tipoRouting);
                                    }
                                    else if (params.categoria != null && +params.categoria > 0) {
                                          this.menu.forEach(tipo => {
                                                let categoriaRouting = tipo.Categorias.find(catego => catego.Id === +params.categoria);
                                                if (categoriaRouting != null) {
                                                      this.tipoSeleccionado = tipo;
                                                      this.categoriaSeleccionada = categoriaRouting;
                                                      this.mostrarItemsSubcategorias(categoriaRouting);
                                                }
                                          });
                                    }
                              });
                        }
                        return this.getUserPouchDB();
                  })
                  .then(result => {
                        return this.verificarPedido();
                  })
                  .then(result => {
                        return this.mostrarBannerBienvenida();
                  }).then(result => {
                        return this.mostrarBannerPromo();
                  });
      }

      getUserPouchDB() {
            return new Promise((resolve, reject) => {
                  if (!this._autenticaServices.getClienteLoguin()) {
                        resolve();

                  } else {
                        this.clienteLogin = this._autenticaServices.getClienteLoguin();
                        resolve();
                  }
            });
      }

      getMenu() {
            return new Promise((resolve, reject) => {
                  this._menuServices.getMenu().subscribe(
                        response => { resolve(response); },
                        error => { reject(<any>error); }
                  );
            });
      }

      mostrarBannerBienvenida() {
            return new Promise((resolve, reject) => {
                  if (this._autenticaServices.getClienteLoguin()) {
                        resolve();

                  } else {
                        this._parametroServices.getParametroValor('MOSTRAR_BANNER_BIENVENIDA').subscribe(
                              (response: Parametro) => {
                                    if (response) {
                                          $('#modalBannerBienvenida').modal('show');
                                    }
                                    resolve();
                              },
                              error => {
                                    console.log(error);
                                    resolve();
                              }
                        );

                  }
            });
      }

      mostrarBannerPromo() {
            return new Promise((resolve, reject) => {
                  //Si ya hizo click en Quiero ver la promo
                  let promoVigenteVista = localStorage.getItem("promoVigenteVista") ? localStorage.getItem("promoVigenteVista") : '';
                  this._parametroServices.getParametroValor('MOSTRAR_BANNER_PROMO').subscribe(
                        (response: Parametro) => {
                              if (response && response.Valor != promoVigenteVista) {
                                    this.imagenBannerPromo = response.Valor;
                                    $('#modalBannerPromo').modal('show');
                              }
                              resolve();
                        },
                        error => {
                              console.log(error);
                              resolve();
                        }
                  );
            });
      }

      obtenerLeyenda() {
            return new Promise((resolve, reject) => {
                  localStorage.removeItem("leyendaPedido");
                  this._parametroServices.getParametroValor('LEYENDA_PEDIDO').subscribe(
                        (response: Parametro) => {
                              if (response) {
                                    localStorage.setItem("leyendaPedido", response.Valor);
                              }
                              resolve();
                        },
                        error => {
                              console.log(error);
                              resolve();
                        }
                  );
            });
      }

      verificarVersionAPP() {
            return new Promise((resolve, reject) => {
                  this._parametroServices.getParametroValor('VERSION_APP').subscribe(
                        (response: Parametro) => {
                              if (response) {
                                    let versionAPP = localStorage.getItem("versionAPP") ? localStorage.getItem("versionAPP") : '';
                                    console.log('versionAPP', versionAPP);
                                    if (versionAPP != '' && versionAPP != response.Valor) {
                                          this.nuevaVersionAPP = response.Valor;
                                          $('#modalUpdate').modal('show');
                                    }
                              }
                              resolve();
                        },
                        error => { reject(<any>error); }
                  );
            });
      }

      actualizarVersion($event: any) {
            $event.preventDefault();
            localStorage.setItem("versionAPP", this.nuevaVersionAPP);
            $('#modalUpdate').modal('hide');
            window.location.reload();
      }



      obtenerNroWhatApp() {
            return new Promise((resolve, reject) => {
                  this.mostrarWhatsApp = false;
                  localStorage.removeItem("numeroWhatsApp")
                  this._parametroServices.getParametroValor('NRO_VENTAS_WHATSAPP').subscribe(
                        (response: Parametro) => {
                              if (response) {
                                    this.mostrarWhatsApp = response.Valor.length > 0;
                                    localStorage.setItem("numeroWhatsApp", response.Valor);
                              }
                              resolve();
                        },
                        error => {
                              console.log(error);
                              resolve();
                        }
                  );
            });
      }

      verificarPedido() {
            return new Promise((resolve, reject) => {
                  if (this.clienteLogin) {
                        this._pedidoServices.getPedidoClienteIngresado(this.clienteLogin.Id, -1, -1).subscribe(
                              response => {
                                    if (response) {
                                          this.pedido = <Pedido>response;
                                          this.registrarPedido_pouchDB();
                                    }
                                    resolve();
                              },
                              error => {
                                    console.log(error);
                                    resolve();
                              }
                        );
                  } else {

                        resolve();
                  }
            });
      }

      registrarPedido_pouchDB() {
            this._pouchDBServices.get(this._idPedidoDB)
                  .then(doc => {
                        if (doc) {
                              this.pedido._id = this._idPedidoDB;
                              this._pouchDBServices.update(this.pedido);
                        }
                  })
                  .catch(err => {
                        if (err.status == 404) {
                              this._pouchDBServices.put(this._idPedidoDB, this.pedido);
                        } else {
                              console.log(err);
                        }
                  });
      }

      mostrarProductos(
            $event: any,
            subcategoria: Subcategoria
      ) {
            $event.preventDefault();

            this.mostrarPantallaProductos(subcategoria);
      }

      mostrarPantallaProductos(
            subcategoria: Subcategoria
      ) {
            if (this.categoriaSeleccionada.Descripcion.trim() != subcategoria.Descripcion.trim())
                  this.subcatergoriaCarrito += ' - ' + subcategoria.Descripcion;

            localStorage.setItem("subcatergoriaCarrito", this.subcatergoriaCarrito);
            localStorage.setItem("catergoriaCarrito", this.categoriaSeleccionada.Descripcion);

            //estas dos variables son para manejar el boton ATRAS
            localStorage.removeItem("IdTipoCarrito");
            localStorage.setItem("IdCategoriaCarrito", this.categoriaSeleccionada.Id.toString());

            this.textoBuscarProducto = '""';

            this._router.navigate(['/productos/true/' + subcategoria.Id + '/' + this.textoBuscarProducto]);
      }

      //TODO: la subcategoria que esta en promo deberia estar parametrizada
      mostrarProductosPromo(
            event: any
      ) {
            event.preventDefault();

            localStorage.setItem("promoVigenteVista", this.imagenBannerPromo);
            $('#modalBannerPromo').modal('hide');
            // this.textoBuscarProducto = 'Anillos en promo';
            // localStorage.setItem("subcatergoriaCarrito", this.textoBuscarProducto);
            // this._router.navigate(['/productos/true/-1/' + this.textoBuscarProducto]);
      }

      busquedaProducto(
            $event: any
      ) {
            $event.preventDefault();
            if (this.textoBuscarProducto.trim().length > 0) {
                  localStorage.setItem("subcatergoriaCarrito", this.textoBuscarProducto);
                  this._router.navigate(['/productos/true/-1/' + this.textoBuscarProducto]);
            }
      }

      mostrarCategoria(categoria: Categoria) {
            let mostrar: boolean = true;

            categoria.Subcategorias.forEach(item => {
                  mostrar = item.CantidadProductos > 0;
                  if (mostrar)
                        return mostrar;
            });

            return mostrar;
      }


      volverTipos(
            $event: any
      ) {
            $event.preventDefault();
            this.listarTipos = true;
            this.listarCategorias = false;
            this.listarSubcategorias = false;
      }

      volverCategorias(
            $event: any
      ) {
            $event.preventDefault();
            this.listarTipos = false;
            this.listarCategorias = true;
            this.listarSubcategorias = false;
      }

      mostrarCategorias(
            $event: any,
            tipo: Tipo
      ) {
            $event.preventDefault();
            this.mostrarItemsCategorias(tipo);
      }

      mostrarItemsCategorias(
            tipo: Tipo
      ) {
            this.tipoSeleccionado = tipo;

            if (this.tipoSeleccionado.Categorias.length === 1) {
                  this.mostrarItemsSubcategorias(this.tipoSeleccionado.Categorias[0])

            } else {
                  this.subcatergoriaCarrito = tipo.Descripcion + ' - ';
                  this.listarTipos = false;
                  this.listarCategorias = true;
                  this.listarSubcategorias = false;
            }
      }

      mostrarSubcategorias(
            $event: any,
            categoria: Categoria
      ) {
            $event.preventDefault();
            this.mostrarItemsSubcategorias(categoria);
      }

      mostrarItemsSubcategorias(categoria: Categoria) {

            localStorage.removeItem("IdCategoriaCarrito");
            if (this.tipoSeleccionado)
                  localStorage.setItem("IdTipoCarrito", this.tipoSeleccionado.Id.toString());

            this.categoriaSeleccionada = categoria;
            if (this.tipoSeleccionado.Descripcion.trim() != categoria.Descripcion.trim())
                  this.subcatergoriaCarrito = this.tipoSeleccionado.Descripcion + ' - ' + categoria.Descripcion;
            else
                  this.subcatergoriaCarrito = this.tipoSeleccionado.Descripcion;


            this.listadoSubcategorias = this.categoriaSeleccionada.Subcategorias.filter(item => item.Visible === true);

            this.listarTipos = false;
            this.listarCategorias = false;
            this.listarSubcategorias = true;
            // if (this.listadoSubcategorias && this.listadoSubcategorias.length == 1) {
            //       this.mostrarPantallaProductos(this.listadoSubcategorias[0]);
            // } else {
            // }
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
