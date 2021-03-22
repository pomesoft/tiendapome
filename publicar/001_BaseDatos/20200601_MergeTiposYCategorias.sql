

/****** Object:  Table [dbo].[tp_SubcategoriasMerge]    Script Date: 01/06/2020 05:34:00 p.m. ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[tp_SubcategoriasMerge](
	[IdSubcategoriaMerge] [int] IDENTITY(1,1) NOT NULL,
	[IdSubcategoriaMinorista] [int] NULL,
	[IdSubcategoriaMayorista] [int] NULL,
 CONSTRAINT [PK_SubcategoriasMerge] PRIMARY KEY CLUSTERED 
(
	[IdSubcategoriaMerge] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO



/* revisar id antes de ejecutar - estos id's son de joyeriapallitto */
--SET IDENTITY_INSERT [dbo].[tp_SubcategoriasMerge] ON 
--GO
--INSERT [dbo].[tp_SubcategoriasMerge] ([IdSubcategoriaMerge], [IdSubcategoriaMinorista], [IdSubcategoriaMayorista]) VALUES (1, 157, 38)
--GO
--INSERT [dbo].[tp_SubcategoriasMerge] ([IdSubcategoriaMerge], [IdSubcategoriaMinorista], [IdSubcategoriaMayorista]) VALUES (2, 154, 39)
--GO
--SET IDENTITY_INSERT [dbo].[tp_SubcategoriasMerge] OFF
--GO



BEGIN TRANSACTION
GO
ALTER TABLE dbo.tp_TiposPortada ADD
	Visible bit NULL
GO
ALTER TABLE dbo.tp_TiposPortada SET (LOCK_ESCALATION = TABLE)
GO
COMMIT


update [dbo].tp_TiposPortada set Visible = 1