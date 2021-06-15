
select * from tp_Pedidos where Numero = 3608

--insert into dbo.dm_ActualizacionesStock
--select	'[ANTES]' as Momento, getdate() as Fecha, ped.IdPedido, ped.Numero, 
--		ped.IdCliente, ps.IdProductoStock as ProductoStock_IdProductoStock, ps.IdProducto as ProductoStock_IdProducto, ps.IdMedida as ProductoStock_IdMedida, ps.Stock as ProductoStock_Stock, ps.Reservado as ProductoStock_Reservado,
--		pip.IdPedidoItemProducto as PedidoItemProducto_IdPedidoItemProducto, pip.IdProductoStock as PedidoItemProducto_IdProductoStock, pip.IdMedida as PedidoItemProducto_IdMedida, pip.IdPedidoItem as PedidoItemProducto_IdPedidoItem, pip.Cantidad as PedidoItemProducto_Cantidad, pip.IdEstadoItem as PedidoItemProducto_IdEstadoItem, pip.StockDisponible as PedidoItemProducto_StockDisponible, pip.StockReservado as PedidoItemProducto_StockReservado
--from tp_ProductoStock ps
--	inner join tp_PedidoItemProducto	pip on ps.IdProductoStock = pip.IdProductoStock and pip.Cantidad > 0
--	inner join tp_PedidoItems			pit	on pip.IdPedidoItem = pit.IdPedidoItem
--	inner join tp_Pedidos				ped on pit.IdPedido = ped.IdPedido
--where ped.IdPedido = 3




--select p.Codigo, m.Observaciones as Medida, ps.* from tp_Productos p inner join tp_ProductoStock ps on p.IdProducto = ps.IdProducto inner join tp_Medidas m on ps.IdMedida = m.IdMedida
--where ps.IdProductoStock = @idProductoStock	 --p.Codigo = 1202	 --ps.idproductostock = 2620 ps.Stock < 0 -- 

--select tps.Descripcion as Movimiento, psm.* from tp_ProductoStockMovimientos psm inner join tp_TiposMovimientoStock tps on psm.IdTipoMovimiento = tps.IdTipoMovimiento 
--where IdProductoStock = @idProductoStock

--select p.Fecha, p.Numero, e.Descripcion as Estado, p.IdCliente, pip.*  from tp_Pedidos p inner join tp_Estados e on p.IdEstado = e.IdEstado inner join tp_PedidoItems pit on p.IdPedido = pit.IdPedido inner join tp_PedidoItemProducto pip on pit.IdPedidoItem = pip.IdPedidoItem 
--where IdProductoStock = @idProductoStock and pip.Cantidad > 0 and p.IdEstado in (2, 3, 4, 9) order by p.Fecha

declare @idProductoStock int
set @idProductoStock = 7623

select	Momento, Fecha, IdPedido, Numero, 
		ProductoStock_IdProductoStock as IdProductoStock, 
		ProductoStock_Stock as Stock, 
		ProductoStock_Reservado as Reservado,
		PedidoItemProducto_Cantidad as Cantidad
from dbo.dm_ActualizacionesStock 
where ProductoStock_IdProductoStock = @idProductoStock


select	Momento, Fecha, IdPedido, Numero, p.Codigo, 
		ProductoStock_IdProductoStock as IdProductoStock, 
		ProductoStock_Stock as Stock, 
		ProductoStock_Reservado as Reservado,
		PedidoItemProducto_Cantidad as Cantidad		
from dbo.dm_ActualizacionesStock das
	inner join dbo.tp_ProductoStock ps on das.ProductoStock_IdProductoStock = ps.IdProductoStock
	inner join dbo.tp_Productos p on ps.IdProducto = p.IdProducto
where Numero = 3695
order by IdProductoStock,Fecha



--truncate table dbo.dm_ActualizacionesStock

select *
from dbo.dm_ActualizacionesStock 
where ProductoStock_IdProductoStock = 2851


select * from tiendamayorista.dbo.tp_Clientes

select * from tp_Pedidos
-- gabrieladipiet@gmail.com / 39208010


select p.Codigo, ps.IdProductoStock, m.Observaciones, Count(*) Cantidad 
from tp_Productos p 
	inner join tp_ProductoStock ps on p.IdProducto = ps.IdProducto 
	inner join tp_Medidas m on ps.IdMedida = m.IdMedida
	inner join tp_PedidoItemProducto pip on pip.IdProductoStock = ps.IdProductoStock
group by p.Codigo, ps.IdProductoStock, m.Observaciones
order by count(*) desc



select * from tp_ProductoStockMovimientos order by IdProductoStockMovimiento desc
