using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using tiendapome.Entidades;
using tiendapome.Repository;
using tiendapome.Servicios.Cache;

namespace tiendapome.Servicios
{
    public class ServicioClientes : AbstractService
    {
        const string gobalKeyCache = "TiendaPome";

        public ServicioClientes() { }

        public Cliente ClienteObtener(int id)
        {
            Cliente cliente = this.ObtenerObjeto<Cliente>(id);
            cliente.ListasPrecio = this.Listar<ClienteLista>("IdCliente", id).ToList<ClienteLista>();
            return cliente;
        }

        public List<Cliente> ClienteBusqueda(string buscar, bool listarSinListasAsignada)
        {
            ClienteRepository repository = new ClienteRepository();
            List<Cliente> listReturn = new List<Cliente>();
            List<Cliente> listClientes = repository.BuscarClientes(buscar);
            if (listarSinListasAsignada)
                listReturn = listClientes.Where(item => !item.ListasPrecioAsignada).ToList<Cliente>();
            else
                listReturn = listClientes;

            return listReturn.OrderBy(item => item.Email).ToList<Cliente>();
        }

        public Cliente ClienteLogIn(string usuario, string clave)
        {
            //FALTA ENCRIPTAR LOS DOS PARAMETROS
            Cliente cliente = this.ObtenerObjeto<Cliente>("Email", usuario);            
            if (cliente == null)
                throw new ApplicationException("Usuario o contraseña incorrecto.");
            else
                if(!cliente.Clave.Equals(clave))
                    throw new ApplicationException("Usuario o contraseña incorrecto.");

            Parametro paramsValidarSesionUnica = this.ObtenerObjeto<Parametro>("Clave", "VALIDAR_SESION_UNICA");
            if (paramsValidarSesionUnica != null && paramsValidarSesionUnica.Valor == "SI")
            {
                List<Sesion> sesiones = this.Listar<Sesion>("IdCliente", cliente.Id).ToList<Sesion>();
                if (sesiones != null && sesiones.Count > 0)
                    throw new ApplicationException("El Usuario ya ingresó al sistema, debe salir para volver a ingresar.");
                
                Sesion sesion = new Sesion();
                sesion.IdCliente = cliente.Id;

                RepositoryGenerico<Sesion> sesionRepository = new RepositoryGenerico<Sesion>();
                sesionRepository.Actualizar(sesion);
            }

            return this.ClienteObtener(cliente.Id); 
        }
        public void ClienteLogOut(int idUsuario)
        {
            Parametro paramsValidarSesionUnica = this.ObtenerObjeto<Parametro>("Clave", "VALIDAR_SESION_UNICA");
            if (paramsValidarSesionUnica != null && paramsValidarSesionUnica.Valor == "SI")
            {

                Cliente cliente = this.ObtenerObjeto<Cliente>(idUsuario);
                if (cliente == null)
                    throw new ApplicationException("Usuario incorrecto.");

                RepositoryGenerico<Sesion> sesionRepository = new RepositoryGenerico<Sesion>();
                Sesion sesion = sesionRepository.Obtener("IdCliente", cliente.Id);
                sesionRepository.Eliminar(sesion);
            }
        }

        public Cliente ClienteGrabar(Cliente datoGraba)
        {
            RepositoryGenerico<Cliente> repository = new RepositoryGenerico<Cliente>();
            Cliente dato;

            if (datoGraba.Id == -1)
                dato = new Cliente();
            else
            {
                dato = repository.Obtener(datoGraba.Id);
                if (dato == null)
                    throw new ApplicationException("No existe el Cliente");
            }

            if (datoGraba.Rol == null || datoGraba.Rol.Id < 0)
                throw new ApplicationException("Debe indicar Rol del cliente");

            Cliente validar = null;
            validar = repository.Obtener("Email", datoGraba.Email);
            if (validar != null && validar.Id != datoGraba.Id)
                throw new ApplicationException("Ya existe un cliente con el Email ingresado");

            dato.Email = datoGraba.Email;
            dato.Rol = this.ObtenerObjeto<Rol>(datoGraba.Rol.Id);
            dato.Clave = (datoGraba.Clave == null ? "123" : datoGraba.Clave);
            dato.Apellido = datoGraba.Apellido;
            dato.Nombre = datoGraba.Nombre;
            dato.Celular = datoGraba.Celular;
            dato.IdentificacionTributaria = datoGraba.IdentificacionTributaria;
            dato.RazonSocial = datoGraba.RazonSocial;
            dato.NombreFantasia = datoGraba.NombreFantasia;
            dato.Vigente = datoGraba.Vigente;
            dato.Direccion = datoGraba.Direccion;
            dato.Localidad = datoGraba.Localidad;
            dato.Provincia = this.ObtenerObjeto<Provincia>(datoGraba.Provincia.Id);
            dato.CodigoPostal = datoGraba.CodigoPostal;
            dato.SituacionIVA = this.ObtenerObjeto<SituacionIVA>(datoGraba.SituacionIVA.Id);
            dato.Observaciones = datoGraba.Observaciones;
            dato.ComisionApp = datoGraba.ComisionApp;
            dato.DescuentoOculto = datoGraba.DescuentoOculto;
            
            repository.Actualizar(dato);

            ServicioGenerico servGenerico = new ServicioGenerico();
            string listaMayorista = servGenerico.ParametroObtenerValor("LISTA_MAYORISTA");
            
            string listaMayoristaDefault = string.Empty;
            if(datoGraba.AsignarListaMayorista)
                listaMayoristaDefault = servGenerico.ParametroObtenerValor("LISTA_MAYORISTA_DESCUENTO");
            else
                listaMayoristaDefault = servGenerico.ParametroObtenerValor("LISTA_MAYORISTA_DEFAULT");

            if (!string.IsNullOrEmpty(listaMayoristaDefault) && !string.IsNullOrEmpty(listaMayoristaDefault))
            {
                string[] listasPrecios = listaMayoristaDefault.Split(';');
                for (int i = 0; i < listasPrecios.Length; i++)
                {
                    ClienteLista clienteLista = new ClienteLista();
                    clienteLista.IdCliente = dato.Id;
                    //clienteLista.ListaPrecio = servGenerico.ObtenerObjeto<ListaPrecio>("Codigo", listaMayorista);
                    clienteLista.ListaPrecioCliente = servGenerico.ObtenerObjeto<ListaPrecioCliente>("Codigo", listasPrecios[i]);
                    if (clienteLista.ListaPrecioCliente == null)
                        throw new ApplicationException(string.Format("Error lista de precio Codigo: {10}", listasPrecios[i]));
                    clienteLista.ListaPrecio = clienteLista.ListaPrecioCliente.ListaPrecio;

                    if (clienteLista.ListaPrecio != null && clienteLista.ListaPrecioCliente != null)
                        this.ClienteListaGrabar(clienteLista);


                }
            }

            return dato;
        }

        public Cliente ClienteEliminar(int id)
        {
            RepositoryGenerico<Cliente> repository = new RepositoryGenerico<Cliente>();
            Cliente dato;

            dato = repository.Obtener(id);

            if (dato == null)
                throw new ApplicationException("No existe Cliente");

            repository.Eliminar(dato);

            return dato;
        }


        public List<ClienteLista> ClienteListaObtenerVigentesCache()
        {
            ServicioGenerico servicio = new ServicioGenerico();
            List<ClienteLista> listReturn = null;

            var tiposCache = CacheManager.GetToCache<List<ClienteLista>>(gobalKeyCache, "GetClienteLista");

            if (tiposCache == null)
            {
                listReturn = servicio.Listar<ClienteLista>().ToList<ClienteLista>();
                if (listReturn == null) listReturn = new List<ClienteLista>();
                CacheManager.AddToCache(gobalKeyCache, "GetClienteLista", listReturn);
            }
            else
            {
                listReturn = tiposCache;
            }

            //listReturn = servicio.Listar<ClienteLista>().ToList<ClienteLista>();
            
            return listReturn;
        }
        public ClienteLista ClienteListaGrabar(ClienteLista datoGraba)
        {
            RepositoryGenerico<ClienteLista> repository = new RepositoryGenerico<ClienteLista>();
            ClienteLista dato;

            if (datoGraba.Id == -1)
                dato = new ClienteLista();
            else
            {
                dato = repository.Obtener(datoGraba.Id);
                if (dato == null) throw new ApplicationException("No existe Lista de Precio");
            }

            //validamos si la lista producto ya está parametrizada
            List<ClienteLista> listasValidar = this.Listar<ClienteLista>("IdCliente", datoGraba.IdCliente).ToList<ClienteLista>();
            if (datoGraba.Id == -1 && listasValidar != null)
            {
                ClienteLista cl = listasValidar.Find(item => item.ListaPrecio.Id == datoGraba.ListaPrecio.Id);
                if (cl != null)
                    throw new ApplicationException("El cliente ya tiene parametrizada la lista de precio " + datoGraba.ListaPrecio.Codigo);
            }
            
            dato.IdCliente = datoGraba.IdCliente;
            dato.ListaPrecio = datoGraba.ListaPrecio;
            dato.ListaPrecioCliente = datoGraba.ListaPrecioCliente;

            repository.Actualizar(dato);

            CacheManager.ForceRemoveToCache(gobalKeyCache, "GetClienteLista");

            return dato;
        }

        public ClienteLista ClienteListaEliminar(int id)
        {
            RepositoryGenerico<ClienteLista> repository = new RepositoryGenerico<ClienteLista>();
            ClienteLista dato;

            dato = repository.Obtener(id);

            if (dato == null)
                throw new ApplicationException("No existe Lista de Precio");

            repository.Eliminar(dato);

            return dato;
        }
    }
}
