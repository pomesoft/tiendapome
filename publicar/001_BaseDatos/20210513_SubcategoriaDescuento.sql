
/****** Object:  Table [dbo].[tp_SubcategoriaDescuento]    Script Date: 13/5/2021 01:22:33 ******/
SET ANSI_NULLS ON
GO

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


