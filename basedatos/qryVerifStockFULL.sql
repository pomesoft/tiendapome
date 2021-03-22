create procedure dbo.sp_ProcesarMovimientosStock as 

IF OBJECT_ID('tempdb..#tmpMovimiStock') IS NOT NULL
	drop table #tmpMovimiStock
IF OBJECT_ID('tempdb..#tmpPedidosFinalizados') IS NOT NULL
	drop table #tmpPedidosFinalizados
IF OBJECT_ID('tempdb..#tmpPedidosEnProceso') IS NOT NULL
	drop table #tmpPedidosEnProceso
IF OBJECT_ID('tempdb..#tmpStockFisico') IS NOT NULL
	drop table #tmpStockFisico
IF OBJECT_ID('tempdb..#tmpStockReservado') IS NOT NULL
	drop table #tmpStockReservado
IF OBJECT_ID('tempdb..#tmpStockReservado') IS NOT NULL
	drop table #tmpStockReservado

--declare @codigo int
--set @codigo = 2498

select  1 as Orden, 'Movimiento Stock' AS Movimiento, 
		psm.Fecha, p.Codigo, '' as Pedido, psm.Observaciones,
		case ps.IdMedida when 1	 then ISNULL(psm.Cantidad, 0) else 0 end as 'Talle 6',
		case ps.IdMedida when 2	 then ISNULL(psm.Cantidad, 0) else 0 end as 'Talle 7',
		case ps.IdMedida when 3	 then ISNULL(psm.Cantidad, 0) else 0 end as 'Talle 8',
		case ps.IdMedida when 4	 then ISNULL(psm.Cantidad, 0) else 0 end as 'Talle 9',
		case ps.IdMedida when 5	 then ISNULL(psm.Cantidad, 0) else 0 end as 'Talle 10',
		case ps.IdMedida when 6	 then ISNULL(psm.Cantidad, 0) else 0 end as 'Talle 17',
		case ps.IdMedida when 7	 then ISNULL(psm.Cantidad, 0) else 0 end as 'Talle 18',
		case ps.IdMedida when 8	 then ISNULL(psm.Cantidad, 0) else 0 end as 'Talle 19',
		case ps.IdMedida when 9	 then ISNULL(psm.Cantidad, 0) else 0 end as 'Talle 20',
		case ps.IdMedida when 10 then ISNULL(psm.Cantidad, 0) else 0 end as 'Talle 21',
		case ps.IdMedida when 11 then ISNULL(psm.Cantidad, 0) else 0 end as 'Talle Unico'
into #tmpMovimiStock
from tp_ProductoStockMovimientos as psm
	inner join tp_ProductoStock as ps on psm.IdProductoStock = ps.IdProductoStock
	inner join tp_Productos		as p  on ps.IdProducto = p.IdProducto 
--where p.Codigo = @codigo


select	2 as Orden, 'Pedidos Finalizados' AS Movimiento, 
		ped.Fecha, p.Codigo, convert(varchar, ped.Numero) as Pedido, cli.Email + ' - '+ isnull(cli.Nombre, '') + ' ' + isnull(cli.Apellido, '') + ' - ' + isnull(cli.NombreFantasia, '')  as Observaciones,
		case ps.IdMedida when 1	 then ISNULL(pip.Cantidad, 0) else 0 end as 'Talle 6',
		case ps.IdMedida when 2	 then ISNULL(pip.Cantidad, 0) else 0 end as 'Talle 7',
		case ps.IdMedida when 3	 then ISNULL(pip.Cantidad, 0) else 0 end as 'Talle 8',
		case ps.IdMedida when 4	 then ISNULL(pip.Cantidad, 0) else 0 end as 'Talle 9',
		case ps.IdMedida when 5	 then ISNULL(pip.Cantidad, 0) else 0 end as 'Talle 10',
		case ps.IdMedida when 6	 then ISNULL(pip.Cantidad, 0) else 0 end as 'Talle 17',
		case ps.IdMedida when 7	 then ISNULL(pip.Cantidad, 0) else 0 end as 'Talle 18',
		case ps.IdMedida when 8	 then ISNULL(pip.Cantidad, 0) else 0 end as 'Talle 19',
		case ps.IdMedida when 9	 then ISNULL(pip.Cantidad, 0) else 0 end as 'Talle 20',
		case ps.IdMedida when 10 then ISNULL(pip.Cantidad, 0) else 0 end as 'Talle 21',
		case ps.IdMedida when 11 then ISNULL(pip.Cantidad, 0) else 0 end as 'Talle Unico'
into #tmpPedidosFinalizados
from tp_Productos p 
	inner join tp_ProductoStock			ps	on p.IdProducto = ps.IdProducto	
	inner join tp_PedidoItemProducto	pip on ps.IdProductoStock = pip.IdProductoStock
	inner join tp_PedidoItems			pit on pip.IdPedidoItem = pit.IdPedidoItem
	inner join tp_Pedidos				ped on pit.IdPedido = ped.IdPedido
	inner join tp_Estados				est on ped.IdEstado = est.IdEstado
	inner join tp_Clientes				cli on ped.IdCliente = cli.IdCliente
where est.IdEstado = 4 
	--and p.Codigo = @codigo
order by p.Codigo

select	3 as Orden, 'Pedidos Solicitados / En Proceso' AS Movimiento, 
		ped.Fecha, p.Codigo, convert(varchar, ped.Numero) as Pedido, cli.Email + ' - '+ isnull(cli.Nombre, '') + ' ' + isnull(cli.Apellido, '') + ' - ' + isnull(cli.NombreFantasia, '')  as Observaciones,
		case ps.IdMedida when 1	 then ISNULL(pip.Cantidad, 0) else 0 end as 'Talle 6',
		case ps.IdMedida when 2	 then ISNULL(pip.Cantidad, 0) else 0 end as 'Talle 7',
		case ps.IdMedida when 3	 then ISNULL(pip.Cantidad, 0) else 0 end as 'Talle 8',
		case ps.IdMedida when 4	 then ISNULL(pip.Cantidad, 0) else 0 end as 'Talle 9',
		case ps.IdMedida when 5	 then ISNULL(pip.Cantidad, 0) else 0 end as 'Talle 10',
		case ps.IdMedida when 6	 then ISNULL(pip.Cantidad, 0) else 0 end as 'Talle 17',
		case ps.IdMedida when 7	 then ISNULL(pip.Cantidad, 0) else 0 end as 'Talle 18',
		case ps.IdMedida when 8	 then ISNULL(pip.Cantidad, 0) else 0 end as 'Talle 19',
		case ps.IdMedida when 9	 then ISNULL(pip.Cantidad, 0) else 0 end as 'Talle 20',
		case ps.IdMedida when 10 then ISNULL(pip.Cantidad, 0) else 0 end as 'Talle 21',
		case ps.IdMedida when 11 then ISNULL(pip.Cantidad, 0) else 0 end as 'Talle Unico'
into #tmpPedidosEnProceso
from tp_Productos p 
	inner join tp_ProductoStock			ps	on p.IdProducto = ps.IdProducto	
	inner join tp_PedidoItemProducto	pip on ps.IdProductoStock = pip.IdProductoStock
	inner join tp_PedidoItems			pit on pip.IdPedidoItem = pit.IdPedidoItem
	inner join tp_Pedidos				ped on pit.IdPedido = ped.IdPedido
	inner join tp_Estados				est on ped.IdEstado = est.IdEstado
	inner join tp_Clientes				cli on ped.IdCliente = cli.IdCliente
where est.IdEstado in (2,3) 
	--and p.Codigo = @codigo
order by p.Codigo


select	4 as Orden, 'Stock Fisico' AS Movimiento, 
		getdate() as Fecha, p.Codigo, '' as Pedido, 'Stock Fisico'  as Observaciones,
		case ps.IdMedida when 1	 then ISNULL(ps.Stock, 0) else 0 end as 'Talle 6',
		case ps.IdMedida when 2	 then ISNULL(ps.Stock, 0) else 0 end as 'Talle 7',
		case ps.IdMedida when 3	 then ISNULL(ps.Stock, 0) else 0 end as 'Talle 8',
		case ps.IdMedida when 4	 then ISNULL(ps.Stock, 0) else 0 end as 'Talle 9',
		case ps.IdMedida when 5	 then ISNULL(ps.Stock, 0) else 0 end as 'Talle 10',
		case ps.IdMedida when 6	 then ISNULL(ps.Stock, 0) else 0 end as 'Talle 17',
		case ps.IdMedida when 7	 then ISNULL(ps.Stock, 0) else 0 end as 'Talle 18',
		case ps.IdMedida when 8	 then ISNULL(ps.Stock, 0) else 0 end as 'Talle 19',
		case ps.IdMedida when 9	 then ISNULL(ps.Stock, 0) else 0 end as 'Talle 20',
		case ps.IdMedida when 10 then ISNULL(ps.Stock, 0) else 0 end as 'Talle 21',
		case ps.IdMedida when 11 then ISNULL(ps.Stock, 0) else 0 end as 'Talle Unico'
into #tmpStockFisico
from tp_Productos p 
	inner join tp_ProductoStock			ps	on p.IdProducto = ps.IdProducto	
--where p.Codigo = @codigo
order by p.Codigo



select	1 as Orden, 'Stock Reservado' AS Movimiento, 
		getdate() as Fecha, p.Codigo, '' as Pedido, 'Stock Reservado'  as Observaciones,
		case ps.IdMedida when 1	 then ISNULL(ps.Reservado, 0) else 0 end as 'Talle 6',
		case ps.IdMedida when 2	 then ISNULL(ps.Reservado, 0) else 0 end as 'Talle 7',
		case ps.IdMedida when 3	 then ISNULL(ps.Reservado, 0) else 0 end as 'Talle 8',
		case ps.IdMedida when 4	 then ISNULL(ps.Reservado, 0) else 0 end as 'Talle 9',
		case ps.IdMedida when 5	 then ISNULL(ps.Reservado, 0) else 0 end as 'Talle 10',
		case ps.IdMedida when 6	 then ISNULL(ps.Reservado, 0) else 0 end as 'Talle 17',
		case ps.IdMedida when 7	 then ISNULL(ps.Reservado, 0) else 0 end as 'Talle 18',
		case ps.IdMedida when 8	 then ISNULL(ps.Reservado, 0) else 0 end as 'Talle 19',
		case ps.IdMedida when 9	 then ISNULL(ps.Reservado, 0) else 0 end as 'Talle 20',
		case ps.IdMedida when 10 then ISNULL(ps.Reservado, 0) else 0 end as 'Talle 21',
		case ps.IdMedida when 11 then ISNULL(ps.Reservado, 0) else 0 end as 'Talle Unico'
into #tmpStockReservado
from tp_Productos p 
	inner join tp_ProductoStock			ps	on p.IdProducto = ps.IdProducto	
--where p.Codigo = @codigo
order by p.Codigo




select  [Orden], [Movimiento], [Fecha], [Codigo], [Pedido], [Observaciones], 
		sum([Talle 6])	as [Talle 6], 
		sum([Talle 7])	as [Talle 7], 
		sum([Talle 8])	as [Talle 8], 
		sum([Talle 9])	as [Talle 9], 
		sum([Talle 10]) as [Talle 10], 
		sum([Talle 17]) as [Talle 17], 
		sum([Talle 18]) as [Talle 18], 
		sum([Talle 19]) as [Talle 19], 
		sum([Talle 20]) as [Talle 20], 
		sum([Talle 21]) as [Talle 21], 
		sum([Talle Unico]) as [Talle Unico]
into #tmpBaseFinal
from #tmpMovimiStock
group by [Orden], [Movimiento], [Fecha], [Codigo], [Pedido], [Observaciones]

union all

select  [Orden], [Movimiento], [Fecha], [Codigo], [Pedido], [Observaciones], 
		sum([Talle 6])	as [Talle 6], 
		sum([Talle 7])	as [Talle 7], 
		sum([Talle 8])	as [Talle 8], 
		sum([Talle 9])	as [Talle 9], 
		sum([Talle 10]) as [Talle 10], 
		sum([Talle 17]) as [Talle 17], 
		sum([Talle 18]) as [Talle 18], 
		sum([Talle 19]) as [Talle 19], 
		sum([Talle 20]) as [Talle 20], 
		sum([Talle 21]) as [Talle 21], 
		sum([Talle Unico]) as [Talle Unico]
from #tmpPedidosFinalizados
group by [Orden], [Movimiento], [Fecha], [Codigo], [Pedido], [Observaciones]

union all

select  [Orden], [Movimiento], [Fecha], [Codigo], [Pedido], [Observaciones], 
		sum([Talle 6])	as [Talle 6], 
		sum([Talle 7])	as [Talle 7], 
		sum([Talle 8])	as [Talle 8], 
		sum([Talle 9])	as [Talle 9], 
		sum([Talle 10]) as [Talle 10], 
		sum([Talle 17]) as [Talle 17], 
		sum([Talle 18]) as [Talle 18], 
		sum([Talle 19]) as [Talle 19], 
		sum([Talle 20]) as [Talle 20], 
		sum([Talle 21]) as [Talle 21], 
		sum([Talle Unico]) as [Talle Unico]
from #tmpStockFisico
group by [Orden], [Movimiento], [Fecha], [Codigo], [Pedido], [Observaciones]


union all

select  [Orden], [Movimiento], [Fecha], [Codigo], [Pedido], [Observaciones], 
		sum([Talle 6])	as [Talle 6], 
		sum([Talle 7])	as [Talle 7], 
		sum([Talle 8])	as [Talle 8], 
		sum([Talle 9])	as [Talle 9], 
		sum([Talle 10]) as [Talle 10], 
		sum([Talle 17]) as [Talle 17], 
		sum([Talle 18]) as [Talle 18], 
		sum([Talle 19]) as [Talle 19], 
		sum([Talle 20]) as [Talle 20], 
		sum([Talle 21]) as [Talle 21], 
		sum([Talle Unico]) as [Talle Unico]
from #tmpPedidosEnProceso
group by [Orden], [Movimiento], [Fecha], [Codigo], [Pedido], [Observaciones]


union all

select  [Orden], [Movimiento], [Fecha], [Codigo], [Pedido], [Observaciones], 
		sum([Talle 6])	as [Talle 6], 
		sum([Talle 7])	as [Talle 7], 
		sum([Talle 8])	as [Talle 8], 
		sum([Talle 9])	as [Talle 9], 
		sum([Talle 10]) as [Talle 10], 
		sum([Talle 17]) as [Talle 17], 
		sum([Talle 18]) as [Talle 18], 
		sum([Talle 19]) as [Talle 19], 
		sum([Talle 20]) as [Talle 20], 
		sum([Talle 21]) as [Talle 21], 
		sum([Talle Unico]) as [Talle Unico]
from #tmpStockReservado
group by [Orden], [Movimiento], [Fecha], [Codigo], [Pedido], [Observaciones]


select	t.Descripcion as Tipo, c.Descripcion as Categoria, s.Descripcion as Subcategoria, p.Codigo,
		bf.Orden, bf.Movimiento, bf.Fecha, bf.Pedido, bf.Observaciones,
		bf.[Talle 6], bf.[Talle 7], bf.[Talle 8], bf.[Talle 9], bf.[Talle 10], bf.[Talle 17], bf.[Talle 18], bf.[Talle 19], bf.[Talle 20], bf.[Talle 21], bf.[Talle Unico] 
into dbo.dm_MovimientosStock
from tp_Productos p 
	inner join tp_Subcategorias			s	on s.IdSubcategoria = p.IdSubcategoria 
	inner join tp_Categorias			c	on c.IdCategoria = s.IdCategoria
	inner join tp_Tipos					t	on t.IdTipo = c.IdTipo
	inner join #tmpBaseFinal			bf	on p.Codigo = bf.Codigo	
--where p.Codigo = @codigo
order by t.Descripcion, c.Descripcion, s.Descripcion, p.Codigo


