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
    public class ProductoRepository : RepositoryGenerico<Producto>
    {
        public ProductoRepository() { }

        public Producto ObtenerUltimoProducto()
        {
            ISession session = NHibernateSessionSingleton.GetSession();

            string sql = @" SELECT * 
                            FROM tp_productos
                            WHERE Codigo IN (SELECT Max(Codigo) as Codigo FROM tp_productos WHERE StockPropio=1)
                            ORDER BY IdProducto DESC ";

            IQuery query = session.CreateSQLQuery(sql).AddEntity(typeof(Producto));

            List<Producto> list = query.List<Producto>().ToList<Producto>();
            Producto prodReturn = null;
            if (list != null && list.Count > 0)
                prodReturn = list[0];

            return prodReturn;
        }

        public List<Producto> ObtenerProductos(int idSubcategoria)
        {
            ISession session = NHibernateSessionSingleton.GetSession();
            ICriteria criteria = session.CreateCriteria(typeof(Producto));

            criteria.Add(Expression.Eq("Vigente", true));

            if (idSubcategoria != -1)
                criteria.Add(Expression.Eq("Subcategoria.Id", idSubcategoria));

            criteria.AddOrder(new Order("Codigo", true));

            return criteria.List<Producto>().ToList<Producto>();
        }

        public List<Producto> BuscarProductos(string buscar, bool conStock, bool paginar, int numeroPagina, int cantidadRegistros)
        {
            ISession session = NHibernateSessionSingleton.GetSession();

            string sql = @" SELECT TOP 100 ROW_NUMBER() OVER (ORDER BY P.IdProducto ASC) AS NroFila, p.* 
                            INTO #tempData 
                            FROM tp_productos p 
	                            inner join tp_subcategorias s on p.IdSubcategoria = s.IdSubcategoria
	                            inner join tp_categorias c on s.IdCategoria = c.IdCategoria
	                            inner join tp_tipos t on c.IdTipo = t.IdTipo
	                            inner join tp_listasprecio l on p.IdListaPrecio = l.idListaPrecio ";

            if (conStock)
                sql += " inner join (SELECT IdProducto, SUM(Stock) as StockReal, SUM(Reservado) as Reservado FROM tp_ProductoStock GROUP BY IdProducto) ps on p.IdProducto = ps.IdProducto ";

            if (buscar.Trim().Length > 0)
            {
                buscar = string.Format("%{0}%", buscar);
                sql += @" WHERE    ((convert(varchar,p.Codigo) LIKE :buscar) 
			                    OR (p.Descripcion LIKE :buscar) 
			                    OR (s.Descripcion LIKE :buscar) 
			                    OR (c.Descripcion LIKE :buscar) 
			                    OR (t.Descripcion LIKE :buscar) 
			                    OR (l.Codigo LIKE :buscar)) ";
            }

            if (conStock)
                sql += " AND ((ps.StockReal - ps.Reservado) > 0) ";

            if (paginar)
            {
                sql += @"   SELECT * 
	                        FROM #tempData
	                        WHERE (NroFila > ((:cantidadRegistros * :numeroPagina) - :cantidadRegistros))
			                  AND (NroFila <= (:cantidadRegistros * :numeroPagina))
                    DROP TABLE #tempData";
            }
            else
            {
                sql += @"   SELECT * FROM #tempData ORDER BY Codigo 
                            DROP TABLE #tempData";
            }

            IQuery query = session.CreateSQLQuery(sql).AddEntity(typeof(Producto));

            if (buscar.Trim().Length > 0) query.SetParameter("buscar", buscar);

            if (paginar)
            {
                query.SetParameter("numeroPagina", numeroPagina);
                query.SetParameter("cantidadRegistros", cantidadRegistros);
            }

            return query.List<Producto>().ToList<Producto>();
        }

        public Producto ObtenerProductoMayorista(int codigo)
        {
            ISession session = NHibernateSessionSingleton.GetSession();

            string sql = @" SELECT * 
                            FROM tp_productos
                            WHERE StockPropio = 0 AND Codigo = :codigo
                            ORDER BY IdProducto DESC ";

            IQuery query = session.CreateSQLQuery(sql).AddEntity(typeof(Producto));
            query.SetParameter("codigo", codigo);

            List<Producto> list = query.List<Producto>().ToList<Producto>();
            Producto prodReturn = null;
            if (list != null && list.Count > 0)
                prodReturn = list[0];

            return prodReturn;
        }

        public List<ProductoStock> ObtenerProductoStockMayorista(int codigo)
        {
            ISession session = NHibernateSessionSingleton.GetSession();

            string sql = @" SELECT * 
                            FROM tp_productostock 
                            WHERE IdProducto IN (SELECT IdProducto FROM tp_Productos WHERE Codigo = :codigo)
                            ORDER BY IdProducto DESC ";

            IQuery query = session.CreateSQLQuery(sql).AddEntity(typeof(ProductoStock));
            query.SetParameter("codigo", codigo);

            List<ProductoStock> list = query.List<ProductoStock>().ToList<ProductoStock>();
            
            return list;
        }

        public void ProductoEliminarMovimientosStock(int idProducto)
        {
            string sql = @" delete from tp_ProductoStockMovimientos 
                            where IdProductoStock in (select IdProductoStock from tp_ProductoStock where IdProducto = " + idProducto + "); ";
            this.ActualizarSQL(sql);
        }


        public List<MovimientoStockDetalle> MovimientoStockDetalleObtener(int idProductoStock)
        {
            ISession session = NHibernateSessionSingleton.GetSession();

            IQuery query = session.GetNamedQuery("MovimientoStockDetalle")
                                .SetParameter("idProductoStock", idProductoStock);

            return query.List<MovimientoStockDetalle>().ToList();
        }

    }
}

