

BEGIN TRANSACTION
GO
ALTER TABLE dbo.tp_Clientes ADD
	ComisionApp int NULL
GO
ALTER TABLE dbo.tp_Clientes SET (LOCK_ESCALATION = TABLE)
GO
COMMIT




BEGIN TRANSACTION
GO
ALTER TABLE dbo.tp_PedidoItems ADD
	Observaciones nvarchar(150) NULL
GO

ALTER TABLE dbo.tp_PedidoItems ADD
	MostrarMedidas bit NULL
GO
ALTER TABLE dbo.tp_PedidoItems SET (LOCK_ESCALATION = TABLE)
GO
COMMIT



BEGIN TRANSACTION
GO
ALTER TABLE dbo.tp_Subcategorias ADD
	MostrarMedidas bit NULL
GO
ALTER TABLE dbo.tp_Subcategorias SET (LOCK_ESCALATION = TABLE)
GO
COMMIT


-- Trading

-- update tp_Clientes set ComisionApp = 2 where IdCliente in (41, 67, 164, 208)

--update tp_Subcategorias set MostrarMedidas = 0

--update tp_Subcategorias set MostrarMedidas = 1 where IdSubcategoria in (1,2,3,4,22,28,36,37,40)
