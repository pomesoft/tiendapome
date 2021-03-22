use trading
go


exec [dbo].[sp_ProcesarMovimientosStock]

exec [dbo].[sp_ProcesarMovimientosStockDetalle]

exec [dbo].[sp_ProcesarMovimientosStockInidicadores]

select * from [dbo].[dm_MovimientosStock] where codigo = 581
select * from [dbo].[dm_MovimientosStockDetalle] where codigo = 581

select * from dbo.dm_MovimientosStockInidicadores where codigo = 581

select * 
from tp_Productos p 
	inner join tp_ProductoStock ps on p.IdProducto = ps.IdProducto 
	inner join tp_ProductoStockMovimientos psm on ps.IdProductoStock = psm.IdProductoStock
where p.Codigo = 581

