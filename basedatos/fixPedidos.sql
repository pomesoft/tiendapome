
select * from tp_Clientes where Email like '%info%'

select c.Email, p.* 
from tp_Pedidos p inner join tp_Clientes c on p.IdCliente = c.IdCliente 
where p.IdCliente = 114
order by Numero


select * from tp_Estados

/*
IdPedido	Numero	Fecha						IdCliente	IdEstado	Observaciones	Total	CantidadItems	Porcentaje	Moneda	IdPedidoProveedor
1561		1486	2020-06-30 13:52:09.000		147			2			NULL			257.30	12				5			USD		0
1552		1472	2020-06-28 10:15:11.000		187			2			NULL			1138.38	129				5			USD		0
1524		1474	2020-06-28 17:30:03.000		182			2			NULL			1105.20	91				5			USD		0
*/
/*
insert into tp_Pedidos (Numero,Fecha, IdCliente, IdEstado, Observaciones, Total, CantidadItems, Porcentaje, Moneda, IdPedidoProveedor)
values ((select max(Numero)+1 from tp_Pedidos), '2020-06-28 17:15:11', 182, 2, NULL, 1105.20, 91, 5, 'USD', 0 )
insert into tp_PedidoItems (IdPedido, IdProducto, Precio, Cantidad, Porcentaje, Subtotal, EstadoItem) values (IdPedido, IdProducto, Precio, Cantidad, Porcentaje, Subtotal, EstadoItem)
*/

select top 1 * from tp_Pedidos order by IdPedido desc

select * from tp_Pedidos where IdPedido = 1606
select Count(*) as Items, Sum(Subtotal) AS Total from tp_PedidoItems where IdPedido = 1606
select * from tp_PedidoItems where IdPedido = 1606





