using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using NHibernate;
using NHibernate.Criterion;

namespace tiendapome.Repository
{
    public class RepositoryGenerico<T>
    {
        internal NHibernateRepository<T> repositorio = new NHibernateRepository<T>();

        public string BaseDatos
        {
            get { return NHibernateSessionSingleton.DataBase; }
        }

        public string ServidorBaseDatos
        {
            get { return NHibernateSessionSingleton.DataSource; }
        }

        public RepositoryGenerico()
        { }

        public void Sincronizar()
        {
            repositorio.Sincronizar();
        }
        public void Actualizar(T valor)
        {
            repositorio.Actualizar(valor);
        }
        public void ActualizarSQL(string sqlUpdate)
        {
            repositorio.ActualizarSQL(sqlUpdate);
        }
        public void Eliminar(T valor)
        {
            repositorio.Eliminar(valor);
        }
        public T Obtener(object id)
        {
            return repositorio.Obtener(id);
        }
        public T Obtener(string nombreCampo, object valorBuscado)
        {
            ICriterion expresion = Expression.Eq(nombreCampo, valorBuscado);
            return repositorio.Obtener(expresion);
        }
        public T Obtener(string nombreCampo1, object valorBuscado1, string nombreCampo2, object valorBuscado2)
        {
            ICriterion expresion = Expression.And(Expression.Eq(nombreCampo1, valorBuscado1),
                                                  Expression.Eq(nombreCampo2, valorBuscado2));
            return repositorio.Obtener(expresion);
        }
        public IList<T> ObtenerTodos()
        {
            return repositorio.ObtenerTodos().ToList<T>();
        }
        public IList<T> ObtenerTodos(string nombreCampo, object valorBuscado)
        {
            ICriterion expresion = Expression.Eq(nombreCampo, valorBuscado);
            return repositorio.ObtenerTodos(expresion).ToList<T>();
        }
        public IList<T> ObtenerTodos(string nombreCampo1, object valorBuscado1, string nombreCampo2, object valorBuscado2)
        {
            ICriterion expresion = Expression.And(Expression.Eq(nombreCampo1, valorBuscado1),
                                                  Expression.Eq(nombreCampo2, valorBuscado2));
            return repositorio.ObtenerTodos(expresion).ToList<T>();
        }
        public IList<T> ObtenerTodosVigentes()
        {
            ICriterion expresion = Expression.Eq("Vigente", true);
            return repositorio.ObtenerTodos(expresion).ToList<T>();
        }
        public IList<T> ObtenerTodosVigentes(string nombreCampo, object valorBuscado)
        {
            ICriterion expresion = Expression.And(Expression.Eq("Vigente", true),
                                                  Expression.Eq(nombreCampo, valorBuscado));
            return repositorio.ObtenerTodos(expresion).ToList<T>();
        }
        public IList<T> ObtenerTodosVigentes(string descripcion)
        {
            ICriterion expresion;
            if (descripcion != null && descripcion.Trim().Length > 0)
                expresion = Expression.And(Expression.Eq("Vigente", true),
                                        Expression.Like("Descripcion", string.Format("%{0}%", descripcion)));
            else
                expresion = Expression.Eq("Vigente", true);

            return repositorio.ObtenerTodos(expresion).ToList<T>();
        }
        public void EliminarRegistros(string nombreTabla, string condicion)
        {
            string sql = "DELETE FROM " + nombreTabla;

            if (condicion.Trim().Length > 0)
                sql += " WHERE " + condicion;

            this.ActualizarSQL(sql);
        }
    }
}
