import { Component, OnInit } from '@angular/core';
import { CotizacionesService } from '../../services/cotizaciones.service';
import { Cotizacion } from '../../models/Cotizacion';
import { ParametroServices } from '../../services/parametro.services';
import { Parametro } from '../../models/parametro';


declare var $: any;


@Component({
      selector: 'app-settingcotizaciones',
      templateUrl: './settingcotizaciones.component.html',
      styleUrls: ['./settingcotizaciones.component.css']
})
export class SettingcotizacionesComponent implements OnInit {

      public titulo: string = 'Cotización Dólar EEUU';
      public listCotizaciones: Array<Cotizacion>;
      public cotizacionSeleccionada: Cotizacion;

      public paramsMonedaVenta: Parametro;
      public monedaVentaSeleccionada: string;

      constructor(
            private _parametroServices: ParametroServices,
            private _cotizacionService: CotizacionesService
      ) {
            this.listCotizaciones = new Array<Cotizacion>();
      }

      ngOnInit() {
            this.inicializarControles();
            this.cotizacionSeleccionada = new Cotizacion();
      }

      async inicializarControles() {
            await this.obtenerMonedaVenta()
                  .then(result => {
                        return this.getCotizaciones();
                  });
      }

      obtenerMonedaVenta() {
            /* MONEDA_VENTA => valores posibles
             * * PESO_ARGENTINO 
             * * DOLAR_EEUU 
             */
            return new Promise((resolve, reject) => {
                  this._parametroServices.getParametroValor('MONEDA_VENTA').subscribe(
                        (response: Parametro) => {
                              console.log(response);
                              if (response) {
                                    this.paramsMonedaVenta = response;
                                    this.monedaVentaSeleccionada = this.paramsMonedaVenta.Valor;
                              }
                              resolve();
                        },
                        error => { reject(<any>error); }
                  );
            });
      }

      getCotizaciones() {
            return new Promise((resolve, reject) => {
                  this._cotizacionService.getCotizaciones().subscribe(
                        response => {
                              if (response) this.listCotizaciones = response;
                        },
                        error => {
                              console.log(<any>error);
                        }
                  );
            });
      }

      agregarItem(
            event: any
      ) {
            event.preventDefault();
            this.cotizacionSeleccionada = new Cotizacion();
            this.cotizacionSeleccionada.Id = -1;
      }

      editarItem(
            event: any,
            item: Cotizacion) {
            event.preventDefault();
            this.cotizacionSeleccionada = item;
      }

      cancelar(
            event: any
      ) {
            event.preventDefault();
            if (this.listCotizaciones.length > 0)
                  this.cotizacionSeleccionada = this.listCotizaciones[0];
      }

      guardar(
            event: any
      ) {
            event.preventDefault();

            if (this.cotizacionSeleccionada && this.cotizacionSeleccionada.Cotizacion != null) {
                  this._cotizacionService.saveCotizacion(this.cotizacionSeleccionada).subscribe(
                        response => {
                              this.cotizacionSeleccionada = response;
                              this.getCotizaciones();
                              this.mostrarMensaje(1);
                        },
                        error => {
                              this.mostrarMensaje(2);
                              console.log(<any>error);
                        }
                  );
            }

      }

      confirmarEliminacion(
            $event: any,
            item: Cotizacion
      ) {
            $event.preventDefault();
            this.cotizacionSeleccionada = item;
            $('#modalConfirmaEliminacion').modal('show');
      }

      eliminar(
            event: any
      ) {
            event.preventDefault();
            if (this.cotizacionSeleccionada) {
                  this._cotizacionService.deleteCotizacion(this.cotizacionSeleccionada.Id).subscribe(
                        response => {
                              $('#modalConfirmaEliminacion').modal('hide');
                              this.mostrarMensaje(1);
                              this.cotizacionSeleccionada = new Cotizacion();
                              this.getCotizaciones();
                        },
                        error => {
                              this.mostrarMensaje(2);
                              console.log(<any>error);
                        }
                  );
            }
      }


      mostrarMensaje(tipo) {

            if (tipo == 1) {
                  $("#msj-alert").removeClass("alert alert-danger");
                  $("#msj-alert").addClass("alert alert-success");
                  $("#ml-FormContactoMensaje").text('Los datos se atualizaron correctamente.');
            } else {
                  $("#msj-alert").removeClass("alert alert-success");
                  $("#msj-alert").addClass("alert alert-danger");
                  $("#ml-FormContactoMensaje").text('Ocurrió un error.');
            }

            $("#msj-alert").show();

            setTimeout(function () {
                  $("#msj-alert").slideUp();
            }, 3000);
      }

      setearMonedaVenta(
            monedaVenta: string
      ) {
            this.monedaVentaSeleccionada = monedaVenta;
      }

      guardarMonedaVenta(
            event: any
      ) {
            event.preventDefault();
            this.paramsMonedaVenta.Valor = this.monedaVentaSeleccionada;
            if (this.paramsMonedaVenta) {
                  this._parametroServices.saveParametro(this.paramsMonedaVenta).subscribe(
                        response => {
                              this.mostrarMensaje(1);
                        },
                        error => {
                              this.mostrarMensaje(2);
                              console.log(<any>error);
                        }
                  );
            }
      }
}
