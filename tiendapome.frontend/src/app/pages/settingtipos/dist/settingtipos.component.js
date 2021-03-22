"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.SettingtiposComponent = void 0;
var core_1 = require("@angular/core");
var tipo_1 = require("../../models/tipo");
var categoria_1 = require("../../models/categoria");
var subcategoria_1 = require("../../models/subcategoria");
var SettingtiposComponent = /** @class */ (function () {
    function SettingtiposComponent(_tiposServices, _notifier) {
        this._tiposServices = _tiposServices;
        this._notifier = _notifier;
        this.titulo = 'Tipos';
        this.tipoSeleccionado = new tipo_1.Tipo(-1);
        this.categoriaSeleccionada = new categoria_1.Categoria(-1);
        this.subcategoriaSeleccionada = new subcategoria_1.Subcategoria(-1);
    }
    SettingtiposComponent.prototype.ngOnInit = function () {
        this.inicializarControles();
    };
    SettingtiposComponent.prototype.inicializarControles = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getTiposABM(-1, -1)
                            .then(function (result) {
                            return _this.getMedidas();
                        })["catch"](function (err) {
                            _this.showNotification('error', 'Ocurrió un error al cargar la página.');
                            console.log(err);
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SettingtiposComponent.prototype.getTiposABM = function (idTipoSeleccionar, idCategoriaSeleccionar) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this._tiposServices.getTiposABM()
                .subscribe(function (response) {
                _this.listTipos = response;
                if (idTipoSeleccionar > 0) {
                    _this.listTipos.forEach(function (item) {
                        if (item.Id == idTipoSeleccionar) {
                            _this.tipoSeleccionado = item;
                        }
                    });
                    if (idCategoriaSeleccionar > 0) {
                        _this.tipoSeleccionado.Categorias.forEach(function (item) {
                            if (item.Id == idCategoriaSeleccionar) {
                                _this.categoriaSeleccionada = item;
                            }
                        });
                    }
                }
                resolve(response);
            }, function (error) { reject(error); });
        });
    };
    SettingtiposComponent.prototype.getMedidas = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this._tiposServices.getMedidas()
                .subscribe(function (response) {
                if (response)
                    _this.listMedidas = response;
                resolve(response);
            }, function (error) { reject(error); });
        });
    };
    SettingtiposComponent.prototype.onClickAgregarTipo = function (event) {
        event.preventDefault();
        this.tipoSeleccionado = new tipo_1.Tipo(-1);
        this.tipoSeleccionado.Orden = this.listTipos.length + 1;
        this.tipoSeleccionado.Visible = true;
        $('#modalItemTipo').modal('show');
    };
    SettingtiposComponent.prototype.onClickSeleccionarTipo = function (event, item) {
        event.preventDefault();
        this.tipoSeleccionado = item;
        this.categoriaSeleccionada = new categoria_1.Categoria(-1);
        this.subcategoriaSeleccionada = new subcategoria_1.Subcategoria(-1);
    };
    SettingtiposComponent.prototype.onClickEditarTipo = function (event, item) {
        event.preventDefault();
        this.onClickSeleccionarTipo(event, item);
        $('#modalItemTipo').modal('show');
    };
    SettingtiposComponent.prototype.onClickEliminarItemTipo = function (event) {
        var _this = this;
        event.preventDefault();
        if (this.tipoSeleccionado.Descripcion.trim().length > 0) {
            this._tiposServices.deleteItemMenu(this.tipoSeleccionado.Id)
                .subscribe(function (response) {
                _this.procesando = false;
                if (response) {
                    _this.getTiposABM(-1, -1);
                    _this.showNotification('success', 'Los datos se actualizaron correctamente.');
                    $('#modalItemTipo').modal('hide');
                }
            }, function (error) {
                _this.procesando = false;
                _this.showNotification('error', 'Ocurrió un error al actualizar los datos.');
                console.log(error);
            });
        }
    };
    SettingtiposComponent.prototype.onClickEliminarTipo = function (event) {
        event.preventDefault();
    };
    SettingtiposComponent.prototype.onClickGuardarItemTipo = function (event) {
        var _this = this;
        event.preventDefault();
        if (this.tipoSeleccionado.Descripcion.trim().length > 0) {
            this._tiposServices.saveItemMenu(this.tipoSeleccionado)
                .subscribe(function (response) {
                _this.procesando = false;
                if (response) {
                    _this.getTiposABM(-1, -1);
                    _this.showNotification('success', 'Los datos se actualizaron correctamente.');
                    $('#modalItemTipo').modal('hide');
                }
            }, function (error) {
                _this.procesando = false;
                _this.showNotification('error', 'Ocurrió un error al actualizar los datos.');
                console.log(error);
            });
        }
    };
    SettingtiposComponent.prototype.onClickAgregarCategoria = function (event) {
        event.preventDefault();
        this.categoriaSeleccionada = new categoria_1.Categoria(-1);
        this.categoriaSeleccionada.IdTipo = this.tipoSeleccionado.Id;
        this.categoriaSeleccionada.Orden = this.tipoSeleccionado.Categorias.length + 1;
        this.categoriaSeleccionada.Visible = true;
        $('#modalItemCategoria').modal('show');
    };
    SettingtiposComponent.prototype.onClickSeleccionarCategoria = function (event, item) {
        event.preventDefault();
        this.categoriaSeleccionada = item;
        this.subcategoriaSeleccionada = new subcategoria_1.Subcategoria(-1);
    };
    SettingtiposComponent.prototype.onClickEditarCatgoria = function (event, item) {
        event.preventDefault();
        this.onClickSeleccionarCategoria(event, item);
        this.categoriaSeleccionada.IdTipo = this.tipoSeleccionado.Id;
        $('#modalItemCategoria').modal('show');
    };
    SettingtiposComponent.prototype.onClickGuardarItemCategoria = function (event) {
        var _this = this;
        event.preventDefault();
        if (this.categoriaSeleccionada.Descripcion.trim().length > 0) {
            this._tiposServices.saveCategoria(this.categoriaSeleccionada)
                .subscribe(function (response) {
                _this.procesando = false;
                _this.getTiposABM(_this.categoriaSeleccionada.IdTipo, _this.categoriaSeleccionada.Id);
                _this.showNotification('success', 'Los datos se actualizaron correctamente.');
                $('#modalItemCategoria').modal('hide');
            }, function (error) {
                _this.procesando = false;
                _this.showNotification('error', 'Ocurrió un error al actualizar los datos.');
                console.log(error);
            });
        }
    };
    SettingtiposComponent.prototype.onClickEliminarItemCategoria = function (event) {
        var _this = this;
        event.preventDefault();
        if (this.categoriaSeleccionada.Descripcion.trim().length > 0) {
            this._tiposServices.deleteCategoria(this.categoriaSeleccionada.Id)
                .subscribe(function (response) {
                _this.procesando = false;
                _this.getTiposABM(_this.categoriaSeleccionada.IdTipo, -1);
                _this.showNotification('success', 'Los datos se actualizaron correctamente.');
                $('#modalItemCategoria').modal('hide');
            }, function (error) {
                _this.procesando = false;
                _this.showNotification('error', 'Ocurrió un error al actualizar los datos.');
                console.log(error);
            });
        }
    };
    SettingtiposComponent.prototype.onClickAgregarSubcategoria = function (event) {
        event.preventDefault();
        this.subcategoriaSeleccionada = new subcategoria_1.Subcategoria(-1);
        this.subcategoriaSeleccionada.IdCategoria = this.categoriaSeleccionada.Id;
        this.subcategoriaSeleccionada.Orden = this.categoriaSeleccionada.Subcategorias.length + 1;
        this.subcategoriaSeleccionada.Visible = true;
        this.listMedidas.forEach(function (item) {
            item.Chequed = false;
        });
        console.log('this.subcategoriaSeleccionada', this.subcategoriaSeleccionada);
        console.log('this.listMedidas', this.listMedidas);
        $('#modalItemSubcategoria').modal('show');
    };
    SettingtiposComponent.prototype.onClickEditarSubcatgoria = function (event, item) {
        var _this = this;
        event.preventDefault();
        this.subcategoriaSeleccionada = item;
        this.subcategoriaSeleccionada.IdCategoria = this.categoriaSeleccionada.Id;
        this.listMedidas.forEach(function (item) {
            item.Chequed = _this.subcategoriaSeleccionada.Medidas.find(function (sm) { return sm.Medida.Id === item.Id; }) != null;
        });
        $('#modalItemSubcategoria').modal('show');
    };
    SettingtiposComponent.prototype.onClickGuardarItemSubcategoria = function (event) {
        var _this = this;
        event.preventDefault();
        if (this.subcategoriaSeleccionada.Descripcion.trim().length > 0) {
            var values = this.listMedidas.filter(function (opt) { return opt.Chequed; }).map(function (opt) { return opt; });
            this.subcategoriaSeleccionada.Medidas = [];
            values.forEach(function (item) {
                var subcateMedida = new subcategoria_1.SubcategoriaMedida();
                subcateMedida.Medida = item;
                _this.subcategoriaSeleccionada.Medidas.push(subcateMedida);
            });
            console.log('this.subcategoriaSeleccionada', this.subcategoriaSeleccionada);
            this._tiposServices.saveSubcategoria(this.subcategoriaSeleccionada)
                .subscribe(function (response) {
                _this.procesando = false;
                _this.getTiposABM(_this.tipoSeleccionado.Id, _this.categoriaSeleccionada.Id);
                _this.showNotification('success', 'Los datos se actualizaron correctamente.');
                $('#modalItemSubcategoria').modal('hide');
            }, function (error) {
                _this.procesando = false;
                _this.showNotification('error', 'Ocurrió un error al actualizar los datos.');
                console.log(error);
            });
        }
    };
    SettingtiposComponent.prototype.onClickEliminarItemSubcategoria = function (event) {
        var _this = this;
        event.preventDefault();
        debugger;
        if (this.subcategoriaSeleccionada.Descripcion.trim().length > 0) {
            this._tiposServices.deleteSubcategoria(this.subcategoriaSeleccionada.Id)
                .subscribe(function (response) {
                _this.procesando = false;
                _this.getTiposABM(_this.tipoSeleccionado.Id, _this.categoriaSeleccionada.Id);
                _this.showNotification('success', 'Los datos se actualizaron correctamente.');
                $('#modalItemSubcategoria').modal('hide');
            }, function (error) {
                _this.procesando = false;
                _this.showNotification('error', 'Ocurrió un error al actualizar los datos.');
                console.log(error);
            });
        }
    };
    SettingtiposComponent.prototype.showNotification = function (type, message) {
        this._notifier.notify(type, message);
    };
    SettingtiposComponent.prototype.hideOldestNotification = function () {
        this._notifier.hideOldest();
    };
    SettingtiposComponent = __decorate([
        core_1.Component({
            selector: 'app-settingtipos',
            templateUrl: './settingtipos.component.html',
            styleUrls: ['./settingtipos.component.css']
        })
    ], SettingtiposComponent);
    return SettingtiposComponent;
}());
exports.SettingtiposComponent = SettingtiposComponent;
