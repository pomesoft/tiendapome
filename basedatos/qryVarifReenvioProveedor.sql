declare @idPedido int

select top 1 @idPedido = IdPedido from tp_Pedidos order by IdPedido desc
select @idPedido 
select c.IdCliente, c.Email, e.IdEstado, e.Descripcion as Estado, p.* 
from tp_Pedidos p
	inner join tp_Clientes c on p.IdCliente = c.IdCliente
	inner join tp_Estados e on p.IdEstado = e.IdEstado
where IdPedido = @idPedido
order by IdPedido desc

select * 
from tp_PedidoItems 
where IdPedido = @idPedido
