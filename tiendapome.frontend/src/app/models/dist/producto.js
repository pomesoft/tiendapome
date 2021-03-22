"use strict";
exports.__esModule = true;
exports.ProductoGrupoOrden = exports.ProductoStock = exports.ProductoList = exports.Producto = void 0;
var subcategoria_1 = require("./subcategoria");
var Producto = /** @class */ (function () {
    function Producto(Id, Codigo, Descripcion, Subcategoria, Peso, ListaPrecio, Ubicacion, Stock, Foto, Path, CantidadPedido, IdTipo, IdCategoria, DescripcionTipo, DescripcionCategoria, DescripcionSubcategoria, TipoPrecio, PrecioUnitario, PrecioPorPeso, PrecioPorPieza, PrecioUnitarioFinal, ProductoPedido, MonedaVenta, FotoLink, MostrarMedidas, ObservacionesPedido, StockReal, StockReservado, ProductoStock, IdDocumentoVenta, GrupoOrden) {
        this.Id = Id;
        this.Codigo = Codigo;
        this.Descripcion = Descripcion;
        this.Subcategoria = Subcategoria;
        this.Peso = Peso;
        this.ListaPrecio = ListaPrecio;
        this.Ubicacion = Ubicacion;
        this.Stock = Stock;
        this.Foto = Foto;
        this.Path = Path;
        this.CantidadPedido = CantidadPedido;
        this.IdTipo = IdTipo;
        this.IdCategoria = IdCategoria;
        this.DescripcionTipo = DescripcionTipo;
        this.DescripcionCategoria = DescripcionCategoria;
        this.DescripcionSubcategoria = DescripcionSubcategoria;
        this.TipoPrecio = TipoPrecio;
        this.PrecioUnitario = PrecioUnitario;
        this.PrecioPorPeso = PrecioPorPeso;
        this.PrecioPorPieza = PrecioPorPieza;
        this.PrecioUnitarioFinal = PrecioUnitarioFinal;
        this.ProductoPedido = ProductoPedido;
        this.MonedaVenta = MonedaVenta;
        this.FotoLink = FotoLink;
        this.MostrarMedidas = MostrarMedidas;
        this.ObservacionesPedido = ObservacionesPedido;
        this.StockReal = StockReal;
        this.StockReservado = StockReservado;
        this.ProductoStock = ProductoStock;
        this.IdDocumentoVenta = IdDocumentoVenta;
        this.GrupoOrden = GrupoOrden;
        this.ProductoStock = new Array();
        this.Stock = 0;
        this.StockReal = 0;
        this.StockReservado = 0;
        this.GrupoOrden = new ProductoGrupoOrden();
    }
    return Producto;
}());
exports.Producto = Producto;
var ProductoList = /** @class */ (function () {
    function ProductoList() {
    }
    return ProductoList;
}());
exports.ProductoList = ProductoList;
var ProductoStock = /** @class */ (function () {
    function ProductoStock() {
        this.Medida = new subcategoria_1.Medida();
    }
    return ProductoStock;
}());
exports.ProductoStock = ProductoStock;
var ProductoGrupoOrden = /** @class */ (function () {
    function ProductoGrupoOrden() {
        this.Id = -1;
    }
    return ProductoGrupoOrden;
}());
exports.ProductoGrupoOrden = ProductoGrupoOrden;
