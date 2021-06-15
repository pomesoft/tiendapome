

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



/****** Object:  Table [dbo].[tp_TiposMovimientoStock]    Script Date: 5/5/2021 17:38:03 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tp_TiposMovimientoStock](
	[IdTipoMovimiento] [int] NOT NULL,
	[Descripcion] [nvarchar](50) NOT NULL,
	[Vigente] [bit] NOT NULL,
	[Tipo] [int] NULL,
 CONSTRAINT [PK_tp_TiposMovimientoStock] PRIMARY KEY CLUSTERED 
(
	[IdTipoMovimiento] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO


INSERT [dbo].[tp_TiposMovimientoStock] ([IdTipoMovimiento], [Descripcion], [Vigente], [Tipo]) VALUES (1, N'CARGA INICIAL', 1, NULL)
GO
INSERT [dbo].[tp_TiposMovimientoStock] ([IdTipoMovimiento], [Descripcion], [Vigente], [Tipo]) VALUES (2, N'INGRESO', 1, 1)
GO
INSERT [dbo].[tp_TiposMovimientoStock] ([IdTipoMovimiento], [Descripcion], [Vigente], [Tipo]) VALUES (3, N'SALIDA', 1, 2)
GO
INSERT [dbo].[tp_TiposMovimientoStock] ([IdTipoMovimiento], [Descripcion], [Vigente], [Tipo]) VALUES (4, N'AJUSTE POSITIVO', 1, 1)
GO
INSERT [dbo].[tp_TiposMovimientoStock] ([IdTipoMovimiento], [Descripcion], [Vigente], [Tipo]) VALUES (5, N'AJUSTE NEGATIVO', 1, 2)
GO




/****** Object:  Table [dbo].[tp_SubcategoriaDescuento]    Script Date: 13/5/2021 01:22:33 ******/

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[tp_SubcategoriaDescuento](
	[IdSubcategoriaDescuento] [int] IDENTITY(1,1) NOT NULL,
	[IdSubcategoria] [int] NOT NULL,
	[PorcentajeDescuento] [decimal](18, 2) NULL,
 CONSTRAINT [PK_tp_SubctagoriaDescuento] PRIMARY KEY CLUSTERED 
(
	[IdSubcategoriaDescuento] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO




SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[dm_ActualizacionesStock](
	[Momento] [nvarchar](50) NOT NULL,
	[Fecha] [datetime] NOT NULL,
	[IdPedido] [int] NOT NULL,
	[Numero] [int] NOT NULL,
	[IdCliente] [int] NULL,
	[ProductoStock_IdProductoStock] [int] NOT NULL,
	[ProductoStock_IdProducto] [int] NOT NULL,
	[ProductoStock_IdMedida] [int] NOT NULL,
	[ProductoStock_Stock] [int] NOT NULL,
	[ProductoStock_Reservado] [int] NOT NULL,
	[PedidoItemProducto_IdPedidoItemProducto] [int] NOT NULL,
	[PedidoItemProducto_IdProductoStock] [int] NOT NULL,
	[PedidoItemProducto_IdMedida] [int] NOT NULL,
	[PedidoItemProducto_IdPedidoItem] [int] NOT NULL,
	[PedidoItemProducto_Cantidad] [int] NOT NULL,
	[PedidoItemProducto_IdEstadoItem] [int] NULL,
	[PedidoItemProducto_StockDisponible] [int] NULL,
	[PedidoItemProducto_StockReservado] [int] NULL
) ON [PRIMARY]
GO

/****** Object:  Table [dbo].[dm_MovimientosStock]    Script Date: 25/5/2021 18:42:43 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[dm_MovimientosStock](
	[Tipo] [nvarchar](150) NOT NULL,
	[Categoria] [nvarchar](150) NOT NULL,
	[Subcategoria] [nvarchar](150) NOT NULL,
	[Codigo] [int] NULL,
	[IdProductoStock] [int] NULL,
	[Orden] [int] NOT NULL,
	[Movimiento] [varchar](32) NOT NULL,
	[Fecha] [datetime] NULL,
	[Pedido] [varchar](30) NULL,
	[Observaciones] [nvarchar](607) NULL,
	[IdMedida] [int] NOT NULL,
	[Medida] [nvarchar](50) NOT NULL,
	[Cantidad] [int] NOT NULL
) ON [PRIMARY]
GO



/****** Object:  Table [dbo].[dm_MovimientosStockDetalle]    Script Date: 25/5/2021 18:43:08 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[dm_MovimientosStockDetalle](
	[Tipo] [nvarchar](150) NOT NULL,
	[Categoria] [nvarchar](150) NOT NULL,
	[Subcategoria] [nvarchar](150) NOT NULL,
	[Codigo] [int] NULL,
	[Orden] [int] NOT NULL,
	[Movimiento] [varchar](32) NOT NULL,
	[Fecha] [datetime] NULL,
	[Pedido] [varchar](30) NULL,
	[Observaciones] [nvarchar](607) NULL,
	[Talle 6] [int] NULL,
	[Talle 7] [int] NULL,
	[Talle 8] [int] NULL,
	[Talle 9] [int] NULL,
	[Talle 10] [int] NULL,
	[Talle 17] [int] NULL,
	[Talle 18] [int] NULL,
	[Talle 19] [int] NULL,
	[Talle 20] [int] NULL,
	[Talle 21] [int] NULL,
	[Talle Unico] [int] NULL
) ON [PRIMARY]
GO




/****** Object:  Table [dbo].[dm_MovimientosStockInidicadores]    Script Date: 25/5/2021 18:43:22 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[dm_MovimientosStockInidicadores](
	[Tipo] [nvarchar](150) NOT NULL,
	[Categoria] [nvarchar](150) NOT NULL,
	[Subcategoria] [nvarchar](150) NOT NULL,
	[Codigo] [int] NULL,
	[IdProductoStock] [int] NOT NULL,
	[Medida] [nvarchar](250) NULL,
	[CargaInicial] [int] NULL,
	[Ingresos] [int] NULL,
	[Salidas] [int] NULL,
	[PedidosFinalizados] [int] NULL,
	[NotasPedido] [int] NULL,
	[NotasCredito] [int] NULL,
	[StockFisicoCalculado] [int] NULL,
	[StockFisico] [int] NULL,
	[StockFisicoDiferencia] [int] NULL,
	[StockReservadoCalculado] [int] NULL,
	[StockReservado] [int] NULL,
	[StockReservadodiferencia] [int] NULL,
	[PedidosCancelados] [int] NULL,
 CONSTRAINT [PK_dm_MovimientosStockInidicadores] PRIMARY KEY CLUSTERED 
(
	[IdProductoStock] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO





delete from tp_Parametros where Clave = 'VENTA_MAYORISTA'
insert into tp_Parametros (Descripcion, Clave, Valor, Editable, Vigente)
select 'Determina si el carrito es para venta mayorista, en el producto muestra Peso y Precio x Gr. Si no e está ete parametro se toma como venta minorista', 'VENTA_MAYORISTA', 'SI', 0, 1;


delete from tp_Parametros where Clave = 'MOSTRAR_FACTURACION'
insert into tp_Parametros (Descripcion, Clave, Valor, Editable, Vigente)
select 'Determian si se muestra/oculta la opcion del menu Facturacion. Si no e está este parametro se muestra la opción del menú Facturacion', 'MOSTRAR_FACTURACION', 'SI', 0, 1;


SET IDENTITY_INSERT dbo.tp_Estados ON
GO
insert into dbo.tp_Estados (IdEstado, Descripcion, Vigente, Orden)
--select 8, 'PROVEEDOR', 0 , 4 union
select  9, 'FACTURADO', 1 , 6 
SET IDENTITY_INSERT dbo.tp_Estados OFF
GO

update dbo.tp_Estados set Orden = 7 where IdEstado = 5
update dbo.tp_Estados set Vigente = 1 where IdEstado = 6


update tp_PedidoItemProducto set StockDisponible = StockReservado where StockDisponible is null




--update tp_Parametros set Valor = 'https://hannajoyasmayorista.com.ar/backend/' where Clave = 'URL_HOST'
--update tp_Productos set FotoLink ='https://hannajoyasmayorista.com.ar/backend' + SUBSTRING(FotoLink,35, len(FotoLink)) 


--select * from tp_Parametros where Clave = 'URL_HOST'

--select Foto, FotoLink,
--	'https://hannajoyasmayorista.com.ar/backend' + SUBSTRING(FotoLink,35, len(FotoLink))  
--from tp_Productos

