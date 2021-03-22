
use TiendaPome_Mayorista
go



declare @idVenta int
select @idVenta = IdVenta from tp_DocumentosVenta where IdTipo = 1 and Numero = 2

select * from tp_Clientes where IdCliente in (select IdCliente from tp_DocumentosVenta where IdVenta  = @idVenta)
select * from tp_DocumentosVenta where IdVenta  = @idVenta
select * from tp_DocumentoVentaItems where IdVenta = @idVenta
select * from tp_DocumentoVentaObservaciones where IdVenta = @idVenta

declare @idPedido int
--set @idPedido = 2205
select @idPedido = IdPedido from tp_Pedidos where Numero = 2130

select * from tp_Pedidos where IdPedido = @idPedido 
select pr.Codigo, pit.* from tp_PedidoItems pit inner join tp_Productos pr on pit.IdProducto = pr.IdProducto where IdPedido = @idPedido order by pr.Codigo
select * from tp_PedidoItemProducto where IdPedidoItem in (select IdPedidoItem from tp_PedidoItems where IdPedido = @idPedido ) and Cantidad > 0



select * from tp_VentaTiposComprobante
/*
delete tp_DocumentoVentaObservaciones
delete tp_DocumentoVentaItems 
delete tp_DocumentosVenta 
*/

select * from tp_Estados


select distinct IdPedido from tp_PedidoItems where not IdPedidoItem in (select IdPedidoItem from tp_PedidoItemProducto)
select distinct IdPedido from tp_PedidoItems where IdPedidoItem in (select IdPedidoItem from tp_PedidoItemProducto)


update tp_DocumentosVenta set Fecha = GETDATE()-20, Vencimiento = GETDATE()-20

--update tp_Pedidos set IdEstado = 9 where IdPedido in (select distinct IdPedido from tp_PedidoItems where not IdPedidoItem in (select IdPedidoItem from tp_PedidoItemProducto))
--
