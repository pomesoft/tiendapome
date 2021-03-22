

BEGIN TRANSACTION
GO
ALTER TABLE dbo.tp_Tipos ADD
	Visible bit NULL
GO
ALTER TABLE dbo.tp_Tipos SET (LOCK_ESCALATION = TABLE)
GO
COMMIT

update dbo.tp_Tipos set Visible = 1
go



if(not exists(select * from tp_Parametros where Clave = 'LISTA_MAYORISTA_DEFAULT'))
	insert into tp_Parametros (Descripcion, Clave, Valor, Editable, Vigente)
	select 'Lista de precios que se asigna automáticamente a un cliente cuando se registra', 'LISTA_MAYORISTA_DEFAULT', 'M00', 1, 1;

	
if(not exists(select * from tp_Parametros where Clave = 'REGISTRO_BTN_MAYORISTA'))
	insert into tp_parametros (Descripcion, Clave, Valor, Editable, Vigente)
	select 'Determina si se muestra o no el boton Quiero ser Mayorista en el registro de clientes.', 'REGISTRO_BTN_MAYORISTA', 'SI', 0, 1;

if(not exists(select * from tp_Parametros where Clave = 'LISTA_MAYORISTA_DESCUENTO'))
	insert into tp_parametros (Descripcion, Clave, Valor, Editable, Vigente)
	select 'Lista de precios que se asigna automáticamente a un cliente cuando se registra con el boton QUIERO SER MAYORISTA.', 'LISTA_MAYORISTA_DESCUENTO', 'M05', 0, 1;



