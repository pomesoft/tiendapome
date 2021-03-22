
select IdProductoStock, count(*) as TotalRegistros
into #base_00
from tp_ProductoStockMovimientos
group by IdProductoStock
having count(*) > 1



select  1 as Orden, 'Movimiento Stock' AS Movimiento, 
		psm.Fecha, ps.IdProductoStock, p.Codigo, '' as Pedido, psm.Observaciones,
		ps.IdMedida, psm.Cantidad
from tp_ProductoStockMovimientos as psm
	inner join tp_ProductoStock as ps on psm.IdProductoStock = ps.IdProductoStock
	inner join tp_Productos		as p  on ps.IdProducto = p.IdProducto 
where psm.IdProductoStock in (select IdProductoStock from #base_00)
order by p.Codigo, psm.Fecha


select * from tp_ProductoStockMovimientos where IdProductoStock = 524


/*******/
drop table #tmpMovimi_00
drop table #tmpMovimiStock

select  max(psm.Fecha) as Fecha, psm.IdProductoStock
into #tmpMovimi_00
from tp_ProductoStockMovimientos as psm
	inner join tp_ProductoStock as ps on psm.IdProductoStock = ps.IdProductoStock
	inner join tp_Productos		as p  on ps.IdProducto = p.IdProducto 
group by psm.IdProductoStock


select  1 as Orden, 'Movimiento Stock' AS Movimiento, 
		psm.Fecha, p.Codigo, '' as Pedido, psm.Observaciones,
		ps.IdMedida, psm.Cantidad
into #tmpMovimiStock
from tp_ProductoStockMovimientos as psm
	inner join tp_ProductoStock as ps on psm.IdProductoStock = ps.IdProductoStock
	inner join tp_Productos		as p  on ps.IdProducto = p.IdProducto 
	inner join #tmpMovimi_00	as mov on psm.IdProductoStock = mov.IdProductoStock and psm.Fecha = mov.Fecha


select Codigo, IdMedida, Count(*) as Registros 
from #tmpMovimiStock
group by Codigo, IdMedida
having count(*) > 1
