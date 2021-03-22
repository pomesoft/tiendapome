use queenmary
go


/* query para obtener todas las listas de precios asignadas a un cliente */
select c.IdCliente, c.Email, c.Apellido, c.Nombre,
	lp.idListaPrecio, lp.Codigo, lp.Descripcion, lp.Precio,
	lpc.idListaPrecioCliente, lpc.Codigo, lpc.Descripcion, lpc.Precio 
from tp_Clientes c 
	inner join tp_ClienteListas			cl  on c.IdCliente = cl.IdCliente
	inner join tp_ListasPrecioCliente	lpc on cl.IdListaCliente = lpc.idListaPrecioCliente
	inner join tp_ListasPrecio			lp	on lpc.idListaPrecio = lp.idListaPrecio
where c.IdCliente = 972


select Codigo, count(*) from tp_ListasPrecioCliente group by Codigo having COUNT(*)>1

select * from tp_ListasPrecioCliente where Codigo = 'P25'


--update queenmary.dbo.tp_Parametros set Valor = 'BA25;BB25;PP1220;M05;P05;AB1_25;AB2_25;AB3_25;A25;B25;C25;D25;E25;F25;G25;H25;I25;J25;K25;L25;M25;N25;O25;P25;Q25;R25;S25;T25;U25;V25;W25;X25;Y25;Z25;AA25;AB25;AC25;AD25;AE25;AF25;AG25;AH25;AI25;AJ25;AK25;AL25;AM25;AN25;AO25;AP25;AQ25;AR25;AS25;AT25;AU25;AV25;AW25;AX25;AY25;AZ25;' where Clave = 'LISTA_MAYORISTA_DESCUENTO'
select * from tp_Parametros where Clave = 'LISTA_MAYORISTA_DESCUENTO'

/*
delete from tp_ClienteListas where IdCliente = 1399
delete from tp_Clientes where IdCliente = 1399
*/

select * from tp_Clientes where idcliente in (1253, 1291) Email like '%piana%' 

select * from tp_Clientes where Email like '%vallejosmaru@gmail.com%'

--sandraaramayo@hotmail.com  /  1144779573

/* asignacion de listas de precios a clientes*/
drop table #tmp_ClienteListas

select 1459 as IdCliente, lpc.idListaPrecio as IdListaProducto, lpc.idListaPrecioCliente as IdListaCliente
into #tmp_ClienteListas
from tp_ListasPrecioCliente lpc		
where lpc.Codigo in ('M05', 'A1', 'P05', 'AB1_25', 'AB2_25', 'AB3_25', 'PP1220', 'A25', 'B25', 'C25', 
					 'D25', 'E25', 'F25', 'G25', 'H25', 'I25', 'J25', 'K25', 'L25', 'M25', 
					 'N25', 'O25', 'P25', 'Q25', 'R25', 'S25', 'T25', 'U25', 'V25', 'W25', 
					 'X25', 'Y25', 'Z25', 'AA25', 'AB25', 'AC25', 'AD25', 'AE25', 'AF25', 'AG25', 
					 'AH25', 'AI25', 'AJ25', 'AK25', 'AL25', 'AM25', 'AN25', 'AO25', 'AP25', 'AQ25', 
					 'AR25', 'AS25', 'AT25', 'AU25', 'AV25', 'AW25', 'AX25', 'AY25', 'AZ25', 'BA25', 
					 'BB25')


select IdListaProducto, COUNT(*) from tp_ClienteListas where IdCliente = 1466 group by IdListaProducto

--select IdCliente, count(*) cant from #tmp_ClienteListas group by IdCliente
/*
delete from tp_ClienteListas where IdCliente IN (select IdCliente from #tmp_ClienteListas) 
insert into tp_ClienteListas (IdCliente,IdListaProducto,IdListaCliente)
select IdCliente, IdListaProducto, IdListaCliente from #tmp_ClienteListas
*/


--select c.IdCliente, lpc.idListaPrecio as IdListaProducto, lpc.idListaPrecioCliente as IdListaCliente
--into #tmp_ClienteListas
--from tp_Clientes c, tp_ListasPrecioCliente lpc		
--where lpc.Codigo in ('BA25', 'BB25', 'PP1220', 'M05', 'P25', 'AB1_25', 'AB2_25', 'AB3_25', 
--					'A25', 'B25', 'C25', 'D25', 'E25', 'F25', 'G25', 'H25', 'I25', 'J25', 
--					'K25', 'L25', 'M25', 'N25', 'O25', 'P25', 'Q25', 'R25', 'S25', 'T25', 
--					'U25', 'V25', 'W25', 'X25', 'Y25', 'Z25', 'AA25', 'AB25', 'AC25', 'AD25', 
--					'AE25', 'AF25', 'AG25', 'AH25', 'AI25', 'AJ25', 'AK25', 'AL25', 'AM25', 
--					'AN25', 'AO25', 'AP25', 'AQ25', 'AR25', 'AS25', 'AT25', 'AU25', 'AV25', 
--					'AW25', 'AX25', 'AY25', 'AZ25')



drop table #tmp_LPC 
drop table #tmp_ClienteListas



