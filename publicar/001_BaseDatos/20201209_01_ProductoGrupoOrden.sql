
use trading
go




/****** Object:  Table [dbo].[tp_ProductoGrupoOrden]    Script Date: 09/12/2020 11:18:57 a.m. ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[tp_ProductoGrupoOrden](
	[IdProductoGrupoOrden] [int] IDENTITY(1,1) NOT NULL,
	[Descripcion] [nvarchar](50) NOT NULL,
	[Vigente] [bit] NOT NULL,
 CONSTRAINT [PK_tp_ProductoGrupoOrden] PRIMARY KEY CLUSTERED 
(
	[IdProductoGrupoOrden] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO



BEGIN TRANSACTION
GO
ALTER TABLE dbo.tp_Productos ADD
	IdGrupoOrden int NULL
GO
ALTER TABLE dbo.tp_Productos SET (LOCK_ESCALATION = TABLE)
GO
COMMIT


truncate table [dbo].[tp_ProductoGrupoOrden]
insert into [dbo].[tp_ProductoGrupoOrden] (Descripcion, Vigente ) values ('  ', 1)
declare @idGpo int 
select top 1 @idGpo = IdProductoGrupoOrden from [dbo].[tp_ProductoGrupoOrden] where Descripcion = '  '
update tp_Productos set IdGrupoOrden = @idGpo


update tp_Categorias set Visible = 1
update tp_Subcategorias set Visible = 1
