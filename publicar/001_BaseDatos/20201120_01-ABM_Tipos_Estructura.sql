

BEGIN TRANSACTION
GO
ALTER TABLE dbo.tp_DocumentoVentaObservaciones ADD
	AdjuntoLink nvarchar(250) NULL
GO
ALTER TABLE dbo.tp_DocumentoVentaObservaciones SET (LOCK_ESCALATION = TABLE)
GO
COMMIT

BEGIN TRANSACTION
GO
ALTER TABLE dbo.tp_Subcategorias ADD
	Orden int NULL
GO
ALTER TABLE dbo.tp_Subcategorias SET (LOCK_ESCALATION = TABLE)
GO
COMMIT

BEGIN TRANSACTION
GO
ALTER TABLE dbo.tp_Categorias ADD
	Visible bit NULL
GO
ALTER TABLE dbo.tp_Categorias SET (LOCK_ESCALATION = TABLE)
GO
COMMIT

BEGIN TRANSACTION
GO
ALTER TABLE dbo.tp_Subcategorias ADD
	Visible bit NULL
GO
ALTER TABLE dbo.tp_Subcategorias SET (LOCK_ESCALATION = TABLE)
GO
COMMIT


BEGIN TRANSACTION
GO
ALTER TABLE dbo.tp_Productos ADD
	Etiquetas nvarchar(100) NULL
GO
ALTER TABLE dbo.tp_Productos SET (LOCK_ESCALATION = TABLE)
GO
COMMIT

BEGIN TRANSACTION
GO
ALTER TABLE dbo.tp_SubcategoriasMerge ADD
	EtiquetaMayorista nvarchar(100) NULL
GO
ALTER TABLE dbo.tp_SubcategoriasMerge SET (LOCK_ESCALATION = TABLE)
GO
COMMIT


BEGIN TRANSACTION
GO
ALTER TABLE dbo.tp_PedidoItemProducto
	DROP CONSTRAINT FK_tp_PedidoItemProducto_tp_ProductoStock
GO
ALTER TABLE dbo.tp_ProductoStock SET (LOCK_ESCALATION = TABLE)
GO
COMMIT
BEGIN TRANSACTION
GO
ALTER TABLE dbo.tp_PedidoItemProducto SET (LOCK_ESCALATION = TABLE)
GO
COMMIT


BEGIN TRANSACTION
GO
ALTER TABLE dbo.tp_ProductoStockMovimientos
	DROP CONSTRAINT FK_tp_ProductoStockMovimientos_tp_ProductoStock
GO
ALTER TABLE dbo.tp_ProductoStock SET (LOCK_ESCALATION = TABLE)
GO
COMMIT
BEGIN TRANSACTION
GO
ALTER TABLE dbo.tp_ProductoStockMovimientos SET (LOCK_ESCALATION = TABLE)
GO
COMMIT




BEGIN TRANSACTION
GO
ALTER TABLE dbo.tp_DocumentoVentaItems
	DROP CONSTRAINT FK_tp_DocumentoVentaItems_tp_ProductoStock
GO
ALTER TABLE dbo.tp_ProductoStock SET (LOCK_ESCALATION = TABLE)
GO
COMMIT
BEGIN TRANSACTION
GO
ALTER TABLE dbo.tp_DocumentoVentaItems SET (LOCK_ESCALATION = TABLE)
GO
COMMIT
