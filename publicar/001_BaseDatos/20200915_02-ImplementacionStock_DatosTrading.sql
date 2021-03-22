
/* solo p/trading
update tp_Subcategorias set MostrarMedidas = 0 where IdSubcategoria = 36
*/

delete tp_ProductoStock
delete tp_SubcategoriaMedidas
delete tp_Medidas



insert into tp_Medidas (Descripcion, Observaciones, Vigente)
select '6', 'Talle 6 = 12/13', 1 union
select '7', 'Talle 7 = 14/15', 1 union
select '8', 'Talle 8 = 16/17', 1 union
select '9', 'Talle 9 = 18/20', 1 
go
insert into tp_Medidas (Descripcion, Observaciones, Vigente)
select '10', 'Talle 10 = 21/22', 1 
go
insert into tp_Medidas (Descripcion, Observaciones, Vigente)
select '17', 'Talle 17', 1 union
select '18', 'Talle 18', 1 union
select '19', 'Talle 19', 1 union
select '20', 'Talle 20', 1 union
select '21', 'Talle 21', 1
go
insert into tp_Medidas (Descripcion, Observaciones, Vigente)
select 'TU', 'Talle Único', 1 
go


/* ANILLOS */
--insert into tp_SubcategoriaMedidas (IdSubcategoria, IdMedida)
select s.IdSubcategoria, m.IdMedida
from tp_Subcategorias s, tp_Medidas m  
where IdSubcategoria in (159,104,106,141,105,137) and m.IdMedida < 6
order by s.IdSubcategoria

/* RESTO DE PRODUCTOS */
--insert into tp_SubcategoriaMedidas (IdSubcategoria, IdMedida)
select s.IdSubcategoria, m.IdMedida
from tp_Subcategorias s, tp_Medidas m  
where not IdSubcategoria in (159,104,106,141,105,137) and m.IdMedida = 11



/* ProductoStock */
--insert into dbo.tp_ProductoStock (IdProducto,IdMedida,Stock,Reservado)
select p.IdProducto, m.IdMedida, 0, 0 
from dbo.tp_Productos p inner join dbo.tp_SubcategoriaMedidas m on p.IdSubcategoria = m.IdSubcategoria


/* Stock Anillos */
update ps set ps.Stock = p.Stock
from tp_ProductoStock ps 
	inner join tp_Productos p on p.IdProducto = ps.IdProducto
where ps.IdMedida = 1
/* Stock resto de productos */
update ps set ps.Stock = p.Stock
from tp_ProductoStock ps 
	inner join tp_Productos p on p.IdProducto = ps.IdProducto
where ps.IdMedida = 11



/* Pedidos  */
--insert into tp_PedidoItemProducto (IdProductoStock,IdMedida,IdPedidoItem,Cantidad,IdEstadoItem,StockDisponible,StockReservado)
select ps.IdProductoStock, ps.IdMedida, pit.IdPedidoItem, pit.Cantidad, null, pit.Cantidad, pit.Cantidad
from tp_Pedidos p 
	inner join tp_PedidoItems pit on p.IdPedido = pit.IdPedido
	inner join tp_Productos pr on pit.IdProducto = pr.IdProducto 
	inner join tp_ProductoStock ps on pr.IdProducto = ps.IdProducto and IdMedida in (1, 11)
where Numero in (52, 60, 61)
order by p.Numero




/*** HABILITAR CONTROL DE STOCK ****/
/* solo p/trading
delete tp_Parametros where Clave = 'DESCONTAR_STCOK_AL_CONFIRMAR'
insert into tp_parametros (Descripcion, Clave, Valor, Editable, Vigente)
select 'Determina si se descuenta stock al confirmar el pedido.', 'DESCONTAR_STCOK_AL_CONFIRMAR', 'SI', 0, 1;


delete tp_Parametros where Clave = 'VERIFICAR_STCOK'
insert into tp_parametros (Descripcion, Clave, Valor, Editable, Vigente)
select 'Determina si verifica el stock del producto cuando se agrega al carrito, cuando se finaliza y cuando se reenvia al proveedor.', 'VERIFICAR_STCOK', 'SI', 0, 1;


delete tp_Parametros where Clave = 'VERIFICAR_STCOK_ MSJ_ERROR'
insert into tp_parametros (Descripcion, Clave, Valor, Editable, Vigente)
select 'Mensaje que se muestra al usuario si hay inconsistencias con el Stock Disponible en la verificación del stock.', 'VERIFICAR_STCOK_ MSJ_ERROR', 'Verificar pedido por falta de stock disponible. Para continuar debe ingresar una cantidad menor o igual al disponible.', 0, 1;
*/



