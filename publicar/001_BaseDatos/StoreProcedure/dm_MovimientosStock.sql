USE [TiendaPome_Mayorista]
GO
/****** Object:  StoredProcedure [dbo].[sp_ProcesarMovimientosStock]    Script Date: 24/10/2020 09:08:00 a.m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE procedure [dbo].[sp_ProcesarMovimientosStock] as 

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
IF OBJECT_ID('tempdb..#tmpPedidosCancelados') IS NOT NULL
	drop table #tmpPedidosCancelados

truncate table dbo.dm_MovimientosStock

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


select	3 as Orden, 'Stock Fisico' AS Movimiento, 
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

select	4 as Orden, 'Pedidos Solicitados / En Proceso' AS Movimiento, 
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


select	5 as Orden, 'Stock Reservado' AS Movimiento, 
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



select	6 as Orden, 'Pedidos Cancelados' AS Movimiento, 
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
into #tmpPedidosCancelados
from tp_Productos p 
	inner join tp_ProductoStock			ps	on p.IdProducto = ps.IdProducto	
	inner join tp_PedidoItemProducto	pip on ps.IdProductoStock = pip.IdProductoStock
	inner join tp_PedidoItems			pit on pip.IdPedidoItem = pit.IdPedidoItem
	inner join tp_Pedidos				ped on pit.IdPedido = ped.IdPedido
	inner join tp_Estados				est on ped.IdEstado = est.IdEstado
	inner join tp_Clientes				cli on ped.IdCliente = cli.IdCliente
where est.IdEstado in (7) 
	--and p.Codigo = @codigo
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
from #tmpPedidosCancelados
group by [Orden], [Movimiento], [Fecha], [Codigo], [Pedido], [Observaciones]




insert into dbo.dm_MovimientosStock ([Tipo], [Categoria], [Subcategoria], [Codigo], [Orden], [Movimiento], [Fecha], [Pedido], [Observaciones], [Talle 6], [Talle 7], [Talle 8], [Talle 9], [Talle 10], [Talle 17], [Talle 18], [Talle 19], [Talle 20], [Talle 21], [Talle Unico])
select	t.Descripcion as Tipo, c.Descripcion as Categoria, s.Descripcion as Subcategoria, p.Codigo,
		bf.Orden, bf.Movimiento, bf.Fecha, bf.Pedido, bf.Observaciones,
		bf.[Talle 6], bf.[Talle 7], bf.[Talle 8], bf.[Talle 9], bf.[Talle 10], bf.[Talle 17], bf.[Talle 18], bf.[Talle 19], bf.[Talle 20], bf.[Talle 21], bf.[Talle Unico] 
from tp_Productos p 
	inner join tp_Subcategorias			s	on s.IdSubcategoria = p.IdSubcategoria 
	inner join tp_Categorias			c	on c.IdCategoria = s.IdCategoria
	inner join tp_Tipos					t	on t.IdTipo = c.IdTipo
	inner join #tmpBaseFinal			bf	on p.Codigo = bf.Codigo	
--where p.Codigo = @codigo
order by t.Descripcion, c.Descripcion, s.Descripcion, p.Codigo


select * from dbo.dm_MovimientosStock

GO
/****** Object:  StoredProcedure [dbo].[sp_ProcesarMovimientosStockDetalle]    Script Date: 24/10/2020 09:08:00 a.m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE procedure [dbo].[sp_ProcesarMovimientosStockDetalle] as 

IF OBJECT_ID('tempdb..#tmpMovimi_00') IS NOT NULL
	drop table #tmpMovimi_00
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
IF OBJECT_ID('tempdb..#tmpPedidosCancelados') IS NOT NULL
	drop table #tmpPedidosCancelados
IF OBJECT_ID('tempdb..#tmpBaseFinal') IS NOT NULL
	drop table #tmpBaseFinal


truncate table dbo.dm_MovimientosStockDetalle

--declare @codigo int
--set @codigo = 2498



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
--where p.Codigo = @codigo


select	2 as Orden, 'Pedidos Finalizados' AS Movimiento, 
		ped.Fecha, p.Codigo, convert(varchar, ped.Numero) as Pedido, cli.Email + ' - '+ isnull(cli.Nombre, '') + ' ' + isnull(cli.Apellido, '') + ' - ' + isnull(cli.NombreFantasia, '')  as Observaciones,
		ps.IdMedida, pip.Cantidad
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


select	3 as Orden, 'Stock Fisico' AS Movimiento, 
		getdate() as Fecha, p.Codigo, '' as Pedido, 'Stock Fisico'  as Observaciones,
		ps.IdMedida, ps.Stock as Cantidad
into #tmpStockFisico
from tp_Productos p 
	inner join tp_ProductoStock			ps	on p.IdProducto = ps.IdProducto	
--where p.Codigo = @codigo
order by p.Codigo

select	4 as Orden, 'Pedidos Solicitados / En Proceso' AS Movimiento, 
		ped.Fecha, p.Codigo, convert(varchar, ped.Numero) as Pedido, cli.Email + ' - '+ isnull(cli.Nombre, '') + ' ' + isnull(cli.Apellido, '') + ' - ' + isnull(cli.NombreFantasia, '')  as Observaciones,
		ps.IdMedida, pip.Cantidad
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


select	5 as Orden, 'Stock Reservado' AS Movimiento, 
		getdate() as Fecha, p.Codigo, '' as Pedido, 'Stock Reservado'  as Observaciones,
		ps.IdMedida, ps.Reservado as Cantidad
into #tmpStockReservado
from tp_Productos p 
	inner join tp_ProductoStock			ps	on p.IdProducto = ps.IdProducto	
--where p.Codigo = @codigo
order by p.Codigo



select	6 as Orden, 'Pedidos Cancelados' AS Movimiento, 
		ped.Fecha, p.Codigo, convert(varchar, ped.Numero) as Pedido, cli.Email + ' - '+ isnull(cli.Nombre, '') + ' ' + isnull(cli.Apellido, '') + ' - ' + isnull(cli.NombreFantasia, '')  as Observaciones,
		ps.IdMedida, pip.Cantidad
into #tmpPedidosCancelados
from tp_Productos p 
	inner join tp_ProductoStock			ps	on p.IdProducto = ps.IdProducto	
	inner join tp_PedidoItemProducto	pip on ps.IdProductoStock = pip.IdProductoStock
	inner join tp_PedidoItems			pit on pip.IdPedidoItem = pit.IdPedidoItem
	inner join tp_Pedidos				ped on pit.IdPedido = ped.IdPedido
	inner join tp_Estados				est on ped.IdEstado = est.IdEstado
	inner join tp_Clientes				cli on ped.IdCliente = cli.IdCliente
where est.IdEstado in (7) 
	--and p.Codigo = @codigo
order by p.Codigo


select  [Orden], [Movimiento], [Fecha], [Codigo], [Pedido], [Observaciones], [IdMedida], [Cantidad]
into #tmpBaseFinal
from #tmpMovimiStock

union all

select  [Orden], [Movimiento], [Fecha], [Codigo], [Pedido], [Observaciones], [IdMedida], [Cantidad]
from #tmpPedidosFinalizados

union all

select  [Orden], [Movimiento], [Fecha], [Codigo], [Pedido], [Observaciones], [IdMedida], [Cantidad]
from #tmpStockFisico

union all

select  [Orden], [Movimiento], [Fecha], [Codigo], [Pedido], [Observaciones], [IdMedida], [Cantidad]
from #tmpPedidosEnProceso

union all

select  [Orden], [Movimiento], [Fecha], [Codigo], [Pedido], [Observaciones], [IdMedida], [Cantidad]
from #tmpStockReservado

union all

select  [Orden], [Movimiento], [Fecha], [Codigo], [Pedido], [Observaciones], [IdMedida], [Cantidad]
from #tmpPedidosCancelados



insert into dbo.dm_MovimientosStockDetalle 
select	t.Descripcion as Tipo, c.Descripcion as Categoria, s.Descripcion as Subcategoria, p.Codigo,
		bf.Orden, bf.Movimiento, bf.Fecha, bf.Pedido, bf.Observaciones, bf.IdMedida, m.Observaciones as Medida, bf.Cantidad
from tp_Productos				p 
	inner join tp_Subcategorias	s	on s.IdSubcategoria = p.IdSubcategoria 
	inner join tp_Categorias	c	on c.IdCategoria = s.IdCategoria
	inner join tp_Tipos			t	on t.IdTipo = c.IdTipo
	inner join #tmpBaseFinal	bf	on p.Codigo = bf.Codigo	
	inner join tp_Medidas		m	on bf.IdMedida = m.IdMedida
--where p.Codigo = @codigo
order by t.Descripcion, c.Descripcion, s.Descripcion, p.Codigo, bf.IdMedida


select * from dbo.dm_MovimientosStockDetalle
GO
/****** Object:  StoredProcedure [dbo].[sp_ProcesarMovimientosStockInidicadores]    Script Date: 24/10/2020 09:08:00 a.m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE procedure [dbo].[sp_ProcesarMovimientosStockInidicadores] as

IF OBJECT_ID('tempdb..#base_inicial') IS NOT NULL
	drop table #base_inicial
IF OBJECT_ID('tempdb..#base_ordenada') IS NOT NULL
	drop table #base_ordenada


truncate table dbo.dm_MovimientosStockInidicadores

--declare @codigo int
--set @codigo = 2498


select Tipo, Categoria, Subcategoria, Codigo, Orden, Movimiento, IdMedida, Sum(Cantidad) as Cantidad
into #base_inicial
from dbo.dm_MovimientosStockDetalle
group by Tipo, Categoria, Subcategoria, Codigo, Orden, Movimiento, IdMedida
--having Codigo = @codigo
order by Tipo, Categoria, Subcategoria, Codigo, IdMedida, Orden, Movimiento




select	bi.Tipo, bi.Categoria, bi.Subcategoria, bi.Codigo, m.Observaciones as Medida, 
		case bi.Orden when 1 then ISNULL(Sum(bi.Cantidad), 0) else 0 end as MovimientoStock, 
		case bi.Orden when 2 then ISNULL(Sum(bi.Cantidad), 0) else 0 end as PedidosFinalizados, 
		case bi.Orden when 3 then ISNULL(Sum(bi.Cantidad), 0) else 0 end as StockFisico, 
		case bi.Orden when 4 then ISNULL(Sum(bi.Cantidad), 0) else 0 end as PedidosSolicitadosEnProceso, 
		case bi.Orden when 5 then ISNULL(Sum(bi.Cantidad), 0) else 0 end as StockReservado, 
		case bi.Orden when 6 then ISNULL(Sum(bi.Cantidad), 0) else 0 end as PedidosCancelados 
into #base_ordenada
from #base_inicial bi 
	inner join tp_Medidas m on bi.idMedida = m.IdMedida
group by bi.Tipo, bi.Categoria, bi.Subcategoria, bi.Codigo, m.Observaciones, bi.Orden

insert into dbo.dm_MovimientosStockInidicadores
select	Tipo, Categoria, Subcategoria, Codigo, Medida, 
		
		sum(MovimientoStock) as MovimientoStock, 
		Sum(PedidosFinalizados) as PedidosFinalizados, 
		
		(sum(MovimientoStock) - Sum(PedidosFinalizados)) as StockFisicoCalculado, 
		
		Sum(StockFisico) as StockFisico, 

		((sum(MovimientoStock) - Sum(PedidosFinalizados)) - Sum(StockFisico)) as StockFisicoDiferencia,
		
		Sum(PedidosSolicitadosEnProceso) as StockReservadoCalculado, 
		Sum(StockReservado) as StockReservado, 
		
		Sum(PedidosSolicitadosEnProceso) - Sum(StockReservado) as StockReservadodiferencia, 
		
		Sum(PedidosCancelados) as PedidosCancelados  

from #base_ordenada
group by Tipo, Categoria, Subcategoria, Codigo, Medida


select * from dbo.dm_MovimientosStockInidicadores



GO
