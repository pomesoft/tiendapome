using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using NHibernate;
using NHibernate.Criterion;



namespace tiendapome.Repository
{
    public class CTDRepository : RepositoryGenerico<Requisito>
    {
        public CTDRepository() { }

        public List<Requisito> ObtenerRequisitos(bool soloVigentes)
        {
            ICriteria criteria = repositorio.NHSession.CreateCriteria(typeof(Requisito));

            criteria.Add(Expression.Eq("IdRoot", -1));

            if (soloVigentes)
                criteria.Add(Expression.Eq("Vigente", true));

            return criteria.List<Requisito>().ToList<Requisito>();
        }

        public List<Requisito> ObtenerRequisitos(bool soloVigentes, string codigo, string descripcion)
        {
            ICriteria criteria = repositorio.NHSession.CreateCriteria(typeof(Requisito));

            if (soloVigentes)
                criteria.Add(Expression.Eq("Vigente", true));

            if (codigo != null && codigo != string.Empty)
                criteria.Add(Expression.Like("Codigo", string.Format("%{0}%", codigo)));

            if (descripcion != null && descripcion != string.Empty)
                criteria.Add(Expression.Like("Descripcion", string.Format("%{0}%", descripcion)));

            return criteria.List<Requisito>().ToList<Requisito>();        
        }
    }
}
