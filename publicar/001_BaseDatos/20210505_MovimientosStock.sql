use queenmary
go




/****** Object:  StoredProcedure [dbo].[sp_ProcesarMovimientosStockInidicadores]    Script Date: 5/5/2021 17:38:03 ******/
DROP PROCEDURE IF EXISTS [dbo].[sp_ProcesarMovimientosStockInidicadores]
GO
/****** Object:  StoredProcedure [dbo].[sp_ProcesarMovimientosStockDetalle]    Script Date: 5/5/2021 17:38:03 ******/
DROP PROCEDURE IF EXISTS [dbo].[sp_ProcesarMovimientosStockDetalle]
GO
/****** Object:  StoredProcedure [dbo].[sp_ProcesarMovimientosStock]    Script Date: 5/5/2021 17:38:03 ******/
DROP PROCEDURE IF EXISTS [dbo].[sp_ProcesarMovimientosStock]
GO
/****** Object:  Table [dbo].[tp_TiposMovimientoStock]    Script Date: 5/5/2021 17:38:03 ******/
DROP TABLE IF EXISTS [dbo].[tp_TiposMovimientoStock]
GO
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


