




drop table #tmp_das
 
select Momento, convert(varchar(10), Fecha, 103) as Fecha, IdPedido, Numero, p.Codigo, ProductoStock_IdProductoStock as IdProductoStock, PedidoItemProducto_IdProductoStock , PedidoItemProducto_Cantidad as Cantidad, Count(*) as Registros
into #tmp_das
from dbo.dm_ActualizacionesStock das
	inner join dbo.tp_ProductoStock ps on das.ProductoStock_IdProductoStock = ps.IdProductoStock
	inner join dbo.tp_Productos p on ps.IdProducto = p.IdProducto
where Fecha > '2021-05-13 23:59:00'
group by Momento, convert(varchar(10), Fecha, 103), IdPedido, Numero, p.Codigo, ProductoStock_IdProductoStock , PedidoItemProducto_IdProductoStock, PedidoItemProducto_Cantidad
having Momento = '[ANTES][PedidoDescontarStock]'
	--and Count(*) > 1

select * from #tmp_das where Registros > 1

select Momento, Fecha, IdPedido, Numero, Registros 
from #tmp_das 
group by Momento, Fecha, IdPedido, Numero, Registros
order by Numero



select	Momento, Fecha, IdPedido, Numero, p.Codigo, 
		ProductoStock_IdProductoStock as IdProductoStock, 
		ProductoStock_Stock as Stock, 
		ProductoStock_Reservado as Reservado,
		PedidoItemProducto_Cantidad as Cantidad		
from dbo.dm_ActualizacionesStock das
	inner join dbo.tp_ProductoStock ps on das.ProductoStock_IdProductoStock = ps.IdProductoStock
	inner join dbo.tp_Productos p on ps.IdProducto = p.IdProducto
where ProductoStock_IdProductoStock = 7817  -- Numero = 3715
order by IdProductoStock,Fecha


select	Momento, Fecha, IdPedido, Numero, p.Codigo, 
		ProductoStock_IdProductoStock as IdProductoStock, 
		ProductoStock_Stock as Stock, 
		ProductoStock_Reservado as Reservado,
		PedidoItemProducto_Cantidad as Cantidad		
from dbo.dm_ActualizacionesStock das
	inner join dbo.tp_ProductoStock ps on das.ProductoStock_IdProductoStock = ps.IdProductoStock
	inner join dbo.tp_Productos p on ps.IdProducto = p.IdProducto
where ProductoStock_IdProductoStock = 7817  and Momento like '%PedidoDescontarStock%'
order by IdProductoStock,Fecha






select * from dbo.dm_ActualizacionesStock where ProductoStock_IdProductoStock = 7057 and Momento = '[ANTES][PedidoDescontarStock]'
select * from dbo.tmp_FixStock_20210512 where IdProductoStock = 7057


--
select IdProductoStock, getdate() as Fecha, 4 as IdTipoMovimiento, Cantidad, 'AJUSTE POR DESCUENTO DE STOCK DUPLICADO - [Pedido Numero=' + convert(varchar(5), Numero) + ']' Observaciones 
into #tmp_FixStock_20210512
from dbo.tmp_FixStock_20210512

--insert into tp_ProductoStockMovimientos (IdProductoStock, Fecha, IdTipoMovimiento, Cantidad, Observaciones)
select IdProductoStock, Fecha, IdTipoMovimiento, Cantidad, Observaciones from #tmp_FixStock_20210512-- where IdProductoStock = 7463
--(303 rows affected)

select ps.IdProductoStock, Sum(fix.Cantidad) as Cantidad, count(*) as registros
into #tmp_FixStock
from tp_ProductoStock ps 
	inner join tmp_FixStock_20210512 fix on ps.IdProductoStock = fix.IdProductoStock 
group by ps.IdProductoStock
order by count(*) desc

select * from tmp_FixStock_20210512 where IdProductoStock in (7463, 7464)
select * from #tmp_FixStock where IdProductoStock in (7463, 7464)

--update ps set ps.Stock = ps.Stock + fix.Cantidad
from tp_ProductoStock ps 
	inner join #tmp_FixStock fix on ps.IdProductoStock = fix.IdProductoStock 


select ps.IdProductoStock, ps.Stock, ps.Stock + fix.Cantidad
from tp_ProductoStock ps 
	inner join #tmp_FixStock fix on ps.IdProductoStock = fix.IdProductoStock 
where ps.IdProductoStock in (7463, 7464)


select * from tp_ProductoStockMovimientos where IdProductoStock in (7463, 7474) --Observaciones like 'AJUSTE POR DESCUENTO DE STOCK DUPLICADO%'


select p.Codigo, ps.IdProductoStock, ps.Stock 
from dbo.tp_ProductoStock ps 
	inner join dbo.tp_Productos p on ps.IdProducto = p.IdProducto
where p.Codigo = 2029


select * from tp_ProductoStockMovimientos where IdProductoStock in (7463, 7464)

select ps.IdProductoStock, ps.Stock, bkp.IdProductoStock, bkp.Stock 
from tp_ProductoStock ps 
	inner join tp_ProductoStock_BKP_20210512 bkp on ps.IdProductoStock = bkp.IdProductoStock
where ps.Stock <> bkp.Stock  -- ps.IdProductoStock in (7463, 7464)

