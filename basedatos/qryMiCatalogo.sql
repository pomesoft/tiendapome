

-- update tp_Clientes set  PorcentajeGanancia = 100 where email = 'cinthiaroe@hotmail.com'
-- 739

use micatalogo
go

if(not exists(select * from tp_Parametros where Clave = 'HOST_EN_MANTENIMIENTO'))
	insert into tp_parametros (Descripcion, Clave, Valor, Editable, Vigente)
	select 'No muestra ningun producto en el carrito, solo muestra un gif.', 'HOST_EN_MANTENIMIENTO', 'SI', 0, 1;


select * from micatalogo.dbo.tp_Clientes where Email like '%zooom%'	-- ISNULL(NombreCatalogo, '') <> ''

exec micatalogo.dbo.ProcesarDatosClientes
exec micatalogo.dbo.ProcesarDatosCatalogo
exec micatalogo.dbo.ProcesarPrecioMinorista



select * from tp_Tipos

select * 
from micatalogo.dbo.tp_Tipos t
	inner join micatalogo.dbo.tp_Categorias c on t.IdTipo = c.IdTipo
	inner join micatalogo.dbo.tp_Subcategorias s on c.IdCategoria = s.IdCategoria
where t.IdTipo = 102


select * from micatalogo.dbo.tp_Productos		 where IdSubcategoria = 111
select * from micatalogo.dbo.tp_ProductosPrecios where PrecioUnitarioMinorista >0 and Codigo in (select Codigo from micatalogo.dbo.tp_Productos where IdSubcategoria = 110)

select * 
from micatalogo.dbo.tp_Productos p
	inner join micatalogo.dbo.tp_ProductosPrecios  pp on p.Codigo = pp.Codigo
where p.IdSubcategoria = 102 and p.Codigo = 3091

select * from micatalogo.dbo.tp_Productos where Codigo = 13092
select * from micatalogo.dbo.tp_ProductosPrecios where Codigo = 699


/*
IdTipo	Descripcion
1		Plata
2		Swarovski
3		Relojes
4		Oferta
100		Anillos en promo
101		Acero Quirúrgico
102		Acero Blanco
*/


select	t.IdTipo, t.Descripcion as Tipo,
		c.IdCategoria, c.Descripcion as Categoria, 
		s.IdSubcategoria, s.Descripcion as Subcategoria 
from tp_Tipos t
	inner join tp_Categorias	as c on t.IdTipo = c.IdTipo   
	inner join tp_Subcategorias as s on c.IdCategoria = s.IdCategoria
where t.IdTipo in (100)
order by t.Descripcion, c.Descripcion, s.Descripcion  

select * from tp_Tipos 

select	t.IdTipo, t.Descripcion as Tipo,
		c.IdCategoria, c.Descripcion as Categoria, 
		s.IdSubcategoria, s.Descripcion as Subcategoria, Count(*) as Cantidad
from tp_Tipos t
	inner join tp_Categorias	as c on t.IdTipo = c.IdTipo   
	inner join tp_Subcategorias as s on c.IdCategoria = s.IdCategoria
	inner join tp_Productos		as p on s.IdSubcategoria = p.IdSubcategoria
where t.IdTipo in (101, 102) --and p.Codigo < 10000
group by t.IdTipo, t.Descripcion,
		c.IdCategoria, c.Descripcion, 
		s.IdSubcategoria, s.Descripcion
order by t.Descripcion, c.Descripcion, s.Descripcion  


select	t.IdTipo, t.Descripcion as Tipo, Count(*) as Cantidad
from tp_Tipos t
	inner join tp_Categorias	as c on t.IdTipo = c.IdTipo   
	inner join tp_Subcategorias as s on c.IdCategoria = s.IdCategoria
	inner join tp_Productos		as p on s.IdSubcategoria = p.IdSubcategoria
where t.IdTipo in (101, 102) --and p.Codigo < 10000
group by t.IdTipo, t.Descripcion
order by t.Descripcion



