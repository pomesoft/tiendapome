"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.SettingclientesComponent = void 0;
var core_1 = require("@angular/core");
var cliente_1 = require("../../models/cliente");
var listaPrecio_1 = require("../../models/listaPrecio");
var SettingclientesComponent = /** @class */ (function () {
    function SettingclientesComponent(_clientesServices, _listaPreciosServices, _notifier) {
        this._clientesServices = _clientesServices;
        this._listaPreciosServices = _listaPreciosServices;
        this._notifier = _notifier;
        this.titulo = "Clientes";
        this.entidadElimina = '';
        this.textoConfirmaEliminacion = '';
        this.modoBusqueda = false;
        this.mostrarCodigo = false;
        this.page = 1;
        this.textoFiltro = '';
    }
    SettingclientesComponent.prototype.ngOnInit = function () {
        this.getProvincias();
    };
    SettingclientesComponent.prototype.getProvincias = function () {
        var _this = this;
        this._clientesServices.getProvincias().subscribe(function (response) {
            if (response) {
                _this.Provincias = response;
            }
            _this.getSituacionesIVA();
        }, function (error) {
            console.log(error);
        });
    };
    SettingclientesComponent.prototype.getSituacionesIVA = function () {
        var _this = this;
        this._clientesServices.getSituacionesIVA().subscribe(function (response) {
            if (response) {
                _this.SituacionesIVA = response;
            }
            _this.getRoles();
        }, function (error) {
            console.log(error);
        });
    };
    SettingclientesComponent.prototype.getRoles = function () {
        var _this = this;
        this._clientesServices.getRoles().subscribe(function (response) {
            if (response) {
                _this.Roles = response;
            }
            _this.getListaPreciosProducto();
        }, function (error) {
            console.log(error);
        });
    };
    SettingclientesComponent.prototype.getListaPreciosProducto = function () {
        var _this = this;
        this._listaPreciosServices.getListaPreciosVigentes().subscribe(function (response) {
            if (response) {
                _this.listaPreciosProducto = response;
            }
            if (_this.modoBusqueda)
                _this.busquedaGetClientes();
            else
                _this.getClientes();
        }, function (error) {
            console.log(error);
        });
    };
    SettingclientesComponent.prototype.getClientes = function () {
        var _this = this;
        this.modoBusqueda = false;
        this._clientesServices.getClientes().subscribe(function (response) {
            if (response) {
                _this.Clientes = response;
                if (_this.Clientes.length > 0 && !_this.clienteSeleccionado)
                    _this.getCliente(_this.Clientes[0].Id);
            }
        }, function (error) {
            _this.showNotification('error', 'No se pudo obtener los clientes correctamente.');
            console.log(error);
        });
    };
    SettingclientesComponent.prototype.busquedaClientes = function ($event) {
        $event.preventDefault();
        if (this.textoFiltro.trim().length == 0) {
            this.getClientes();
        }
        else {
            this.modoBusqueda = true;
            this.busquedaGetClientes();
        }
    };
    SettingclientesComponent.prototype.busquedaGetClientes = function () {
        var _this = this;
        this._clientesServices.searchClientes(this.textoFiltro).subscribe(function (response) {
            if (response) {
                _this.Clientes = response;
                if (_this.Clientes.length > 0 && !_this.clienteSeleccionado)
                    _this.getCliente(_this.Clientes[0].Id);
            }
        }, function (error) {
            _this.showNotification('error', 'No se pudo obtener los clientes correctamente.');
            console.log(error);
        });
    };
    SettingclientesComponent.prototype.listarSoloSinLista = function ($event) {
        var _this = this;
        $event.preventDefault();
        this._clientesServices.getClientesSinListasPrecio().subscribe(function (response) {
            if (response) {
                _this.Clientes = response;
                if (_this.Clientes.length > 0 && !_this.clienteSeleccionado)
                    _this.getCliente(_this.Clientes[0].Id);
            }
        }, function (error) {
            _this.showNotification('error', 'No se pudo obtener los clientes correctamente.');
            console.log(error);
        });
    };
    SettingclientesComponent.prototype.agregarItem = function ($event) {
        $event.preventDefault();
        this.clienteSeleccionado = new cliente_1.Cliente();
    };
    SettingclientesComponent.prototype.editarItem = function ($event, item) {
        $event.preventDefault();
        this.mostrarCodigo = false;
        this.getCliente(item.Id);
    };
    SettingclientesComponent.prototype.getCliente = function (idCliente) {
        var _this = this;
        this._clientesServices.getCliente(idCliente).subscribe(function (response) {
            if (response) {
                _this.clienteSeleccionado = response;
            }
        }, function (error) {
            _this.showNotification('error', 'No se pudo obtener el cliente seleccionado.');
            console.log(error);
        });
    };
    SettingclientesComponent.prototype.guardar = function ($event) {
        var _this = this;
        $event.preventDefault();
        if (this.clienteSeleccionado) {
            var provincia = new cliente_1.Provincia();
            provincia.Id = this.clienteSeleccionado.IdProvincia;
            this.clienteSeleccionado.Provincia = provincia;
            var situacioniva = new cliente_1.SituacionIVA();
            situacioniva.Id = this.clienteSeleccionado.IdSituacionIVA;
            this.clienteSeleccionado.SituacionIVA = situacioniva;
            this._clientesServices.saveCliente(this.clienteSeleccionado).subscribe(function (response) {
                _this.showNotification('success', 'El cliente se actualizó correctamente.');
                _this.clienteSeleccionado = response;
                if (_this.modoBusqueda)
                    _this.busquedaGetClientes();
                else
                    _this.getClientes();
            }, function (error) {
                _this.showNotification('error', error.error.Message);
                console.log(error);
            });
        }
    };
    SettingclientesComponent.prototype.confirmarEliminacion = function ($event, item) {
        $event.preventDefault();
        this.clienteSeleccionado = item;
        this.entidadElimina = 'CLIENTE';
        this.textoConfirmaEliminacion = '¿Desea eliminar el cliente ' + this.clienteSeleccionado.Email + '?';
        $('#modalConfirmaEliminacion').modal('show');
    };
    SettingclientesComponent.prototype.eliminar = function ($event) {
        $event.preventDefault();
        $('#modalConfirmaEliminacion').modal('hide');
        console.log(this.entidadElimina);
        switch (this.entidadElimina) {
            case 'CLIENTE': {
                this.eliminarCliente();
                break;
            }
            case 'LISTA_PRECIO': {
                this.eliminarClienteLista();
                break;
            }
        }
    };
    SettingclientesComponent.prototype.eliminarCliente = function () {
        var _this = this;
        if (this.clienteSeleccionado) {
            this._clientesServices.deleteCliente(this.clienteSeleccionado.Id).subscribe(function (response) {
                if (response) {
                    _this.showNotification('error', 'El cliente se eliminó correctamente.');
                    _this.clienteSeleccionado = null;
                    if (_this.modoBusqueda)
                        _this.busquedaGetClientes();
                    else
                        _this.getClientes();
                }
            }, function (error) {
                _this.showNotification('error', 'El cliente no se pudo eliminar.');
                console.log(error);
            });
        }
    };
    SettingclientesComponent.prototype.agregarItemListaCliente = function ($event) {
        $event.preventDefault();
        this.clienteLista = new cliente_1.ClienteLista();
        console.log('*** agregarItemListaCliente() => ');
        console.log(this.clienteSeleccionado);
        this.clienteLista.IdCliente = this.clienteSeleccionado.Id;
        this.clienteLista.ListaPrecio = new listaPrecio_1.ListaPrecio();
        this.clienteLista.ListaPrecioCliente = new listaPrecio_1.ListaPrecioCliente();
        this.listaPreciosCliente = [];
        $('#modalListaCliente').modal('show');
    };
    SettingclientesComponent.prototype.editarItemListaCliente = function ($event, item) {
        var _this = this;
        $event.preventDefault();
        console.log(item);
        this.clienteLista = item;
        this.listaPreciosProducto = new Array();
        this.listaPreciosProducto.push(this.clienteLista.ListaPrecio);
        this._listaPreciosServices.getListaPreciosClienteVigentes(this.clienteLista.ListaPrecio.Id).subscribe(function (response) {
            if (response)
                _this.listaPreciosCliente = response;
        }, function (error) {
            console.log(error);
        });
        $('#modalListaCliente').modal('show');
    };
    SettingclientesComponent.prototype.onChangeListaProducto = function ($event) {
        var _this = this;
        this.listaPreciosCliente = [];
        this._listaPreciosServices.getItemLitaPrecio(+$event.target.value).subscribe(function (response) {
            if (response) {
                _this.clienteLista.ListaPrecio = response;
                _this._listaPreciosServices.getListaPreciosClienteVigentes(_this.clienteLista.ListaPrecio.Id).subscribe(function (response) {
                    if (response)
                        _this.listaPreciosCliente = response;
                }, function (error) {
                    console.log(error);
                });
            }
        }, function (error) {
            console.log(error);
        });
    };
    SettingclientesComponent.prototype.onChangeListaCliente = function ($event) {
        var _this = this;
        this._listaPreciosServices.getItemLitaPrecioCliente(+$event.target.value).subscribe(function (response) {
            if (response)
                _this.clienteLista.ListaPrecioCliente = response;
        }, function (error) {
            console.log(error);
        });
    };
    SettingclientesComponent.prototype.guardarListaCliente = function ($event) {
        var _this = this;
        $event.preventDefault();
        $('#modalListaCliente').modal('hide');
        if (this.clienteLista.ListaPrecio != null && this.clienteLista.ListaPrecioCliente != null) {
            this._clientesServices.saveClienteLista(this.clienteLista).subscribe(function (response) {
                _this.showNotification('success', 'La lista de precios para el cliente se actualizó correctamente.');
                _this.getCliente(_this.clienteLista.IdCliente);
                _this.clienteLista = new cliente_1.ClienteLista();
            }, function (error) {
                _this.showNotification('error', error.error.Message);
                console.log(error);
            });
        }
    };
    SettingclientesComponent.prototype.confirmarEliminacionListaCliente = function ($event, item) {
        $event.preventDefault();
        this.clienteLista = item;
        this.entidadElimina = 'LISTA_PRECIO';
        this.textoConfirmaEliminacion = '¿Desea eliminar la lista de precio ' + this.clienteLista.ListaPrecio.Codigo + ' al cliente?';
        $('#modalConfirmaEliminacion').modal('show');
    };
    SettingclientesComponent.prototype.eliminarClienteLista = function () {
        var _this = this;
        if (this.clienteLista) {
            this._clientesServices.deleteClienteLista(this.clienteLista.Id).subscribe(function (response) {
                if (response) {
                    _this.showNotification('error', 'La lista asignada al cliente se eliminó correctamente.');
                    _this.clienteLista = null;
                    _this.getCliente(_this.clienteSeleccionado.Id);
                }
            }, function (error) {
                _this.showNotification('error', 'La lista asignada al cliente no se pudo eliminar.');
                console.log(error);
            });
        }
    };
    SettingclientesComponent.prototype.dameCodigo = function ($event) {
        $event.preventDefault();
        this.mostrarCodigo = !this.mostrarCodigo;
    };
    SettingclientesComponent.prototype.enviarWhatsApp = function ($event) {
        $event.preventDefault();
        if (this.clienteSeleccionado && this.clienteSeleccionado.Celular) {
            var urlDesktop = 'https://web.whatsapp.com/';
            var urlMobile = 'https://api.whatsapp.com/';
            var mensaje = 'send?phone=549' + this.clienteSeleccionado.Celular + '&text=%20';
            //let mensaje = 'send?phone=5493624098916&text=%20';
            if (this.isMobile()) {
                window.open(urlMobile + mensaje, '_blank');
            }
            else {
                window.open(urlDesktop + mensaje, '_blank');
            }
        }
    };
    SettingclientesComponent.prototype.isMobile = function () {
        if (sessionStorage.desktop)
            return false;
        else if (localStorage.mobile)
            return true;
        var mobile = ['iphone', 'ipad', 'android', 'blackberry', 'nokia', 'opera mini', 'windows mobile', 'windows phone', 'iemobile'];
        for (var i in mobile)
            if (navigator.userAgent.toLowerCase().indexOf(mobile[i].toLowerCase()) > 0)
                return true;
        return false;
    };
    SettingclientesComponent.prototype.showNotification = function (type, message) {
        this._notifier.notify(type, message);
    };
    SettingclientesComponent.prototype.hideOldestNotification = function () {
        this._notifier.hideOldest();
    };
    SettingclientesComponent = __decorate([
        core_1.Component({
            selector: 'app-settingclientes',
            templateUrl: './settingclientes.component.html',
            styleUrls: ['./settingclientes.component.css']
        })
    ], SettingclientesComponent);
    return SettingclientesComponent;
}());
exports.SettingclientesComponent = SettingclientesComponent;
