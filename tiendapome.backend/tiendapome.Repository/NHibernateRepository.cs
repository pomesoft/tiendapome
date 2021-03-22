using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using NHibernate;
using NHibernate.Cfg;
using NHibernate.Criterion;
using NHibernate.Type;

namespace tiendapome.Repository
{
    internal class NHibernateRepository<T>
    {
        private ISession session;

        public ISession NHSession
        {
            get { return session = NHibernateSessionSingleton.GetSession(); }
        }

        public NHibernateRepository()
        {
        }

        public void Reasociar(T value)
        {
            session.Lock(value, LockMode.None);
        }

        public void Actualizar(T value)
        {
            session = NHibernateSessionSingleton.GetSession();
            
            using (ITransaction tx = session.BeginTransaction())
            {
                try
                {

                    session.SaveOrUpdate(value);
                    //session.Flush();
                    tx.Commit();
                }
                catch
                {
                    if (tx != null) tx.Rollback();
                    throw;
                }
                finally
                {
                    NHibernateSessionSingleton.CloseSession();
                }
            }
        }

        public void Sincronizar()
        {
            ITransaction tx = null;
            try
            {
                session = NHibernateSessionSingleton.GetSession();
                session.Flush();
            }
            catch
            {
                throw;
            }
            finally
            {
                NHibernateSessionSingleton.CloseSession();
            }
        }

        public void ActualizarSQL(string sqlUpdate)
        {
            ITransaction tx = null;
            try
            {
                session = NHibernateSessionSingleton.GetSession();
                tx = session.BeginTransaction();
                int updatedEntities = session.CreateSQLQuery(sqlUpdate).ExecuteUpdate();
                //session.Flush();
                tx.Commit();
            }
            catch
            {
                if (tx != null) tx.Rollback();
                throw;
            }
            finally
            {
                NHibernateSessionSingleton.CloseSession();
            }
        }

        public void Eliminar(T value)
        {
            ITransaction tx = null;
            try
            {
                session = NHibernateSessionSingleton.GetSession();
                tx = session.BeginTransaction();
                session.Delete(value);
                //session.Flush();
                tx.Commit();
            }
            catch
            {
                if (tx != null) tx.Rollback();
                throw;
            }
            finally
            {
                NHibernateSessionSingleton.CloseSession();
            }
        }
        public T Obtener(object id)
        {
            session = NHibernateSessionSingleton.GetSession();
            T returnVal = session.Get<T>(id);
            return returnVal;
        }
        public T Obtener(ICriterion expresion)
        {
            session = NHibernateSessionSingleton.GetSession();
            ICriteria criteria = session.CreateCriteria(typeof(T)).
                Add(expresion);
            return criteria.UniqueResult<T>();
        }
        public IList<T> ObtenerTodos()
        {
            session = NHibernateSessionSingleton.GetSession();
            try
            {
                ICriteria criteria = session.CreateCriteria(typeof(T));
                return criteria.List<T>();
            }
            catch
            {
                //session.Flush();
                throw;
            }
        }
        public IList<T> ObtenerTodos(ICriterion expresion)
        {
            session = NHibernateSessionSingleton.GetSession();
            try
            {
                ICriteria criteria = session.CreateCriteria(typeof(T)).Add(expresion);
                return criteria.List<T>();
            }
            catch
            {
                throw;
            }
        }
    }
}
