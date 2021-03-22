using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;

using tiendapome.Entidades;
using tiendapome.Servicios;

namespace tiendapome.API.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class ListaPrecioClienteController : ApiController
    {
        // GET api/listapreciocliente
        public IHttpActionResult Get()
        {
            try
            {
                ServiciosProductos servicio = new ServiciosProductos();
                List<ListaPrecioCliente> resp = servicio.ListarVigentes<ListaPrecioCliente>();
                if (resp == null)
                    return NotFound();
                return Ok(resp);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // GET api/listapreciocliente
        [HttpGet]
        [Route("api/listapreciocliente/GetAll/")]
        public IHttpActionResult GetAll(int idListaPrecio)
        {
            try
            {
                ServiciosProductos servicio = new ServiciosProductos();
                List<ListaPrecioCliente> resp = null;
                List<ListaPrecioCliente> lista = servicio.Listar<ListaPrecioCliente>();

                if (lista != null)
                    resp = lista.Where(item => item.ListaPrecio.Id.Equals(idListaPrecio))
                                .OrderBy(item => item.Codigo)
                                .ToList<ListaPrecioCliente>();

                if (resp == null)
                    return NotFound();
                return Ok(resp);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // GET api/listapreciocliente
        [HttpGet]
        [Route("api/listapreciocliente/GetVigentes/")]
        public IHttpActionResult GetVigentes(int idListaPrecio)
        {
            try
            {
                ServiciosProductos servicio = new ServiciosProductos();
                List<ListaPrecioCliente> resp = null;
                List<ListaPrecioCliente> lista = servicio.ListarVigentes<ListaPrecioCliente>();

                if (lista != null)
                    resp = lista.Where(item => item.ListaPrecio.Id.Equals(idListaPrecio)).ToList<ListaPrecioCliente>();

                if (resp == null)
                    return NotFound();
                return Ok(resp);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // GET api/listapreciocliente/5
        public IHttpActionResult Get(int id)
        {
            try
            {
                ServiciosProductos servicio = new ServiciosProductos();
                ListaPrecioCliente resp = servicio.ObtenerObjeto<ListaPrecioCliente>(id);
                if (resp == null)
                    return NotFound();
                return Ok(resp);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // POST api/listapreciocliente
        public IHttpActionResult Post([FromBody]ListaPrecioCliente datos)
        {
            try
            {
                ServiciosProductos servicio = new ServiciosProductos();
                ListaPrecioCliente resp = servicio.ListaPrecioClienteGrabar(datos);
                if (resp == null)
                    return NotFound();
                return Ok(resp);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // PUT api/listapreciocliente/5
        public void Put(int id, [FromBody]string value)
        {
        }

        [HttpPost]
        [Route("api/listapreciocliente/eliminar/{id}")]          
        public IHttpActionResult PostEliminar(int id)
        {
            try
            {
                ServiciosProductos servicio = new ServiciosProductos();
                ListaPrecioCliente resp = servicio.ListaPrecioClienteEliminar(id);
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
