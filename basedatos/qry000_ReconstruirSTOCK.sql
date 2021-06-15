
use trading
go


exec [dbo].[sp_ProcesarMovimientosStock] 
exec [dbo].[sp_ProcesarMovimientosStockInidicadores]




/*verificacion*/
select p.Codigo, ps.* 
from tp_Productos p inner join tp_ProductoStock ps on p.IdProducto = ps.IdProducto 
where ps.Stock < 0 -- p.Codigo = 3584	  


declare @idProductoStock int
set @idProductoStock = 8002


select * from dm_MovimientosStock where IdProductoStock = @idProductoStock order by Orden, Fecha
select * from dbo.dm_MovimientosStockInidicadores where IdProductoStock = @idProductoStock 

select * from tp_ProductoStockMovimientos where IdProductoStock = @idProductoStock 

select ped.Fecha, ped.Numero, ped.IdEstado, pip.IdProductoStock, pip.Cantidad
from tp_PedidoItemProducto		pip
	inner join tp_PedidoItems	pit on pip.IdPedidoItem = pit.IdPedidoItem
	inner join tp_Pedidos		ped on pit.IdPedido = ped.IdPedido
where pip.Cantidad > 0
	and ped.IdEstado in (2,3, 4,9)
	and pip.IdProductoStock = @idProductoStock 
order by ped.Fecha

select * 
from tp_DocumentoVentaItems	dvi 
	inner join tp_DocumentosVenta dv  on dv.IdVenta = dvi.IdVenta
where dvi.IdProductoStock = @idProductoStock --  dv.IdTipo = 2




/* actualizacion stock */
select p.Codigo, ps.IdProductoStock, ps.Stock, msi.StockFisico, msi.StockFisicoCalculado 
from trading.dbo.tp_ProductoStock ps
	inner join trading.dbo.tp_Productos p on ps.IdProducto = p.IdProducto
	inner join trading.dbo.dm_MovimientosStockInidicadores msi on msi.IdProductoStock = ps.IdProductoStock
where ps.Stock <> msi.StockFisicoCalculado and msi.StockFisicoCalculado > 0 

--update ps set ps.Stock = msi.StockFisicoCalculado 
--from trading.dbo.tp_ProductoStock ps
--	inner join trading.dbo.tp_Productos p on ps.IdProducto = p.IdProducto
--	inner join trading.dbo.dm_MovimientosStockInidicadores msi on msi.IdProductoStock = ps.IdProductoStock
--where ps.Stock <> msi.StockFisicoCalculado and msi.StockFisicoCalculado > 0

select p.Codigo, ps.IdProductoStock, ps.Reservado, msi.StockReservado, msi.StockReservadoCalculado, msi.StockReservadodiferencia
from trading.dbo.tp_ProductoStock ps
	inner join trading.dbo.tp_Productos p on ps.IdProducto = p.IdProducto
	inner join trading.dbo.dm_MovimientosStockInidicadores msi on msi.IdProductoStock = ps.IdProductoStock
where ps.Reservado <> msi.StockReservadoCalculado and msi.StockReservadodiferencia <> 0

--update ps set ps.Reservado = msi.StockReservadoCalculado
--from trading.dbo.tp_ProductoStock ps
--	inner join trading.dbo.tp_Productos p on ps.IdProducto = p.IdProducto
--	inner join trading.dbo.dm_MovimientosStockInidicadores msi on msi.IdProductoStock = ps.IdProductoStock
--where ps.Reservado <> msi.StockReservadoCalculado and msi.StockReservadodiferencia <> 0


select * from tp_TiposMovimientoStock
select * from tp_ProductoStockMovimientos where IdTipoMovimiento = 4
--IdTipoMovimiento	Descripcion
--4					AJUSTE POSITIVO
select * from dbo.dm_MovimientosStockInidicadores where StockFisicoDiferencia > 0

--IdTipoMovimiento	Descripcion
--5					AJUSTE NEGATIVO
select * from dbo.dm_MovimientosStockInidicadores where StockFisicoDiferencia < 0


