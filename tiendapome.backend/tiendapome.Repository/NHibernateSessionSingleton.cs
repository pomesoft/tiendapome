using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using NHibernate;
using NHibernate.Cfg;
using NHibernate.Type;

using tiendapome.Entidades;

namespace tiendapome.Repository
{
    internal class NHibernateSessionSingleton
    {
        private static readonly string KEY = "NHSESSION";
        private static readonly object _sessionFactoryLock = new object();
        private static ISessionFactory _sessionFactory;
        private static ISession _session;

        public static string DataBase
        {
            get { return _session.Connection.Database; }
        }
        public static string DataSource
        {
            get
            {
                string conn = _session.Connection.ConnectionString;
                string source = conn.Substring(0, conn.IndexOf(";"));
                return source.Substring(source.IndexOf("=") + 1);
            }
        }

        public static ISession GetSession()
        {
            lock (_sessionFactoryLock)
            {
                if (_sessionFactory == null)
                    GetConfiguracion();

                if (_session != null && _session.IsOpen && !_session.IsConnected)
                    _session.Reconnect();

                if (_session == null || !_session.IsOpen)
                    _session = _sessionFactory.OpenSession();

                return _session;
            }
        }

        public static void CloseSession()
        {
            if (_session != null)
                _session.Close();
        }

        public static void Dispose()
        {
            if (_session != null)
                _session.Dispose();
        }

        protected static void GetConfiguracion()
        {
            Configuration cfg = new Configuration();

            //cfg.AddAssembly("tiendapome.Repository");
            cfg.AddAssembly(typeof(tiendapome.Repository.ProductoRepository).Assembly);


            _sessionFactory = cfg.BuildSessionFactory();
        }

    }
}
