USE [micatalogo]
GO
/****** Object:  StoredProcedure [dbo].[ProcesarDatosCatalogo]    Script Date: 08/11/2020 11:03:04 a.m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

ALTER procedure [dbo].[ProcesarDatosCatalogo]
as

delete micatalogo.dbo.tp_ProductoStockMovimientos
delete micatalogo.dbo.tp_ProductoStock
delete micatalogo.dbo.tp_Productos
delete micatalogo.dbo.tp_Subcategorias
delete micatalogo.dbo.tp_Categorias
delete micatalogo.dbo.tp_Tipos

--trading
insert into micatalogo.dbo.tp_Tipos (IdTipo, Descripcion, Vigente, Carpeta, Foto, Visible, Orden)
select IdTipo, Descripcion, Vigente, Carpeta, Foto, Visible, Orden from trading.dbo.tp_Tipos
--queenmary
insert into micatalogo.dbo.tp_Tipos (IdTipo, Descripcion, Vigente, Carpeta, Foto, Visible, Orden)
select IdTipo, Descripcion, Vigente, Carpeta, Foto, Visible, Orden from queenmary.dbo.tp_Tipos

--trading
insert into micatalogo.dbo.tp_Categorias (IdCategoria, Descripcion, Vigente, IdTipo, Carpeta, Foto, Orden)
select IdCategoria, Descripcion, Vigente, IdTipo, Carpeta, Foto, Orden from trading.dbo.tp_Categorias
--queenmary
insert into micatalogo.dbo.tp_Categorias (IdCategoria, Descripcion, Vigente, IdTipo, Carpeta, Foto, Orden)
select IdCategoria, Descripcion, Vigente, IdTipo, Carpeta, Foto, Orden from queenmary.dbo.tp_Categorias

--trading
insert into micatalogo.dbo.tp_Subcategorias (IdSubcategoria, Descripcion, Vigente, IdCategoria, Carpeta, CantidadProductos, MostrarMedidas)
select IdSubcategoria, Descripcion, Vigente, IdCategoria, Carpeta, CantidadProductos, MostrarMedidas from trading.dbo.tp_Subcategorias
--trading
insert into micatalogo.dbo.tp_Subcategorias (IdSubcategoria, Descripcion, Vigente, IdCategoria, Carpeta, CantidadProductos, MostrarMedidas)
select IdSubcategoria, Descripcion, Vigente, IdCategoria, Carpeta, CantidadProductos, MostrarMedidas from queenmary.dbo.tp_Subcategorias


--trading
select	p.IdProducto, sum(ps.Stock) as StockReal, sum(ps.Reservado) as Reservado, sum(ps.Stock-ps.Reservado) as Disponible
into #tmp_ProductosConStock_Trading
from trading.dbo.tp_Productos p inner join trading.dbo.tp_ProductoStock ps on p.IdProducto = ps.IdProducto
group by p.IdProducto
having sum(ps.Stock-ps.Reservado) > 0

insert into micatalogo.dbo.tp_Productos (Descripcion, Vigente, Codigo, Peso, Ubicacion, Foto, IdSubcategoria, IdListaPrecio, Stock, TipoPrecio, PrecioUnitario, StockPropio, FotoLink)
select Descripcion, Vigente, Codigo, Peso, Ubicacion, Foto, IdSubcategoria, 31 IdListaPrecio, Stock, TipoPrecio, PrecioUnitario, StockPropio, FotoLink 
from trading.dbo.tp_Productos
where IdProducto in (select IdProducto from #tmp_ProductosConStock_Trading)


--queenmary
select	p.IdProducto, sum(ps.Stock) as StockReal, sum(ps.Reservado) as Reservado, sum(ps.Stock-ps.Reservado) as Disponible
into #tmp_ProductosConStock_QueenMary
from queenmary.dbo.tp_Productos p inner join queenmary.dbo.tp_ProductoStock ps on p.IdProducto = ps.IdProducto
group by p.IdProducto
having sum(ps.Stock-ps.Reservado)>0

insert into micatalogo.dbo.tp_Productos (Descripcion, Vigente, Codigo, Peso, Ubicacion, Foto, IdSubcategoria, IdListaPrecio, Stock, TipoPrecio, PrecioUnitario, StockPropio, FotoLink)
select Descripcion, Vigente, Codigo, Peso, Ubicacion, Foto, IdSubcategoria, 31 IdListaPrecio, Stock, TipoPrecio, PrecioUnitario, StockPropio, FotoLink 
from queenmary.dbo.tp_Productos 
where	StockPropio = 1
	and IdProducto in (select IdProducto from #tmp_ProductosConStock_QueenMary)


select IdProducto, Descripcion, Vigente, Codigo, Peso, Ubicacion, Foto, IdSubcategoria, 31 IdListaPrecio, Stock, TipoPrecio, PrecioUnitario, StockPropio, FotoLink 
from micatalogo.dbo.tp_Productos 



update micatalogo.dbo.tp_Tipos set Visible = 0  where IdTipo in (3, 100)

update micatalogo.dbo.tp_Tipos set Orden = 2 where IdTipo = 1
update micatalogo.dbo.tp_Tipos set Orden = 3 where IdTipo = 2
update micatalogo.dbo.tp_Tipos set Orden = 4 where IdTipo = 3
update micatalogo.dbo.tp_Tipos set Orden = 1 where IdTipo = 4
update micatalogo.dbo.tp_Tipos set Orden = 7 where IdTipo = 100
update micatalogo.dbo.tp_Tipos set Orden = 6 where IdTipo = 101
update micatalogo.dbo.tp_Tipos set Orden = 5 where IdTipo = 102


update micatalogo.dbo.tp_Tipos set Foto = 'TipoOferta.jpg' where IdTipo = 4

drop table #tmp_ProductosConStock_Trading
