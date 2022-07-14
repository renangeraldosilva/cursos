USE [Cursos]
GO

SELECT [LogId]
      ,[log].[CursoId]
	   ,[curso].[Descricao]
      ,[Usuario]
      ,[DataInclusao]
      ,[DataAtualizacao]
  FROM [dbo].[log]
  inner join curso on log.CursoId = curso.CursoId

GO


