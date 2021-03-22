

BEGIN TRANSACTION
GO
ALTER TABLE dbo.tp_Tipos ADD
	Orden int NULL
GO
ALTER TABLE dbo.tp_Tipos SET (LOCK_ESCALATION = TABLE)
GO
COMMIT

BEGIN TRANSACTION
GO
ALTER TABLE dbo.tp_Categorias ADD
	Orden int NULL
GO
ALTER TABLE dbo.tp_Categorias SET (LOCK_ESCALATION = TABLE)
GO
COMMIT


SELECT ROW_NUMBER() OVER (ORDER BY Descripcion ASC) AS Orden FROM tp_Tipos

UPDATE T SET T.Orden = Orden.Orden FROM tp_Tipos AS T INNER JOIN (SELECT ROW_NUMBER() OVER (ORDER BY Descripcion ASC) AS Orden, IdTipo, Descripcion FROM tp_Tipos) AS Orden on T.IdTipo = Orden.IdTipo

UPDATE T SET T.Orden = Orden.Orden FROM tp_Categorias AS T INNER JOIN (SELECT ROW_NUMBER() OVER (ORDER BY Descripcion ASC) AS Orden, IdCategoria, Descripcion FROM tp_Categorias) AS Orden ON t.IdCategoria = Orden.IdCategoria

--UPDATE tp_Categorias SET Orden = 9 WHERE IdCategoria = 106




