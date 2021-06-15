
use trading
go


if(not exists(select * from tp_Parametros where Clave = 'VERSION_APP'))
	insert into tp_parametros (Descripcion, Clave, Valor, Editable, Vigente)
	select 'Version de la APP publicada.', 'VERSION_APP', 'V_01-01', 0, 1;



select * from tp_Parametros where Clave = 'VERSION_APP'
/*
 update tp_Parametros set Valor = 'V_02.30' where Clave = 'VERSION_APP'
*/
