

--drop table stockTrading

select * from stockTrading


select * from tp_Medidas

drop table  #tmpProcesarStock

select s.*, p.Codigo as codigoValida, p.IdProducto, isnull(m.IdMedida,	11) as IdMedida,  isnull(m.Observaciones, 'Talle Unico') as Medida
into #tmpProcesarStock
from stockTrading s
	inner join tp_Productos p on convert(int, ltrim(rtrim(s.codigo))) = p.Codigo
	left join tp_Medidas	m on ltrim(rtrim(s.talle)) = m.Descripcion


select * 
from #tmpProcesarStock s
	left join tp_ProductoStock ps on s.IdProducto = ps.IdProducto and s.IdMedida = ps.IdMedida


insert into tp_ProductoStockMovimientos (IdProductoStock,Fecha,IdTipoMovimiento,Cantidad,Observaciones)
select ps.IdProductoStock, '2020-09-21 00:00:00.000' as Fecha, 1 AS IdTipoMovimiento, s.cantidad, 'Carga Inicial' as Observaciones
from #tmpProcesarStock s
	inner join tp_ProductoStock ps on s.IdProducto = ps.IdProducto and s.IdMedida = ps.IdMedida

select * from tp_ProductoStockMovimientos


update tp_ProductoStock set Stock = 0, Reservado = 0

update ps  set ps.Stock = convert(int, s.cantidad), ps.Reservado = 0
from tp_ProductoStock ps 
	left join #tmpProcesarStock s on s.IdProducto = ps.IdProducto and s.IdMedida = ps.IdMedida
where not ps.IdProducto is null and not s.cantidad is null




