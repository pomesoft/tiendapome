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
    public class VentaRepository : RepositoryGenerico<DocumentoVenta>
    {

        public VentaRepository() { }

        public DocumentoVentaList ListarVentas(int numeroPagina, int cantidadRegistros, DateTime? fechaDesde, DateTime? fechaHasta, int? idUsuario, int? idCliente, int? tipoListado)
        {
            ISession session = NHibernateSessionSingleton.GetSession();

            ICriteria criteriaTotalFilas = session.CreateCriteria(typeof(DocumentoVenta));

            if (fechaDesde.HasValue && fechaHasta.HasValue)
                criteriaTotalFilas.Add(Expression.Between("Fecha", fechaDesde.Value, fechaHasta.Value));

            if (idUsuario.HasValue && idUsuario.Value > 0)
                criteriaTotalFilas.Add(Expression.Eq("Usuario.Id", idUsuario));

            if (idCliente.HasValue && idCliente.Value > 0)
                criteriaTotalFilas.Add(Expression.Eq("Cliente.Id", idCliente));

            
            if (tipoListado.HasValue && tipoListado.Value == 3)
            {
                //Comprobantes Anulados
                criteriaTotalFilas.Add(Expression.Eq("Anulado", true));
            }
            else
            {
                //para el resto de los listados siempre se excluyen los anulados
                criteriaTotalFilas.Add(Expression.Eq("Anulado", false));
            }

            decimal valorPendiente = 0;

            if (tipoListado.HasValue)
            {
                switch (tipoListado.Value)
                {
                    case 1:
                        //Comprobantes Pendientes
                        criteriaTotalFilas.Add(Expression.Gt("Pendiente", valorPendiente));
                        break;

                    case 2:
                        //Listado de Cobranzas
                        criteriaTotalFilas.Add(Expression.Gt("TipoComprobante.Id", (int)TIPOS_COMPROBANTE.RECIBO_));
                        break;

                }
            }

            var total = criteriaTotalFilas.SetProjection(Projections.RowCount()).FutureValue<int>();


            ICriteria criteria = session.CreateCriteria(typeof(DocumentoVenta));
                        
            if (fechaDesde.HasValue && fechaHasta.HasValue)
                criteria.Add(Expression.Between("Fecha", fechaDesde.Value, fechaHasta.Value));

            if (idUsuario.HasValue && idUsuario.Value > 0)
                criteria.Add(Expression.Eq("Usuario.Id", idUsuario));

            if (idCliente.HasValue && idCliente.Value > 0)
                criteria.Add(Expression.Eq("Cliente.Id", idCliente));

            if (tipoListado.HasValue && tipoListado.Value == 3)
            {
                //Comprobantes Anulados
                criteria.Add(Expression.Eq("Anulado", true));
            }
            else
            {
                //para el resto de los listados siempre se excluyen los anulados
                criteria.Add(Expression.Eq("Anulado", false));
            }           

            if (tipoListado.HasValue)
            {
                switch (tipoListado.Value)
                {
                    case 1:
                        //Comprobantes Pendientes
                        criteria.Add(Expression.Gt("Pendiente", valorPendiente));
                        break;

                    case 2:
                        //Listado de Cobranzas
                        criteria.Add(Expression.Gt("TipoComprobante.Id", (int)TIPOS_COMPROBANTE.RECIBO_));
                        break;

                }
            }

            if (numeroPagina > -1 && cantidadRegistros > -1)
            {
                criteria.SetMaxResults(cantidadRegistros);
                criteria.SetFirstResult((numeroPagina - 1) * cantidadRegistros);
            }

            criteria.AddOrder(new Order("Fecha", true));

            DocumentoVentaList listReturn = new DocumentoVentaList();
            listReturn.TotalFilas = total.Value.ConvertirInt();
            listReturn.DocumentosVenta = criteria.List<DocumentoVenta>().ToList<DocumentoVenta>();
            return listReturn;
        }

        public int ObtenerProximoNumero(int idTipoComprobante)
        {
            ISession session = NHibernateSessionSingleton.GetSession();

            string sql = string.Format(@" select IsNull(Max(Numero), 0)+1 as Numero 
                                        from  tp_DocumentosVenta 
                                        where IdTipo = {0} ", idTipoComprobante.ToString()); ;

            IQuery query = session.CreateSQLQuery(sql);

            int numero = query.UniqueResult<int>();

            return numero;
        }

        public decimal ObtenerSaldoInicialCtaCte(int idCliente, DateTime fecha)
        {
            ISession session = NHibernateSessionSingleton.GetSession();

            string sql = @" select isnull(sum(case when tc.EsDebe = 1 then v.Total else v.Total *-1 end), 0) as SaldoInicial
                            from tp_DocumentosVenta v inner join tp_VentaTiposComprobante tc on v.IdTipo = tc.IdVentaTipoComprobante
                            where v.Anulado = 0	and v.IdCliente = :idCliente and v.Fecha < :fecha";

            IQuery query = session.CreateSQLQuery(sql);
            query.SetParameter("idCliente", idCliente);
            query.SetParameter("fecha", fecha);

            return query.UniqueResult<decimal>();
        }

        public IList<ListadoCtaCte> ObtenerResumenSaldosCtaCte()
        {
            ISession session = NHibernateSessionSingleton.GetSession();

            IQuery query = session.GetNamedQuery("getResumenCtaCte");

            return query.List<ListadoCtaCte>();
        }
    }
}
