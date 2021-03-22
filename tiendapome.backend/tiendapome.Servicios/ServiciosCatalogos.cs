using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

using Newtonsoft.Json;

using tiendapome.Entidades;
using tiendapome.Repository;
using tiendapome.Servicios.Cache;

namespace tiendapome.Servicios
{
    public class ServiciosCatalogos : AbstractService
    {
        const string gobalKeyCache = "TiendaPome";

        public ServiciosCatalogos() { }
        
        #region ABM Medidas
        public void MedidaGrabar(Medida dato)
        {
            RepositoryGenerico<Medida> repository = new RepositoryGenerico<Medida>();
            dato.Validar();
            if (dato.Id == -1)
            {
                if (repository.Obtener("Descripcion", dato.Descripcion) != null)
                    throw new ApplicationException("Ya existe");
                dato.Vigente = true;
            }            
            repository.Actualizar(dato);
        }
        public void MedidaEliminar(int id)
        {
            RepositoryGenerico<Medida> repository = new RepositoryGenerico<Medida>();
            Medida dato = repository.Obtener(id);
            if (dato == null)
                throw new ApplicationException("No existe");
            dato.Vigente = false;
            repository.Actualizar(dato);
        }
        #endregion


        #region ABM ProductoGrupoOrden
        public ProductoGrupoOrden ProductoGrupoOrdenGrabar(ProductoGrupoOrden dato)
        {
            RepositoryGenerico<ProductoGrupoOrden> repository = new RepositoryGenerico<ProductoGrupoOrden>();
            dato.Validar();
            if (dato.Id == -1)
            {
                if (repository.Obtener("Descripcion", dato.Descripcion) != null)
                    throw new ApplicationException("Ya existe");
                dato.Vigente = true;
            }
            repository.Actualizar(dato);
            return dato;
        }
        public void ProductoGrupoOrdenEliminar(int id)
        {
            RepositoryGenerico<ProductoGrupoOrden> repository = new RepositoryGenerico<ProductoGrupoOrden>();
            ProductoGrupoOrden dato = repository.Obtener(id);
            if (dato == null)
                throw new ApplicationException("No existe");
            dato.Vigente = false;
            repository.Actualizar(dato);
        }
        #endregion
    }
}
