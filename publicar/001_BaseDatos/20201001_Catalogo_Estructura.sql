

BEGIN TRANSACTION
GO
ALTER TABLE dbo.tp_Clientes ADD
	PorcentajeGanancia int NULL
GO
ALTER TABLE dbo.tp_Clientes SET (LOCK_ESCALATION = TABLE)
GO
COMMIT

BEGIN TRANSACTION
GO
ALTER TABLE dbo.tp_Clientes ADD
	NombreCatalogo nvarchar(100) NULL
GO
ALTER TABLE dbo.tp_Clientes SET (LOCK_ESCALATION = TABLE)
GO
COMMIT



update tp_Parametros set Valor = 'Gracias por registrarte! Ya podés compartir el catalogo con tus clientas. Exitos!!! ' where Clave = 'LEYENDA_REGISTRO'  
update tp_Parametros set Valor = 'https://joyasqueenmary.com.ar/' where Clave = 'URL_MAYORISTA'

/*
delete [dbo].[tp_PedidoItemProducto]
delete [dbo].[tp_PedidoItems]
delete [dbo].[tp_Pedidos]
delete [dbo].[tp_ProductoStockMovimientos]
delete [dbo].[tp_ProductoStock]
delete [dbo].[tp_Productos]
delete [dbo].[tp_SubcategoriasMerge]
delete [dbo].[tp_SubcategoriaMedidas]
delete [dbo].[tp_Subcategorias]
delete [dbo].[tp_Categorias]
delete [dbo].[tp_Tipos]
delete [dbo].[tp_ClienteListas]
*/