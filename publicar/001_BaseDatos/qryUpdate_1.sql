/****** Object:  Table [dbo].[tp_TiposPortada]    Script Date: 04/05/2020 05:23:55 p.m. ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[tp_TiposPortada]') AND type in (N'U'))
DROP TABLE [dbo].[tp_TiposPortada]
GO
/****** Object:  Table [dbo].[tp_TiposPortada]    Script Date: 04/05/2020 05:23:55 p.m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[tp_TiposPortada]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[tp_TiposPortada](
	[IdTipoPortada] [int] IDENTITY(1,1) NOT NULL,
	[IdTipo] [int] NOT NULL,
	[Descripcion] [nvarchar](250) NOT NULL,
	[Foto] [nvarchar](100) NOT NULL,
 CONSTRAINT [PK_tp_TiposPortada] PRIMARY KEY CLUSTERED 
(
	[IdTipoPortada] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
END
GO
SET IDENTITY_INSERT [dbo].[tp_TiposPortada] ON 

GO
INSERT [dbo].[tp_TiposPortada] ([IdTipoPortada], [IdTipo], [Descripcion], [Foto]) VALUES (2, 1, N'Joyas de Plata', N'TipoPlata.jpg')
GO
INSERT [dbo].[tp_TiposPortada] ([IdTipoPortada], [IdTipo], [Descripcion], [Foto]) VALUES (4, 2, N'Relojes', N'TipoRelojes.jpg')
GO
INSERT [dbo].[tp_TiposPortada] ([IdTipoPortada], [IdTipo], [Descripcion], [Foto]) VALUES (5, 3, N'Cristales Swarovski', N'TipoSwarovski.jpg')
GO
SET IDENTITY_INSERT [dbo].[tp_TiposPortada] OFF
GO




/**********************************************************************/

BEGIN TRANSACTION
GO
ALTER TABLE dbo.tp_Subcategorias ADD
	CantidadProductos int NULL
GO
ALTER TABLE dbo.tp_Subcategorias SET (LOCK_ESCALATION = TABLE)
GO
COMMIT



update a set a.CantidadProductos = isnull(b.CantidadProductos,0)
from tp_Subcategorias as a
left join (
		select s.IdSubcategoria, count(*) as CantidadProductos
		from tp_Subcategorias s
			inner join tp_Productos p on s.IdSubcategoria = p.IdSubcategoria
		group by s.IdSubcategoria
		) as b on a.IdSubcategoria = b.IdSubcategoria

