


/****** Object:  Table [dbo].[tp_DocumentosVenta]    Script Date: 26/10/2020 12:00:30 p.m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tp_DocumentosVenta](
	[IdVenta] [int] IDENTITY(1,1) NOT NULL,
	[IdEmpresa] [int] NOT NULL,
	[IdUsuario] [int] NOT NULL,
	[IdCliente] [int] NOT NULL,
	[IdPedido] [int] NULL,
	[NumeroPedido] [int] NULL,
	[IdTipo] [int] NOT NULL,
	[Letra] [nvarchar](10) NOT NULL,
	[Sucursal] [int] NOT NULL,
	[Numero] [int] NOT NULL,
	[Fecha] [datetime] NOT NULL,
	[Vencimiento] [datetime] NOT NULL,
	[Gravado] [decimal](18, 2) NULL,
	[Descuento] [decimal](18, 2) NULL,
	[PorcentajeIVA] [decimal](18, 2) NULL,
	[IVA] [decimal](18, 2) NULL,
	[Total] [decimal](18, 2) NULL,
	[Pendiente] [decimal](18, 2) NULL,
	[Comision] [decimal](18, 2) NULL,
	[Efectivo] [decimal](18, 2) NULL,
	[EfectivoCotizaDolar] [decimal](18, 2) NULL,
	[Dolares] [decimal](18, 2) NULL,
	[DolaresCotizaDolar] [decimal](18, 2) NULL,
	[Euros] [decimal](18, 2) NULL,
	[EurosCotizaDolar] [decimal](18, 2) NULL,
	[Cheques] [decimal](18, 2) NULL,
	[ChequesCotizaDolar] [decimal](18, 2) NULL,
	[Tarjeta] [decimal](18, 2) NULL,
	[TarjetaCotizaDolar] [decimal](18, 2) NULL,
	[MercadoPago] [decimal](18, 2) NULL,
	[MercadoPagoCotizaDolar] [decimal](18, 2) NULL,
	[DepositoTransferencia] [decimal](18, 2) NULL,
	[DepositoTransferCotizaDolar] [decimal](18, 2) NULL,
	[RetencionIVA] [decimal](18, 2) NULL,
	[RetencionGanancia] [decimal](18, 2) NULL,
	[RetencionIngBrutos] [decimal](18, 2) NULL,
	[Anulado] [bit] NULL,
 CONSTRAINT [PK_tp_DocumentosVenta] PRIMARY KEY CLUSTERED 
(
	[IdVenta] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tp_DocumentoVentaItems]    Script Date: 26/10/2020 12:00:30 p.m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tp_DocumentoVentaItems](
	[IdVentaItem] [int] IDENTITY(1,1) NOT NULL,
	[IdVenta] [int] NOT NULL,
	[NroItem] [int] NULL,
	[IdProductoStock] [int] NULL,
	[Descripcion] [nvarchar](150) NOT NULL,
	[Cantidad] [int] NOT NULL,
	[PrecioUnitario] [decimal](18, 2) NOT NULL,
	[Precio] [decimal](18, 2) NOT NULL,
	[IdPedidoItemProducto] [int] NULL,
 CONSTRAINT [PK_tp_DocumentoVentaItems] PRIMARY KEY CLUSTERED 
(
	[IdVentaItem] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tp_DocumentoVentaObservaciones]    Script Date: 26/10/2020 12:00:30 p.m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tp_DocumentoVentaObservaciones](
	[IdVentaObserv] [int] IDENTITY(1,1) NOT NULL,
	[IdVenta] [int] NOT NULL,
	[Observaciones] [nvarchar](max) NULL,
	[Adjunto] [nvarchar](250) NULL,
 CONSTRAINT [PK_tp_DocumentoVentaObservaciones] PRIMARY KEY CLUSTERED 
(
	[IdVentaObserv] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tp_Provincias]    Script Date: 26/10/2020 12:00:30 p.m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tp_Provincias](
	[IdProvincia] [int] IDENTITY(1,1) NOT NULL,
	[Descripcion] [nvarchar](150) NOT NULL,
 CONSTRAINT [PK_tp_Provincias] PRIMARY KEY CLUSTERED 
(
	[IdProvincia] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tp_SituacionIVA]    Script Date: 26/10/2020 12:00:30 p.m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tp_SituacionIVA](
	[IdSituacionIVA] [int] IDENTITY(1,1) NOT NULL,
	[Descripcion] [nvarchar](100) NOT NULL,
	[Vigente] [bit] NOT NULL,
 CONSTRAINT [PK_tp_SituacionIVA] PRIMARY KEY CLUSTERED 
(
	[IdSituacionIVA] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tp_VentaTiposComprobante]    Script Date: 26/10/2020 12:00:30 p.m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tp_VentaTiposComprobante](
	[IdVentaTipoComprobante] [int] IDENTITY(1,1) NOT NULL,
	[Descripcion] [nvarchar](50) NOT NULL,
	[Abreviado] [nvarchar](10) NOT NULL,
	[EsDebe] [bit] NULL,
 CONSTRAINT [PK_tp_VentaTiposComprobante] PRIMARY KEY CLUSTERED 
(
	[IdVentaTipoComprobante] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[tp_DocumentosVenta]  WITH CHECK ADD  CONSTRAINT [FK_tp_DocumentosVenta_tp_Clientes] FOREIGN KEY([IdCliente])
REFERENCES [dbo].[tp_Clientes] ([IdCliente])
GO
ALTER TABLE [dbo].[tp_DocumentosVenta] CHECK CONSTRAINT [FK_tp_DocumentosVenta_tp_Clientes]
GO
ALTER TABLE [dbo].[tp_DocumentosVenta]  WITH CHECK ADD  CONSTRAINT [FK_tp_DocumentosVenta_tp_Usuario] FOREIGN KEY([IdUsuario])
REFERENCES [dbo].[tp_Clientes] ([IdCliente])
GO
ALTER TABLE [dbo].[tp_DocumentosVenta] CHECK CONSTRAINT [FK_tp_DocumentosVenta_tp_Usuario]
GO
ALTER TABLE [dbo].[tp_DocumentosVenta]  WITH CHECK ADD  CONSTRAINT [FK_tp_DocumentosVenta_tp_VentaTiposComprobante] FOREIGN KEY([IdTipo])
REFERENCES [dbo].[tp_VentaTiposComprobante] ([IdVentaTipoComprobante])
GO
ALTER TABLE [dbo].[tp_DocumentosVenta] CHECK CONSTRAINT [FK_tp_DocumentosVenta_tp_VentaTiposComprobante]
GO
ALTER TABLE [dbo].[tp_DocumentoVentaItems]  WITH CHECK ADD  CONSTRAINT [FK_tp_DocumentoVentaItems_tp_DocumentosVenta] FOREIGN KEY([IdVenta])
REFERENCES [dbo].[tp_DocumentosVenta] ([IdVenta])
GO
ALTER TABLE [dbo].[tp_DocumentoVentaItems] CHECK CONSTRAINT [FK_tp_DocumentoVentaItems_tp_DocumentosVenta]
GO
ALTER TABLE [dbo].[tp_DocumentoVentaItems]  WITH CHECK ADD  CONSTRAINT [FK_tp_DocumentoVentaItems_tp_ProductoStock] FOREIGN KEY([IdVentaItem])
REFERENCES [dbo].[tp_ProductoStock] ([IdProductoStock])
GO
ALTER TABLE [dbo].[tp_DocumentoVentaItems] CHECK CONSTRAINT [FK_tp_DocumentoVentaItems_tp_ProductoStock]
GO




BEGIN TRANSACTION
GO
ALTER TABLE dbo.tp_Clientes ADD
	Direccion nvarchar(250) NULL,
	Localidad nvarchar(150) NULL,
	IdProvincia int NULL,
	IdSituacionIVA int NULL,
	CodigoPostal nvarchar(50) NULL,
	Observaciones nvarchar(500) NULL
GO

ALTER TABLE dbo.tp_Clientes ADD CONSTRAINT
	FK_tp_Clientes_tp_Provincias FOREIGN KEY
	(
	IdProvincia
	) REFERENCES dbo.tp_Provincias
	(
	IdProvincia
	) ON UPDATE  NO ACTION 
	 ON DELETE  NO ACTION 
	
GO
ALTER TABLE dbo.tp_Clientes ADD CONSTRAINT
	FK_tp_Clientes_tp_SituacionIVA FOREIGN KEY
	(
	IdSituacionIVA
	) REFERENCES dbo.tp_SituacionIVA
	(
	IdSituacionIVA
	) ON UPDATE  NO ACTION 
	 ON DELETE  NO ACTION 
	
GO
COMMIT
