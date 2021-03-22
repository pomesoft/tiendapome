
select * from tp_Tipos
select * from tp_Categorias
select * from tp_Subcategorias

declare @idTipo int
select @idTipo = 100

insert into tp_Categorias (Descripcion, Vigente, IdTipo, Carpeta, Orden)
values ('Abridores', 1, @idTipo, '', 4)

declare @idCategoria int
select @idCategoria = 110

insert into tp_Subcategorias (Descripcion, Vigente, IdCategoria , Carpeta, CantidadProductos, MostrarMedidas)
select 'Económicos', 1, @idCategoria, '', 1, 1 union
select 'CH Plata', 1, @idCategoria, '', 1, 1 union
select 'CH oro 18kt', 1, @idCategoria, '', 1, 1 union
select 'CH  oro 18kt c/tic laminado', 1, @idCategoria, '', 1, 1  union
select 'CH enchapado c/perno 18kt', 1, @idCategoria, '', 1, 1 


