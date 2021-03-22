using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using NHibernate;
using NHibernate.Criterion;

using tiendapome.Entidades;

namespace tiendapome.Repository
{
    public class ClienteRepository : RepositoryGenerico<Cliente>
    {
        public ClienteRepository() { }

        public List<Cliente> BuscarClientes(string buscar)
        {
            ISession session = NHibernateSessionSingleton.GetSession();

            string sql = @" SELECT c.* 
                            FROM tp_clientes c";

            if (buscar.Trim().Length > 0)
            {
                buscar = string.Format("%{0}%", buscar);
                sql += @" WHERE     (STR(RTRIM(LTRIM(c.IdCliente))) LIKE :buscar)  
                                OR  (c.Email LIKE :buscar)
		                        OR	(c.Nombre LIKE :buscar)
		                        OR	(c.Apellido LIKE :buscar)
		                        OR	(c.IdentificacionTributaria LIKE :buscar)
		                        OR	(c.RazonSocial LIKE :buscar)
		                        OR	(c.NombreFantasia LIKE :buscar) ";
            }

    
            IQuery query = session.CreateSQLQuery(sql).AddEntity(typeof(Cliente));

            if (buscar.Trim().Length > 0) query.SetParameter("buscar", buscar);

            return query.List<Cliente>().ToList<Cliente>();
        }
    }
}
