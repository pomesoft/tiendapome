using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Reflection;
using System.Web.Http;
using System.Web.Http.Cors;

using Newtonsoft.Json;

using tiendapome.Entidades;
using tiendapome.Servicios;

using tiendapome.API.Helpers;

namespace tiendapome.API.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class ClienteController : ApiController
    {
        // GET api/cliente
        public IHttpActionResult Get()
        {
            try
            {
                ServicioClientes servicio = new ServicioClientes();
                List<Cliente> resp = servicio.ClienteBusqueda(string.Empty, false);
                if (resp == null)
                    return NotFound();
                return Ok(resp);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        
        [HttpGet]
        [Route("api/cliente/buscar/{buscar}/")]
        public IHttpActionResult GetBuscar(string buscar)
        {
            try
            {
                ServicioClientes servicio = new ServicioClientes();
                List<Cliente> resp = servicio.ClienteBusqueda(buscar, false);
                if (resp == null)
                    return NotFound();
                return Ok(resp);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("api/cliente/autocompleta/{buscar}/")]
        public IHttpActionResult GetBuscarAutocompletar(string buscar)
        {
            try
            {
                ServicioClientes servicio = new ServicioClientes();
                List<string> resp = servicio.ClienteBusqueda(buscar, false)
                                        .OrderBy(item => item.Email)
                                        .Select(item => item.ClienteList)
                                        .ToList<string>(); 
                if (resp == null)
                    return NotFound();
                return Ok(resp);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("api/cliente/listarsinlista/")]
        public IHttpActionResult GetClientesSinLista()
        {
            try
            {
                ServicioClientes servicio = new ServicioClientes();
                List<Cliente> resp = servicio.ClienteBusqueda(string.Empty, true);
                if (resp == null)
                    return NotFound();
                return Ok(resp);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
      

        // GET api/cliente/5
        public IHttpActionResult Get(int id)
        {
            try
            {
                ServicioClientes servicio = new ServicioClientes();
                Cliente resp = servicio.ClienteObtener(id);
                
                if (resp == null)
                    return NotFound();

                return Ok(resp);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        
        // POST api/cliente
        public IHttpActionResult Post([FromBody]Cliente datos)
        {
            try
            {
                ServicioClientes servicio = new ServicioClientes();
                LoggerHelper.LogInfo(System.Reflection.MethodBase.GetCurrentMethod(), JsonConvert.SerializeObject(datos));

                Cliente resp = servicio.ClienteGrabar(datos);
                if (resp == null)
                    return NotFound();
                return Ok(resp);
            }
            catch (ApplicationException ex)
            {
                LoggerHelper.LogError(MethodBase.GetCurrentMethod(), ex);
                LoggerHelper.LogError(System.Reflection.MethodBase.GetCurrentMethod(), JsonConvert.SerializeObject(datos));
                return BadRequest(ex.Message);
            }
            catch (Exception)
            {
                return BadRequest("El cliente no se pudo actualizar.");
            }
        }
        // POST api/cliente
        [HttpPost]
        [Route("api/cliente/ListaPrecioCliente/")]
        public IHttpActionResult ListaPrecioCliente([FromBody]ClienteLista datos)
        {
            try
            {
                ServicioClientes servicio = new ServicioClientes();
                ClienteLista resp = servicio.ClienteListaGrabar(datos);
                if (resp == null)
                    return NotFound();
                return Ok(resp);
            }
            catch (ApplicationException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception)
            {
                return BadRequest("La lista de precios para el cliente no se pudo actualizar.");
            }
        }

        // PUT api/cliente/5
        public void Put(int id, [FromBody]string value)
        {
        }

        [HttpPost]
        [Route("api/cliente/eliminar/{id}")]
        public IHttpActionResult PostEliminar(int id)
        {
            try
            {
                ServicioClientes servicio = new ServicioClientes();
                Cliente resp = servicio.ClienteEliminar(id);
                if (resp == null)
                    return NotFound();
                return Ok(resp);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // DELETE api/cliente/5
        [HttpPost]
        [Route("api/cliente/listapreciocliente/eliminar/{id}")]
        public IHttpActionResult ListaPrecioCliente(int id)
        {
            try
            {
                ServicioClientes servicio = new ServicioClientes();
                ClienteLista resp = servicio.ClienteListaEliminar(id);
                if (resp == null)
                    return NotFound();
                return Ok(resp);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
