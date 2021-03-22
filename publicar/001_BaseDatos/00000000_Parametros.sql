
if(not exists(select * from tp_Parametros where Clave = 'PORCENTAJE_SUBTOTAL'))
	insert into tp_Parametros (Descripcion, Clave, Valor, Editable, Vigente)
	select 'Porcentaje para agregar al subtotal de cada item del pedido', 'PORCENTAJE_SUBTOTAL', '0', 1, 1;


if(not exists(select * from tp_Parametros where Clave = 'URL_HOST'))
	insert into tp_Parametros (Descripcion, Clave, Valor, Editable, Vigente)
	select 'URL del HOST del sitio, para armar el link de las fotos', 'URL_HOST', 'https://tradingjoyas.com/', 0, 1;


if(not exists(select * from tp_Parametros where Clave = 'URL_MAYORISTA'))
	insert into tp_Parametros (Descripcion, Clave, Valor, Editable, Vigente)
	select 'URL Mayorista de Trading Joyas, para obtener Stock diponible', 'URL_MAYORISTA', 'https://tradingjoyas.com/', 0, 1;


if(not exists(select * from tp_Parametros where Clave = 'TRADING_ID_CLIENTE'))
	insert into tp_Parametros (Descripcion, Clave, Valor, Editable, Vigente)
	select 'Numero de Cliente que soy para Trading Joyas', 'TRADING_ID_CLIENTE', '9', 0, 1;


if(not exists(select * from tp_Parametros where Clave = 'PORC_GANANCIA_GRAL'))
	insert into tp_Parametros (Descripcion, Clave, Valor, Editable, Vigente)
	select 'Porcentaje de ganancia que se la aplica al Stock Mayorista', 'PORC_GANANCIA_GRAL', '50', 1, 1;


if(not exists(select * from tp_Parametros where Clave = 'LISTA_MAYORISTA'))
	insert into tp_Parametros (Descripcion, Clave, Valor, Editable, Vigente)
	select 'Código de Lista de Precios para productos del Mayorista', 'LISTA_MAYORISTA', 'MAYORISTA', 1, 1;

if(not exists(select * from tp_Parametros where Clave = 'LISTA_MAYORISTA_DEFAULT'))
	insert into tp_Parametros (Descripcion, Clave, Valor, Editable, Vigente)
	select 'Lista de precios que se asigna automáticamente a un cliente cuando se registra', 'LISTA_MAYORISTA_DEFAULT', 'M00', 1, 1;
	
if(not exists(select * from tp_Parametros where Clave = 'COMPRA_MINIMA'))
	insert into tp_Parametros (Descripcion, Clave, Valor, Editable, Vigente)
	select 'Monto minimo del pedido para poder finalizarlo, hasta que no se supere este monto no se habilira el boton finalizar', 'COMPRA_MINIMA', '5000', 1, 1;


if(not exists(select * from tp_Parametros where Clave = 'VENTA_MAYORISTA'))
	insert into tp_Parametros (Descripcion, Clave, Valor, Editable, Vigente)
	select 'Determina si el carrito es para venta mayorista, en el producto muestra Peso y Precio x Gr. Si no e está este parametro se toma como venta minorista', 'VENTA_MAYORISTA', 'NO', 0, 1;
	

if(not exists(select * from tp_Parametros where Clave = 'MOSTRAR_PRODUCTOS'))
	insert into tp_Parametros (Descripcion, Clave, Valor, Editable, Vigente)
	select 'Determian si se muestra/oculta la opcion del menu Productos. Si no e está este parametro se muestra la opción del menú Producto', 'MOSTRAR_PRODUCTOS', 'SI', 0, 1;

if(not exists(select * from tp_Parametros where Clave = 'MOSTRAR_FACTURACION'))
	insert into tp_Parametros (Descripcion, Clave, Valor, Editable, Vigente)
	select 'Determian si se muestra/oculta la opcion del menu Facturacion. Si no e está este parametro se muestra la opción del menú Facturacion', 'MOSTRAR_FACTURACION', 'SI', 0, 1;

	
if(not exists(select * from tp_Parametros where Clave = 'PRIMER_CODIGO_AUTOMATICO'))
	insert into tp_Parametros (Descripcion, Clave, Valor, Editable, Vigente)
	select 'Primer código automático de productos', 'PRIMER_CODIGO_AUTOMATICO', '100000', 0, 1;


if(not exists(select * from tp_Parametros where Clave = 'NRO_VENTAS_WHATSAPP'))
	insert into tp_Parametros (Descripcion, Clave, Valor, Editable, Vigente)
	select 'Número de WhatsApp para atención.', 'NRO_VENTAS_WHATSAPP', '5491127329260', 1, 1;


if(not exists(select * from tp_Parametros where Clave = 'DESCONTAR_STCOK_AL_CONFIRMAR'))
	insert into tp_parametros (Descripcion, Clave, Valor, Editable, Vigente)
	select 'Determina si se descuenta stock al confirmar el pedido.', 'DESCONTAR_STCOK_AL_CONFIRMAR', 'SI', 0, 1;


if(not exists(select * from tp_Parametros where Clave = 'VERIFICAR_STCOK'))
	insert into tp_parametros (Descripcion, Clave, Valor, Editable, Vigente)
	select 'Determina si verifica el stock del producto cuando se agrega al carrito, cuando se finaliza y cuando se reenvia al proveedor.', 'VERIFICAR_STCOK', 'SI', 0, 1;


if(not exists(select * from tp_Parametros where Clave = 'VERIFICAR_STCOK_ MSJ_ERROR'))
	insert into tp_parametros (Descripcion, Clave, Valor, Editable, Vigente)
	select 'Mensaje que se muestra al usuario si hay inconsistencias con el Stock Disponible en la verificación del stock.', 'VERIFICAR_STCOK_ MSJ_ERROR', 'Verificar pedido por falta de stock disponible. Para continuar debe ingresar una cantidad menor o igual al disponible.', 0, 1;


if(not exists(select * from tp_Parametros where Clave = 'HOST_EN_MANTENIMIENTO'))
	insert into tp_parametros (Descripcion, Clave, Valor, Editable, Vigente)
	select 'No muestra ningun producto en el carrito, solo muestra un gif.', 'HOST_EN_MANTENIMIENTO', 'SI', 0, 1;


	
if(not exists(select * from tp_Parametros where Clave = 'VERSION_APP'))
	insert into tp_parametros (Descripcion, Clave, Valor, Editable, Vigente)
	select 'Version de la APP publicada.', 'VERSION_APP', 'V_01-01', 0, 1;


	
if(not exists(select * from tp_Parametros where Clave = 'REGISTRO_BTN_MAYORISTA'))
	insert into tp_parametros (Descripcion, Clave, Valor, Editable, Vigente)
	select 'Determina si se muestra o no el boton Quiero ser Mayorista en el registro de clientes.', 'REGISTRO_BTN_MAYORISTA', 'SI', 0, 1;

if(not exists(select * from tp_Parametros where Clave = 'LISTA_MAYORISTA_DESCUENTO'))
	insert into tp_parametros (Descripcion, Clave, Valor, Editable, Vigente)
	select 'Lista de precios que se asigna automáticamente a un cliente cuando se registra con el boton QUIERO SER MAYORISTA.', 'LISTA_MAYORISTA_DESCUENTO', 'SI', 0, 1;


if(not exists(select * from tp_Parametros where Clave = 'MOSTRAR_BANNER_BIENVENIDA'))
	insert into tp_parametros (Descripcion, Clave, Valor, Editable, Vigente)
	select 'Banner que se muestra para clientes no registrados.', 'MOSTRAR_BANNER_BIENVENIDA', 'BannerBienvenida.jpeg', 1, 1;


if(not exists(select * from tp_Parametros where Clave = 'MOSTRAR_BANNER_PROMO'))
	insert into tp_parametros (Descripcion, Clave, Valor, Editable, Vigente)
	select 'Banner que se muestra cuando ingresa al carrito.', 'MOSTRAR_BANNER_PROMO', 'BannerPromo.jpeg', 1, 1;


if(not exists(select * from tp_Parametros where Clave = 'MOSTRAR_PRECIOS_SOLO_REGISTRADOS'))
	insert into tp_parametros (Descripcion, Clave, Valor, Editable, Vigente)
	select 'Determina si solo se muestran los precios para clientes registrados y que hayan iniciado sesion.', 'MOSTRAR_PRECIOS_SOLO_REGISTRADOS', 'SI', 0, 1;


	
--update tp_Parametros set Valor = '~/assets/fotos/' where Clave = 'PATH_FOTOS'

select * from tp_Parametros where Clave = 'MOSTRAR_BANNER_BIENVENIDA'





