


-- 164 - k_carla83@hotmail.com
use trading
go


select * from tp_Clientes where IdCliente in (25, 29, 164, 188)

select	MONTH(Fecha) as mes,
		YEAR(Fecha) as anio,
		e.IdEstado, e.Descripcion as estado,
		count(*) as cantidad_pedidos,
		sum(Total) as total,
		(sum(Total) * 0.02) as comision,
		
		((sum(Total) * 2)/100) as comision_bis,
		((sum(Total) * 0.02) * 180) as comision_pesos

from tp_Pedidos as p inner join tp_Estados as e on p.IdEstado = e.IdEstado
where p.IdEstado in (2, 4,9) and p.IdCliente in (164)
group by MONTH(Fecha), YEAR(Fecha), e.IdEstado, e.Descripcion
order by YEAR(Fecha), MONTH(Fecha)



/*comisiones app*/
select c.IdCliente, c.Nombre, c.Apellido, c.NombreFantasia,
	dv.Fecha, dv.Numero, dv.NumeroPedido as [Pedido WEB], dv.Total,
	dvi.Descripcion, dvi.Precio
from tp_DocumentosVenta dv
	inner join tp_DocumentoVentaItems dvi on dv.IdVenta = dvi.IdVenta 
	inner join tp_Clientes c on c.IdCliente = dv.IdCliente
where dvi.Descripcion like '%Comisión APP Tienda WEB%'
	and dv.Fecha > '2021-04-01'
order by c.IdCliente


select * from olka.dbo.tp_pedidos where fecha > '2021-04-01' and NumeroPedidoProveedor > 0


