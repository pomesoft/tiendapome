



select	t.IdTipo, t.Descripcion as Tipo,
		c.IdCategoria, c.Descripcion as Categoria, 
		s.IdSubcategoria, s.Descripcion as Subcategoria 
from tp_Tipos t
	inner join tp_Categorias	as c on t.IdTipo = c.IdTipo   
	inner join tp_Subcategorias as s on c.IdCategoria = s.IdCategoria
order by t.Descripcion, c.Descripcion, s.Descripcion  


select	t.IdTipo, t.Descripcion as Tipo,
		c.IdCategoria, c.Descripcion as Categoria, 
		s.IdSubcategoria, s.Descripcion as Subcategoria 
from tp_Tipos t
	inner join tp_Categorias	as c on t.IdTipo = c.IdTipo   
	inner join tp_Subcategorias as s on c.IdCategoria = s.IdCategoria
	inner join tp_Productos		as p on s.IdSubcategoria = p.IdSubcategoria
order by t.Descripcion, c.Descripcion, s.Descripcion  



SELECT t.Descripcion as Tipo, C.Descripcion as Categoria, s.Descripcion as Subcategoria, 
		p.FotoLink, '' AS Foto, p.Codigo, p.Ubicacion, p.Peso, 
		case when p.Stock = 1 then 'SI' else 'NO' end as Stock
FROM tp_Productos p 
	inner join tp_Subcategorias s on p.IdSubcategoria = s.IdSubcategoria
	inner join tp_Categorias c on s.IdCategoria = c.IdCategoria
	inner join tp_Tipos t on c.IdTipo = t.IdTipo
WHERE not p.FotoLink is null 
	and Codigo > 3256
ORDER BY c.Descripcion, s.Descripcion




select c.Descripcion as Categoria, s.Descripcion as Subcategoria, p.* 
from tp_Categorias as c 
		inner join tp_Subcategorias as s on c.IdCategoria = s.IdCategoria
		inner join tp_Productos as p on s.IdSubcategoria = p.IdSubcategoria
order by c.Descripcion, s.Descripcion  



SELECT * 
FROM tp_Productos p 
	inner join tp_Subcategorias s on p.IdSubcategoria = s.IdSubcategoria
	inner join tp_Categorias c on s.IdCategoria = c.IdCategoria
	inner join tp_Tipos t on c.IdTipo = t.IdTipo

		

/* para actualizar cantidad de productos con stock en cada subcategoria*/
update a set a.CantidadProductos = isnull(b.CantidadProductos,0)
from tp_Subcategorias as a
left join (
		select s.IdSubcategoria, count(*) as CantidadProductos
		from tp_Subcategorias s
			inner join tp_Productos p on s.IdSubcategoria = p.IdSubcategoria
		where p.Stock > 0
		group by s.IdSubcategoria
		) as b on a.IdSubcategoria = b.IdSubcategoria
