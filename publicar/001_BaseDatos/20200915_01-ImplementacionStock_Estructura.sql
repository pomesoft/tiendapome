

/****** Object:  Table [dbo].[tp_Medidas]    Script Date: 17/09/2020 03:07:35 a.m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[tp_Medidas]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[tp_Medidas](
	[IdMedida] [int] IDENTITY(1,1) NOT NULL,
	[Descripcion] [nvarchar](50) NOT NULL,
	[Vigente] [bit] NOT NULL,
	[Observaciones] [nvarchar](250) NULL,
 CONSTRAINT [PK_tp_Medidas] PRIMARY KEY CLUSTERED 
(
	[IdMedida] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
END
GO
/****** Object:  Table [dbo].[tp_PedidoItemProducto]    Script Date: 17/09/2020 03:07:36 a.m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[tp_PedidoItemProducto]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[tp_PedidoItemProducto](
	[IdPedidoItemProducto] [int] IDENTITY(1,1) NOT NULL,
	[IdProductoStock] [int] NOT NULL,
	[IdMedida] [int] NOT NULL,
	[IdPedidoItem] [int] NOT NULL,
	[Cantidad] [int] NOT NULL,
	[IdEstadoItem] [int] NULL,
	[StockDisponible] [int] NULL,
	[StockReservado] [int] NULL,
 CONSTRAINT [PK_tp_PedidoItemProducto] PRIMARY KEY CLUSTERED 
(
	[IdPedidoItemProducto] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
END
GO
/****** Object:  Table [dbo].[tp_ProductoStock]    Script Date: 17/09/2020 03:07:36 a.m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[tp_ProductoStock]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[tp_ProductoStock](
	[IdProductoStock] [int] IDENTITY(1,1) NOT NULL,
	[IdProducto] [int] NOT NULL,
	[IdMedida] [int] NOT NULL,
	[Stock] [int] NOT NULL,
	[Reservado] [int] NOT NULL,
 CONSTRAINT [PK_tp_ProductoStock] PRIMARY KEY CLUSTERED 
(
	[IdProductoStock] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
END
GO
/****** Object:  Table [dbo].[tp_ProductoStockMovimientos]    Script Date: 17/09/2020 03:07:36 a.m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[tp_ProductoStockMovimientos]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[tp_ProductoStockMovimientos](
	[IdProductoStockMovimiento] [int] IDENTITY(1,1) NOT NULL,
	[IdProductoStock] [int] NOT NULL,
	[Fecha] [datetime] NOT NULL,
	[IdTipoMovimiento] [int] NOT NULL,
	[Cantidad] [int] NOT NULL,
	[Observaciones] [nvarchar](250) NULL,
 CONSTRAINT [PK_ProductoStockMovimientos] PRIMARY KEY CLUSTERED 
(
	[IdProductoStockMovimiento] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
END
GO
/****** Object:  Table [dbo].[tp_SubcategoriaMedidas]    Script Date: 17/09/2020 03:07:36 a.m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[tp_SubcategoriaMedidas]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[tp_SubcategoriaMedidas](
	[IdSubcategoriaMedida] [int] IDENTITY(1,1) NOT NULL,
	[IdSubcategoria] [int] NOT NULL,
	[IdMedida] [int] NOT NULL,
 CONSTRAINT [PK_tp_SubcategoriaMedidas] PRIMARY KEY CLUSTERED 
(
	[IdSubcategoriaMedida] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
END
GO
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_tp_PedidoItemProducto_tp_Medidas]') AND parent_object_id = OBJECT_ID(N'[dbo].[tp_PedidoItemProducto]'))
ALTER TABLE [dbo].[tp_PedidoItemProducto]  WITH CHECK ADD  CONSTRAINT [FK_tp_PedidoItemProducto_tp_Medidas] FOREIGN KEY([IdMedida])
REFERENCES [dbo].[tp_Medidas] ([IdMedida])
GO
IF  EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_tp_PedidoItemProducto_tp_Medidas]') AND parent_object_id = OBJECT_ID(N'[dbo].[tp_PedidoItemProducto]'))
ALTER TABLE [dbo].[tp_PedidoItemProducto] CHECK CONSTRAINT [FK_tp_PedidoItemProducto_tp_Medidas]
GO
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_tp_PedidoItemProducto_tp_PedidoItems]') AND parent_object_id = OBJECT_ID(N'[dbo].[tp_PedidoItemProducto]'))
ALTER TABLE [dbo].[tp_PedidoItemProducto]  WITH CHECK ADD  CONSTRAINT [FK_tp_PedidoItemProducto_tp_PedidoItems] FOREIGN KEY([IdPedidoItem])
REFERENCES [dbo].[tp_PedidoItems] ([IdPedidoItem])
GO
IF  EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_tp_PedidoItemProducto_tp_PedidoItems]') AND parent_object_id = OBJECT_ID(N'[dbo].[tp_PedidoItemProducto]'))
ALTER TABLE [dbo].[tp_PedidoItemProducto] CHECK CONSTRAINT [FK_tp_PedidoItemProducto_tp_PedidoItems]
GO
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_tp_PedidoItemProducto_tp_ProductoStock]') AND parent_object_id = OBJECT_ID(N'[dbo].[tp_PedidoItemProducto]'))
ALTER TABLE [dbo].[tp_PedidoItemProducto]  WITH CHECK ADD  CONSTRAINT [FK_tp_PedidoItemProducto_tp_ProductoStock] FOREIGN KEY([IdProductoStock])
REFERENCES [dbo].[tp_ProductoStock] ([IdProductoStock])
GO
IF  EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_tp_PedidoItemProducto_tp_ProductoStock]') AND parent_object_id = OBJECT_ID(N'[dbo].[tp_PedidoItemProducto]'))
ALTER TABLE [dbo].[tp_PedidoItemProducto] CHECK CONSTRAINT [FK_tp_PedidoItemProducto_tp_ProductoStock]
GO
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_tp_ProductoStock_tp_Medidas]') AND parent_object_id = OBJECT_ID(N'[dbo].[tp_ProductoStock]'))
ALTER TABLE [dbo].[tp_ProductoStock]  WITH CHECK ADD  CONSTRAINT [FK_tp_ProductoStock_tp_Medidas] FOREIGN KEY([IdMedida])
REFERENCES [dbo].[tp_Medidas] ([IdMedida])
GO
IF  EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_tp_ProductoStock_tp_Medidas]') AND parent_object_id = OBJECT_ID(N'[dbo].[tp_ProductoStock]'))
ALTER TABLE [dbo].[tp_ProductoStock] CHECK CONSTRAINT [FK_tp_ProductoStock_tp_Medidas]
GO
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_tp_ProductoStock_tp_Productos]') AND parent_object_id = OBJECT_ID(N'[dbo].[tp_ProductoStock]'))
ALTER TABLE [dbo].[tp_ProductoStock]  WITH CHECK ADD  CONSTRAINT [FK_tp_ProductoStock_tp_Productos] FOREIGN KEY([IdProducto])
REFERENCES [dbo].[tp_Productos] ([IdProducto])
GO
IF  EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_tp_ProductoStock_tp_Productos]') AND parent_object_id = OBJECT_ID(N'[dbo].[tp_ProductoStock]'))
ALTER TABLE [dbo].[tp_ProductoStock] CHECK CONSTRAINT [FK_tp_ProductoStock_tp_Productos]
GO
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_tp_ProductoStockMovimientos_tp_ProductoStock]') AND parent_object_id = OBJECT_ID(N'[dbo].[tp_ProductoStockMovimientos]'))
ALTER TABLE [dbo].[tp_ProductoStockMovimientos]  WITH CHECK ADD  CONSTRAINT [FK_tp_ProductoStockMovimientos_tp_ProductoStock] FOREIGN KEY([IdProductoStock])
REFERENCES [dbo].[tp_ProductoStock] ([IdProductoStock])
GO
IF  EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_tp_ProductoStockMovimientos_tp_ProductoStock]') AND parent_object_id = OBJECT_ID(N'[dbo].[tp_ProductoStockMovimientos]'))
ALTER TABLE [dbo].[tp_ProductoStockMovimientos] CHECK CONSTRAINT [FK_tp_ProductoStockMovimientos_tp_ProductoStock]
GO
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_tp_SubcategoriaMedidas_tp_Medidas]') AND parent_object_id = OBJECT_ID(N'[dbo].[tp_SubcategoriaMedidas]'))
ALTER TABLE [dbo].[tp_SubcategoriaMedidas]  WITH CHECK ADD  CONSTRAINT [FK_tp_SubcategoriaMedidas_tp_Medidas] FOREIGN KEY([IdMedida])
REFERENCES [dbo].[tp_Medidas] ([IdMedida])
GO
IF  EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_tp_SubcategoriaMedidas_tp_Medidas]') AND parent_object_id = OBJECT_ID(N'[dbo].[tp_SubcategoriaMedidas]'))
ALTER TABLE [dbo].[tp_SubcategoriaMedidas] CHECK CONSTRAINT [FK_tp_SubcategoriaMedidas_tp_Medidas]
GO
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_tp_SubcategoriaMedidas_tp_Subcategorias]') AND parent_object_id = OBJECT_ID(N'[dbo].[tp_SubcategoriaMedidas]'))
ALTER TABLE [dbo].[tp_SubcategoriaMedidas]  WITH CHECK ADD  CONSTRAINT [FK_tp_SubcategoriaMedidas_tp_Subcategorias] FOREIGN KEY([IdSubcategoria])
REFERENCES [dbo].[tp_Subcategorias] ([IdSubcategoria])
GO
IF  EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_tp_SubcategoriaMedidas_tp_Subcategorias]') AND parent_object_id = OBJECT_ID(N'[dbo].[tp_SubcategoriaMedidas]'))
ALTER TABLE [dbo].[tp_SubcategoriaMedidas] CHECK CONSTRAINT [FK_tp_SubcategoriaMedidas_tp_Subcategorias]
GO
