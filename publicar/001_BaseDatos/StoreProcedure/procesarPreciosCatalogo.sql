USE [micatalogo]
GO

ALTER procedure [dbo].[ProcesarPrecioMinorista] as

declare @monedaVenta varchar(50)
select top 1 @monedaVenta = Valor from trading.dbo.tp_Parametros where Clave = 'MONEDA_VENTA'

declare @porcentajeGanancia int
select top 1 @porcentajeGanancia = Valor from queenmary.dbo.tp_Parametros where Clave = 'PORC_GANANCIA_GRAL'

declare @cotizaciondolar decimal(18,2)
select top 1 @cotizaciondolar = Cotizacion from queenmary.dbo.tp_Cotizaciones order by Fecha desc


--lista de precio que tiene QueenMary en Trading
declare @idCliente int
select @idCliente = 14
select lp.IdListaPrecio, lp.Codigo as LP_Codigo, lp.Precio as LP_Precio, lpc.Codigo as LPC_Codigo, lpc.Precio as LPC_Precio 
into #tmp_ListaPrecioCliente
from trading.dbo.tp_ListasPrecio lp 
	inner join trading.dbo.tp_ListasPrecioCliente lpc on lpc.idListaPrecio = lp.idListaPrecio
	left join  trading.dbo.tp_ClienteListas cl on cl.IdListaCliente = lpc.idListaPrecioCliente
where cl.IdCliente = @idCliente


select	p.Codigo, p.TipoPrecio, p.Peso, p.PrecioUnitario, lp.LPC_Precio as ListaPrecio, 
		case when p.TipoPrecio=1 then lp.LPC_Precio else (p.PrecioUnitario -((p.PrecioUnitario * lp.LPC_Precio) / 100)) end as PrecioCosto
into #tmp_PrecioCosto
from trading.dbo.tp_Productos p
	inner join #tmp_ListaPrecioCliente lp on p.IdListaPrecio = lp.idListaPrecio
order by p.Codigo

 
select Codigo, TipoPrecio, Peso, PrecioUnitario, ListaPrecio, PrecioCosto, @porcentajeGanancia as PorcentajeGanancia,
		PrecioCosto + ((PrecioCosto*@porcentajeGanancia)/100) as PrecioUnitarioProcesado
into #tmp_PrecioUnitario
from #tmp_PrecioCosto



select	Codigo, TipoPrecio, Peso, PrecioUnitario, ListaPrecio, 
		case when TipoPrecio=1 then Peso * PrecioCosto else PrecioCosto end as PrecioCosto, 
		PorcentajeGanancia, PrecioUnitarioProcesado,
		case when TipoPrecio=1 then Peso * PrecioUnitarioProcesado else PrecioUnitarioProcesado end as PrecioUnitarioFinal
into #tmp_PrecioUnitarioFinal
from #tmp_PrecioUnitario


truncate table micatalogo.dbo.tp_ProductosPrecios

insert into micatalogo.dbo.tp_ProductosPrecios
select	Codigo, TipoPrecio, Peso, PrecioUnitario, ListaPrecio, PrecioCosto, 
		PorcentajeGanancia, PrecioUnitarioProcesado, PrecioUnitarioFinal,
		(PrecioUnitarioFinal * @cotizaciondolar) as PrecioUnitarioMinorista
from #tmp_PrecioUnitarioFinal



update p set p.PrecioUnitarioMinorista = pu.PrecioUnitarioFinal*@cotizaciondolar
from micatalogo.dbo.tp_Productos as p
	inner join #tmp_PrecioUnitarioFinal as pu on p.Codigo = pu.Codigo


select * from micatalogo.dbo.tp_ProductosPrecios
select * from micatalogo.dbo.tp_Productos


drop table #tmp_ListaPrecioCliente
drop table #tmp_PrecioCosto
drop table #tmp_PrecioUnitario
drop table #tmp_PrecioUnitarioFinal

