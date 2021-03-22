use queenmary
go

declare @numero int
set @numero = 558


select c.Email, c.Nombre + ' ' + c.Apellido, c.NombreFantasia, c.Celular, p.* 
from tp_Pedidos p inner join tp_Clientes c on p.IdCliente = c. IdCliente  
where Numero = @numero

select p.Codigo, i.Cantidad, i.Subtotal
from tp_PedidoItems i 
inner join tp_Productos p on i.IdProducto = p.IdProducto 
where idPedido in (select IdPedido from tp_Pedidos where Numero = @numero)



--select p.Codigo, i.Cantidad, i.Precio, i.Subtotal, lp.Codigo as ListaPrecio 
--from tp_PedidoItems i 
--inner join tp_Productos p on i.IdProducto = p.IdProducto 
--inner join tp_ListasPrecio lp on lp.idListaPrecio = p.IdListaPrecio
--where idPedido in (select IdPedido from tp_Pedidos where Numero = @numero)
