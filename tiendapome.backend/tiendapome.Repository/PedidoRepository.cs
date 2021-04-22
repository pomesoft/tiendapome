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
    public class PedidoRepository : RepositoryGenerico<Pedido>
    {
        public PedidoRepository() { }

        public PedidoItem ObtenerItemPorProducto(int idPedido, int codigo)
        {
            PedidoItem item = null;

            ISession session = NHibernateSessionSingleton.GetSession();

            string sql = @" SELECT * FROM tp_pedidoitems 
                            WHERE   IdPedido = :idPedido 
                                AND IdProducto in (SELECT IdProducto FROM tp_productos WHERE Codigo = :codigo)";
                        
            IQuery query = session.CreateSQLQuery(sql).AddEntity(typeof(PedidoItem));
            query.SetParameter("idPedido", idPedido);
            query.SetParameter("codigo", codigo);
            
            List<PedidoItem> listItems = query.List<PedidoItem>().ToList<PedidoItem>();
            if (listItems.Count > 0) item = listItems[0];

            return item;
        }

        public Pedido ObtenerPedidoClienteIngresado(int idCliente)
        {
            Pedido item = null;

            ISession session = NHibernateSessionSingleton.GetSession();
            
            string sql = @" SELECT * FROM tp_pedidos 
                            WHERE IdCliente = :idCliente AND IdEstado = 1 
                            ORDER BY IdPedido DESC;";

            IQuery query = session.CreateSQLQuery(sql).AddEntity(typeof(Pedido));
            query.SetParameter("idCliente", idCliente);

            List<Pedido> listItems = query.List<Pedido>().ToList<Pedido>();
            if (listItems.Count > 0) item = listItems[0];

            return item;
        }

        public PedidoList ObtenerPedidos(List<Estado> estados, int idCliente, DateTime? fechaDesde, DateTime? fechaHasta, int numeroPagina, int cantidadRegistros, bool ordenarAscendente)
        {
            ISession session = NHibernateSessionSingleton.GetSession();


            ICriteria criteriaTotalFilas = session.CreateCriteria(typeof(Pedido));

            criteriaTotalFilas.Add(Expression.Gt("CantidadItems", 0));

            if (estados.Count > 0)
                criteriaTotalFilas.Add(Expression.In("Estado", estados));

            if (idCliente > -1)
                criteriaTotalFilas.Add(Expression.Eq("Cliente.Id", idCliente));

            if (fechaDesde.HasValue && fechaHasta.HasValue)
                criteriaTotalFilas.Add(Expression.Between("Fecha", fechaDesde, fechaHasta.Value.AddDays(1)));
            else
            {
                if (fechaDesde.HasValue)
                    criteriaTotalFilas.Add(Expression.Between("Fecha", fechaDesde, DateTime.Now.AddDays(1)));
                if (fechaHasta.HasValue)
                    criteriaTotalFilas.Add(Expression.Between("Fecha", DateTime.MinValue, fechaHasta.Value.AddDays(1)));
            }


            var total = criteriaTotalFilas.SetProjection(Projections.RowCount()).FutureValue<Int32>();
            
            ICriteria criteria = session.CreateCriteria(typeof(Pedido));

            criteria.Add(Expression.Gt("CantidadItems", 0));

            if (estados.Count > 0)
                criteria.Add(Expression.In("Estado", estados));

            if (idCliente > -1)
                criteria.Add(Expression.Eq("Cliente.Id", idCliente));

            if (fechaDesde.HasValue && fechaHasta.HasValue)
                criteria.Add(Expression.Between("Fecha", fechaDesde, fechaHasta.Value.AddDays(1)));
            else
            {
                if (fechaDesde.HasValue)
                    criteria.Add(Expression.Between("Fecha", fechaDesde, DateTime.Now.AddDays(1)));
                if (fechaHasta.HasValue)
                    criteria.Add(Expression.Between("Fecha", DateTime.MinValue, fechaHasta.Value.AddDays(1)));
            }

            if (numeroPagina > -1 && cantidadRegistros > -1)
            {
                criteria.SetMaxResults(cantidadRegistros);
                criteria.SetFirstResult((numeroPagina - 1) * cantidadRegistros);
            }

            criteria.AddOrder(new Order("Numero", ordenarAscendente));

            PedidoList listReturn = new PedidoList();
            listReturn.TotalFilas = total.Value;
            listReturn.Pedidos = criteria.List<Pedido>().ToList<Pedido>();
            return listReturn;
        }

        public Pedido ObtenerUltimoPedido()
        {
            ISession session = NHibernateSessionSingleton.GetSession();

            string sql = @" SELECT * 
                            FROM tp_pedidos
                            WHERE Numero IN (SELECT Max(Numero) as Numero FROM tp_pedidos)
                            ORDER BY IdPedido DESC ";

            IQuery query = session.CreateSQLQuery(sql).AddEntity(typeof(Pedido));

            List<Pedido> list = query.List<Pedido>().ToList<Pedido>();
            Pedido prodReturn = null;
            if (list != null && list.Count > 0)
                prodReturn = list[0];

            return prodReturn;
        }

        public List<PedidoItem> PedidoVerificarStock(int idPedido)
        {
            string sql = @" update pip
                            set pip.StockDisponible = case  when    pip.Cantidad = 0                        then null
			                                                when    pip.Cantidad > 0
                                                                and (b.Stock - b.Reservado) <= 0			then 0
			                                                when (b.Stock - b.Reservado) >= pip.Cantidad	then pip.Cantidad  
			                                                when	(b.Stock - b.Reservado) > 0 
				                                                and (b.Stock - b.Reservado) < pip.Cantidad	then pip.Cantidad - (pip.Cantidad - (b.Stock - b.Reservado))
		                                                end 
                            from tp_PedidoItemProducto		pip	
	                            inner join tp_PedidoItems	a	on pip.IdPedidoItem = a.IdPedidoItem 
                                inner join tp_ProductoStock	b	on pip.IdProductoStock = b.IdProductoStock
                            where IdPedido = " + idPedido + "; ";

            this.ActualizarSQL(sql);

            ISession session = NHibernateSessionSingleton.GetSession();
                        
            sql = @" select	* from tp_PedidoItems where IdPedido = :idPedido; ";

            IQuery query1 = session.CreateSQLQuery(sql).AddEntity(typeof(PedidoItem));
            query1.SetParameter("idPedido", idPedido);
            List<PedidoItem> listItems = query1.List<PedidoItem>().ToList<PedidoItem>();

            return listItems;
        }

        public void PedidoReservarStock(int idPedido)
        {
            string sql = @" update pip 
                            set pip.StockReservado = case when pip.Cantidad > pip.StockDisponible 
                                                            then pip.StockDisponible 
                                                            else pip.Cantidad 
                                                     end 
                            from tp_PedidoItemProducto	pip 
	                            inner join tp_PedidoItems			pit	on pip.IdPedidoItem = pit.IdPedidoItem
                            where pit.IdPedido = " + idPedido + "; ";
            this.ActualizarSQL(sql);

            sql =  @" update ps set ps.Reservado = ps.Reservado + pip.StockReservado
                    from tp_ProductoStock ps
	                    inner join tp_PedidoItemProducto	pip on ps.IdProductoStock = pip.IdProductoStock
	                    inner join tp_PedidoItems			pit	on pip.IdPedidoItem = pit.IdPedidoItem
                    where pit.IdPedido = " + idPedido + "; ";
            this.ActualizarSQL(sql);
        }

        public void PedidoLiberarStock(int idPedido)
        {

            string sql = @" update ps set ps.Reservado = ps.Reservado - pip.StockReservado
                    from tp_ProductoStock ps
	                    inner join tp_PedidoItemProducto	pip on ps.IdProductoStock = pip.IdProductoStock
	                    inner join tp_PedidoItems			pit	on pip.IdPedidoItem = pit.IdPedidoItem
                    where pit.IdPedido = " + idPedido + "; ";
            this.ActualizarSQL(sql);

            sql = @" update pip set pip.StockReservado = 0
                            from tp_PedidoItemProducto	pip 
	                            inner join tp_PedidoItems			pit	on pip.IdPedidoItem = pit.IdPedidoItem
                            where pit.IdPedido = " + idPedido + "; ";
            this.ActualizarSQL(sql);            
        }

        public void PedidoDescontarStock(int idPedido)
        {
            string sql = @" update ps 
                            set ps.Stock = ps.Stock - pip.Cantidad,
	                            ps.Reservado = ps.Reservado - pip.StockReservado
                            from tp_ProductoStock ps
	                            inner join tp_PedidoItemProducto	pip on ps.IdProductoStock = pip.IdProductoStock
	                            inner join tp_PedidoItems			pit	on pip.IdPedidoItem = pit.IdPedidoItem
                            where pit.IdPedido = " + idPedido + "; ";
            this.ActualizarSQL(sql);

            sql = @" update pip 
                    set pip.StockReservado = 0
                    from tp_PedidoItemProducto	pip 
	                    inner join tp_PedidoItems			pit	on pip.IdPedidoItem = pit.IdPedidoItem
                    where pit.IdPedido = " + idPedido + "; ";
            this.ActualizarSQL(sql);
        }

    }
}
