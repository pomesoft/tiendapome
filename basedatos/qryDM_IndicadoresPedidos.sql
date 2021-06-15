use trading
go


exec [dbo].[sp_ProcesarMovimientosStock]

exec [dbo].[sp_ProcesarMovimientosStockDetalle] 8015

exec [dbo].[sp_ProcesarMovimientosStockInidicadores]




declare @idProductoStock int
set @idProductoStock = 3976

select * from [dbo].[dm_MovimientosStockDetalle] where IdProductoStock = @idProductoStock order by Orden, Fecha
select p.Codigo, ps.* from tp_Productos p inner join tp_ProductoStock ps on p.IdProducto = ps.IdProducto 
where p.Codigo = 3846	  --ps.IdProductoStock = @idProductoStock		--p.Codigo = 3564	 --ps.idproductostock = 2620 ps.Stock < 0 -- 

select * from tp_ProductoStockMovimientos where IdProductoStock = @idProductoStock

select * from dbo.dm_MovimientosStockInidicadores where  IdProductoStock = @idProductoStock --StockFisico <> StockFisicoCalculado and 
--select * from tp_ProductoStockMovimientos_BKP where IdProductoStock = @idProductoStock
select p.Fecha, p.Numero, e.Descripcion as Estado, p.IdCliente, pip.*  from tp_Pedidos p inner join tp_Estados e on p.IdEstado = e.IdEstado inner join tp_PedidoItems pit on p.IdPedido = pit.IdPedido inner join tp_PedidoItemProducto pip on pit.IdPedidoItem = pip.IdPedidoItem 
where IdProductoStock = @idProductoStock and pip.Cantidad > 0 and p.IdEstado in (2, 3, 4, 9) order by p.Fecha

select  dvt.Descripcion as Movimiento, dv.Fecha, -1 as Pedido, 'Movimiento SIN Pedido - ' + dvt.Descripcion + ': ' + str(dv.Numero), 0 as IdMedida, '' as Medida, dvi.Cantidad  
from tp_DocumentosVenta dv inner join tp_VentaTiposComprobante dvt on dv.IdTipo = dvt.IdVentaTipoComprobante inner join tp_DocumentoVentaItems dvi on  dv.IdVenta = dvi.IdVenta 
where dvi.IdProductoStock = @idProductoStock  and isnull(dvi.IdPedidoItemProducto, 0) = 0


select IdProductoStock, count(*) from tp_PedidoItemProducto group by IdProductoStock order by count(*) desc









--insert into tp_ProductoStockMovimientos (IdProductoStock, Fecha, IdTipoMovimiento, Cantidad,Observaciones)
--select IdProductoStock, getdate() as Fecha, 1  as IdTipoMovimiento, Stock, 'Stock al 09-04-2021' as Observaciones  from tp_ProductoStock  




declare @idPedido int
--set @idPedido = 2539
select @idPedido = Max(IdPedido) from tp_Pedidos where Numero = 3521
select * from tp_Clientes where IdCliente in (select IdCliente from tp_Pedidos where IdPedido = @idPedido )
select p.Numero, e.Descripcion as Estado, * from tp_Pedidos p inner join tp_Estados e on e.IdEstado = p.IdEstado where IdPedido = @idPedido 
select pr.Codigo, pit.* from tp_PedidoItems pit inner join tp_Productos pr on pit.IdProducto = pr.IdProducto where IdPedido = @idPedido order by pr.Codigo
select * from tp_PedidoItemProducto where IdPedidoItem in (select IdPedidoItem from tp_PedidoItems where IdPedido = @idPedido ) 



--update tp_ProductoStockMovimientos set Cantidad = (Cantidad*-1) where Observacione-31s = 'Carga inicial'
select * from dbo.tp_ProductoStockMovimientos 
select * from dbo.tp_ProductoStockMovimientos_BKP_Stock_09042021

-- truncate table tp_ProductoStockMovimientos
--insert into tp_ProductoStockMovimientos (IdProductoStock, Fecha, IdTipoMovimiento, Cantidad, Observaciones)
select IdProductoStock, (getdate()-365) as Fecha, 1, (StockFisico + PedidosFinalizados) as Cantidad, 'Carga inicial'  from dbo.dm_MovimientosStockInidicadores 


--update tp_ProductoStock set Reservado = 0 where IdProductoStock = 6931


select p.Codigo, ps.* into #tmpStockNegativo 
from tp_Productos p inner join tp_ProductoStock ps on p.IdProducto = ps.IdProducto
where ps.Stock < 0

--update dbo.tp_ProductoStock set Stock = 0 where IdProductoStock in (select IdProductoStock from #tmpStockNegativo)
select * from dbo.tp_ProductoStock where IdProductoStock in (select IdProductoStock from #tmpStockNegativo)


select * from #tmpStockNegativo

