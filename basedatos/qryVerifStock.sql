
use tiendamayorista
go

declare @idPedido int
--set @idPedido = 5
select @idPedido = Max(IdPedido) from tp_Pedidos --where Numero = 3


select * from tp_Clientes where IdCliente in (select IdCliente from tp_Pedidos where IdPedido = @idPedido )
select p.Numero, e.Descripcion as Estado, * from tp_Pedidos p inner join tp_Estados e on e.IdEstado = p.IdEstado where IdPedido = @idPedido 
select pr.Codigo, pit.* from tp_PedidoItems pit inner join tp_Productos pr on pit.IdProducto = pr.IdProducto where IdPedido = @idPedido order by pr.Codigo
select * from tp_PedidoItemProducto where IdPedidoItem in (select IdPedidoItem from tp_PedidoItems where IdPedido = @idPedido ) and Cantidad > 0

declare @idProducto int
--set @idProducto = 11
select @idProducto = IdProducto from tp_Productos where Codigo = 1306

select * from tp_Productos where IdProducto = @idProducto
select * from tp_ProductoStock where IdProducto = @idProducto



--select * into dbo.tp_ProductoStock_BKP from tp_ProductoStock 



select * from dm_MovimientosStock where Codigo = 2032 order by Codigo

select Codigo, Orden, Movimiento, IdMedida, count(*) TotalRegistros 
from dm_DetalleMovimientosStock
group by Codigo, Orden, Movimiento, IdMedida
order by count(*) desc







/*    para eliminar un item del pedido
update tp_Pedidos set CantidadItems = 11, Total = (29.56-2.25)  where Numero = 2295
select * from tp_PedidoItemProducto where IdPedidoItem = 26903
select * from tp_PedidoItems where IdPedidoItem = 26903

**** Importante volver atras el reservado
--update tp_ProductoStock set Reservado = 0 where IdProductoStock = 3638
*/





/*
drop table #tmp_pedidos 
select 2164 as IdPedido into #tmp_pedidos 
--union select 2243 as IdPedido 


select c.Email, c.Nombre, e.Descripcion as Estado, p.* 
from tp_Pedidos p 
	inner join tp_Clientes c on p.IdCliente = c.IdCliente
	inner join tp_Estados  e on p.IdEstado = e.IdEstado
where  IdPedido in (select IdPedido from #tmp_pedidos)



select	t.Descripcion as Tipo, c.Descripcion as Categoria, s.Descripcion as Subcategoria,
		pit.IdPedido, p.Codigo, m.Observaciones as Medida, 
		ps.IdProductoStock, ps.Stock, ps.Reservado, (ps.Stock - ps.Reservado) StockDisponible,
		pip.Cantidad as PedidoCantidad, pip.StockReservado as PedidoReservado, pip.StockDisponible as PedidoDisponioble
from tp_Productos p 
	inner join tp_ProductoStock			ps	on p.IdProducto = ps.IdProducto	
	inner join tp_PedidoItemProducto	pip on ps.IdProductoStock = pip.IdProductoStock
	inner join tp_PedidoItems			pit on pip.IdPedidoItem = pit.IdPedidoItem
	inner join tp_Medidas				m	on m.IdMedida = ps.IdMedida  
	inner join tp_Subcategorias			s	on s.IdSubcategoria = p.IdSubcategoria 
	inner join tp_Categorias			c	on c.IdCategoria = s.IdCategoria
	inner join tp_Tipos					t	on t.IdTipo = c.IdTipo
where	pip.IdPedidoItem in (select IdPedidoItem from tp_PedidoItems where IdPedido in (select IdPedido from #tmp_pedidos))
order by t.Descripcion, c.Descripcion, s.Descripcion, p.Codigo



select	t.Descripcion as Tipo, c.Descripcion as Categoria, s.Descripcion as Subcategoria,
		pit.IdPedido, p.Codigo, m.Observaciones as Medida, 
		ps.IdProductoStock, ps.Stock, ps.Reservado, (ps.Stock - ps.Reservado) StockDisponible,
		pip.Cantidad as PedidoCantidad, pip.StockDisponible as PedidoDisponioble
from tp_Productos p 
	inner join tp_ProductoStock			ps	on p.IdProducto = ps.IdProducto	
	inner join tp_PedidoItemProducto	pip on ps.IdProductoStock = pip.IdProductoStock
	inner join tp_PedidoItems			pit on pip.IdPedidoItem = pit.IdPedidoItem
	inner join tp_Medidas				m	on m.IdMedida = ps.IdMedida  
	inner join tp_Subcategorias			s	on s.IdSubcategoria = p.IdSubcategoria 
	inner join tp_Categorias			c	on c.IdCategoria = s.IdCategoria
	inner join tp_Tipos					t	on t.IdTipo = c.IdTipo
where	pip.IdPedidoItem in (select IdPedidoItem from tp_PedidoItems where IdPedido in (select IdPedido from #tmp_pedidos))
order by t.Descripcion, c.Descripcion, s.Descripcion, p.Codigo
*/

/*
select	t.Descripcion as Tipo, c.Descripcion as Categoria, s.Descripcion as Subcategoria,
		pit.IdPedido, p.Codigo, m.Observaciones as Medida, 
		ps.IdProductoStock, ps.Stock, ps.Reservado, (ps.Stock - ps.Reservado) StockDisponible,
		pip.Cantidad as PedidoCantidad, pip.StockDisponible as PedidoDisponioble
from tp_Productos p 
	inner join tp_ProductoStock			ps	on p.IdProducto = ps.IdProducto	
	inner join tp_PedidoItemProducto	pip on ps.IdProductoStock = pip.IdProductoStock
	inner join tp_PedidoItems			pit on pip.IdPedidoItem = pit.IdPedidoItem
	inner join tp_Medidas				m	on m.IdMedida = ps.IdMedida  
	inner join tp_Subcategorias			s	on s.IdSubcategoria = p.IdSubcategoria 
	inner join tp_Categorias			c	on c.IdCategoria = s.IdCategoria
	inner join tp_Tipos					t	on t.IdTipo = c.IdTipo
where	pip.IdPedidoItem in (select IdPedidoItem from tp_PedidoItems where IdPedido in (select IdPedido from #tmp_pedidos))
order by t.Descripcion, c.Descripcion, s.Descripcion, p.Codigo


select	t.Descripcion as Tipo, c.Descripcion as Categoria, s.Descripcion as Subcategoria,
		p.Codigo, m.Observaciones as Medida, 
		ps.IdProductoStock, ps.Stock, ps.Reservado, (ps.Stock - ps.Reservado) StockDisponible
from tp_Productos p 
	inner join tp_ProductoStock			ps	on p.IdProducto = ps.IdProducto	
	inner join tp_Medidas				m	on m.IdMedida = ps.IdMedida  
	inner join tp_Subcategorias			s	on s.IdSubcategoria = p.IdSubcategoria 
	inner join tp_Categorias			c	on c.IdCategoria = s.IdCategoria
	inner join tp_Tipos					t	on t.IdTipo = c.IdTipo
where	ps.IdProductoStock in (select IdProductoStock from tp_PedidoItemProducto where IdPedidoItem in (select IdPedidoItem from tp_PedidoItems where IdPedido in (select IdPedido from #tmp_pedidos)))
order by t.Descripcion, c.Descripcion, s.Descripcion, p.Codigo
*/


/*
select  a.IdPedido, pip	.*,
		case
			when (b.Stock - b.Reservado) <= 0				then 0
			when (b.Stock - b.Reservado) >= pip.Cantidad	then pip.Cantidad  
			when	(b.Stock - b.Reservado) > 0 
				and (b.Stock - b.Reservado) < pip.Cantidad	then pip.Cantidad - (pip.Cantidad - (b.Stock - b.Reservado))
		end 
from tp_PedidoItemProducto		pip	
	inner join tp_PedidoItems	a	on pip.IdPedidoItem = a.IdPedidoItem 
    inner join tp_ProductoStock	b	on pip.IdProductoStock = b.IdProductoStock
where	pip.Cantidad > 0
	and IdPedido in (select IdPedido from #tmp_pedidos)
*/


---reservar stock
/*
update ps set ps.Reservado = ps.Reservado + pip.Cantidad
from tp_ProductoStock ps
	inner join tp_PedidoItemProducto	pip on ps.IdProductoStock = pip.IdProductoStock
	inner join tp_PedidoItems			pit	on pip.IdPedidoItem = pit.IdPedidoItem
where pit.IdPedido = 2102 
*/
--- descontar stock
/*
update ps 
set ps.Stock = ps.Stock - pip.Cantidad,
	ps.Reservado = ps.Reservado - pip.Cantidad
from tp_ProductoStock ps
	inner join tp_PedidoItemProducto	pip on ps.IdProductoStock = pip.IdProductoStock
	inner join tp_PedidoItems			pit	on pip.IdPedidoItem = pit.IdPedidoItem
where pit.IdPedido = 2102 
*/

/*

 select * from tp_Pedidos where IdCliente = 9 and Numero = -1
 select * from tp_PedidoItems where IdPedido in (select IdPedido from tp_Pedidos where IdCliente = 14 and Numero = -1)
 select * from tp_PedidoItemProducto where IdPedidoItem in (select IdPedidoItem from tp_PedidoItems where IdPedido in (select IdPedido from tp_Pedidos where IdCliente = 14 and Numero = -1))

 delete from tp_PedidoItemProducto where IdPedidoItem in (select IdPedidoItem from tp_PedidoItems where IdPedido in (select IdPedido from tp_Pedidos where IdCliente = 14 and Numero = -1))
 delete from tp_PedidoItems where IdPedido in (select IdPedido from tp_Pedidos where IdCliente = 14 and Numero = -1)
 delete tp_Pedidos where IdCliente = 14 and Numero = -1
*/

