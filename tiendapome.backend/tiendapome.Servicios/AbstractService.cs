using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using tiendapome.Entidades;
using tiendapome.Repository;


namespace tiendapome.Servicios
{
    public abstract class AbstractService
    {
        
        public AbstractService() { }

        public void Sincronizar()
        {
            RepositoryGenerico<EntidadBase> repository = new RepositoryGenerico<EntidadBase>();
            repository.Sincronizar();
        }

        public T ObtenerObjeto<T>(object id) where T : EntidadBase
        {
            RepositoryGenerico<T> repository = new RepositoryGenerico<T>();
            if (id == null) return null;
            return repository.Obtener(id);
        }
        public T ObtenerObjeto<T>(string nombreCampo, object valorBuscado) where T : EntidadBase
        {
            RepositoryGenerico<T> repository = new RepositoryGenerico<T>();
            return repository.Obtener(nombreCampo, valorBuscado);
        }
        public List<T> Listar<T>() where T : EntidadBase
        {
            RepositoryGenerico<T> repository = new RepositoryGenerico<T>();
            return repository.ObtenerTodos().ToList<T>();
        }
        public List<T> ListarVigentes<T>() where T : EntidadBase
        {
            RepositoryGenerico<T> repository = new RepositoryGenerico<T>();
            return repository.ObtenerTodosVigentes().ToList<T>();
        }
        public IList<T> Listar<T>(string nombreCampo, object valorBuscado) where T : EntidadBase
        {
            RepositoryGenerico<T> repository = new RepositoryGenerico<T>();
            return repository.ObtenerTodos(nombreCampo, valorBuscado);
        }
    }
}
