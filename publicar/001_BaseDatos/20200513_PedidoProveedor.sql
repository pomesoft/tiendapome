use anisajoyas
go

BEGIN TRANSACTION
GO
ALTER TABLE dbo.tp_Pedidos ADD
	IdPedidoProveedor int NULL
GO
ALTER TABLE dbo.tp_Pedidos SET (LOCK_ESCALATION = TABLE)
GO
COMMIT

BEGIN TRANSACTION
GO
ALTER TABLE dbo.tp_Estados ADD
	Orden int NULL
GO
ALTER TABLE dbo.tp_Estados SET (LOCK_ESCALATION = TABLE)
GO
COMMIT

update tp_Estados set orden = 1 where IdEstado = 1
update tp_Estados set orden = 2 where IdEstado = 2
update tp_Estados set orden = 3 where IdEstado = 3
update tp_Estados set orden = 5 where IdEstado = 4
update tp_Estados set orden = 6 where IdEstado = 5
update tp_Estados set orden = 7 where IdEstado = 6
update tp_Estados set orden = 8 where IdEstado = 7

if(not exists(select * from tp_Estados where Descripcion = 'PROVEEDOR'))
	insert into tp_Estados (Descripcion, Vigente, Orden) values ('PROVEEDOR'	, 1, 4)


if(not exists(select * from tp_Parametros where Clave = 'NRO_VENTAS_WHATSAPP'))
	insert into tp_Parametros (Descripcion, Clave, Valor, Editable, Vigente)
	select 'Número de WhatsApp para atención.', 'NRO_VENTAS_WHATSAPP', '5491127329260', 1, 1;
