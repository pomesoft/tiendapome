
BEGIN TRANSACTION
GO
ALTER TABLE dbo.tp_Pedidos ADD
	NumeroPedidoProveedor int NULL,
	IdPedidoMinorista int NULL,
	NumeroPedidoMinorista int NULL
GO
ALTER TABLE dbo.tp_Pedidos SET (LOCK_ESCALATION = TABLE)
GO
COMMIT
