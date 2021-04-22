


BEGIN TRANSACTION
GO
ALTER TABLE dbo.tp_Clientes ADD
	DescuentoOculto int NULL
GO
ALTER TABLE dbo.tp_Clientes SET (LOCK_ESCALATION = TABLE)
GO
COMMIT


update dbo.tp_Clientes  set DescuentoOculto = 0

BEGIN TRANSACTION
GO
ALTER TABLE dbo.tp_Pedidos ADD
	ExsportoEtiquetasCSV bit NULL
GO
ALTER TABLE dbo.tp_Pedidos SET (LOCK_ESCALATION = TABLE)
GO
COMMIT
