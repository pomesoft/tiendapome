


BEGIN TRANSACTION
GO
ALTER TABLE dbo.tp_Clientes ADD
	DescuentoOculto int NULL
GO
ALTER TABLE dbo.tp_Clientes SET (LOCK_ESCALATION = TABLE)
GO
COMMIT


update dbo.tp_Clientes  set DescuentoOculto = 0