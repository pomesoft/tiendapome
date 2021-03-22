
SET IDENTITY_INSERT dbo.tp_Estados ON 
GO

insert into dbo.tp_Estados (IdEstado, Descripcion, Vigente, Orden)
--select 8, 'PROVEEDOR', 0 , 4 union
select 9, 'FACTURADO', 1 , 6 

SET IDENTITY_INSERT dbo.tp_Estados OFF
GO

update dbo.tp_Estados set Orden = 7 where IdEstado = 5
update dbo.tp_Estados set Vigente = 1 where IdEstado = 6

select * from dbo.tp_Estados where Vigente = 1 order by Orden


--update dbo.tp_Pedidos set IdEstado = 9 where IdEstado = 4 and Fecha < '2020-10-20'
select count(*) from dbo.tp_Pedidos where IdEstado = 9
select count(*) from dbo.tp_Pedidos where IdEstado = 4 and Fecha < '2020-10-20'


SET IDENTITY_INSERT dbo.tp_SituacionIVA ON 
GO

insert into dbo.tp_SituacionIVA (IdSituacionIVA, Descripcion, Vigente)
select 1, 'Consumidor Final', 1 union
select 2, 'Exento', 1 union
select 3, 'Responsable Inscripto', 1 union
select 4, 'Responsable Monotributo', 1 union
select 5, 'No Responsable', 1 union
select 6, 'Responsable No Inscripto', 1

SET IDENTITY_INSERT dbo.tp_SituacionIVA OFF
GO



SET IDENTITY_INSERT dbo.tp_Provincias ON 
GO

insert into dbo.tp_Provincias (IdProvincia, Descripcion)

select 1, 'CAPITAL FEDERAL' union
select 2, 'BUENOS AIRES' union
select 3, 'CATAMARCA' union
select 4, 'CÓRDOBA' union
select 5, 'CORRIENTES' union
select 6, 'CHACO' union
select 7, 'CHUBUT' union
select 8, 'ENTRE RÍOS' union
select 9, 'FORMOSA' union
select 10, 'JUJUY' union
select 11, 'LA PAMPA' union
select 12, 'LA RIOJA' union
select 13, 'MENDOZA' union
select 14, 'MISIONES' union
select 15, 'NEUQUÉN' union
select 16, 'RÍO NEGRO' union
select 17, 'SALTA' union
select 18, 'SAN JUAN' union
select 19, 'SAN LUIS' union
select 20, 'SANTA CRUZ' union
select 21, 'SANTA FE' union
select 22, 'SANTIAGO DEL ESTERO' union
select 23, 'TIERRA DEL FUEGO' union
select 24, 'TUCUMÁN' union
select 99, 'EXTERIO'

SET IDENTITY_INSERT dbo.tp_Provincias OFF
GO


SET IDENTITY_INSERT [dbo].[tp_VentaTiposComprobante] ON 
GO
INSERT [dbo].[tp_VentaTiposComprobante] ([IdVentaTipoComprobante], [Descripcion], [Abreviado], [EsDebe]) VALUES (1, N'Nota de Pedido', N'NP', 1)
GO
INSERT [dbo].[tp_VentaTiposComprobante] ([IdVentaTipoComprobante], [Descripcion], [Abreviado], [EsDebe]) VALUES (2, N'Nota de Crédito', N'NC', 0)
GO
INSERT [dbo].[tp_VentaTiposComprobante] ([IdVentaTipoComprobante], [Descripcion], [Abreviado], [EsDebe]) VALUES (4, N'Ajuste de Cta Cte posito +', N'AP', 0)
GO
INSERT [dbo].[tp_VentaTiposComprobante] ([IdVentaTipoComprobante], [Descripcion], [Abreviado], [EsDebe]) VALUES (5, N'Ajuste de Cta Cte negativo -', N'AN', 1)
GO
INSERT [dbo].[tp_VentaTiposComprobante] ([IdVentaTipoComprobante], [Descripcion], [Abreviado], [EsDebe]) VALUES (6, N'Recibo', N'RE', 0)
GO
SET IDENTITY_INSERT [dbo].[tp_VentaTiposComprobante] OFF
GO



if(not exists(select * from tp_Parametros where Clave = 'MOSTRAR_FACTURACION'))
	insert into tp_Parametros (Descripcion, Clave, Valor, Editable, Vigente)
	select 'Determian si se muestra/oculta la opcion del menu Facturacion. Si no e está este parametro se muestra la opción del menú Facturacion', 'MOSTRAR_FACTURACION', 'NO', 0, 1;
