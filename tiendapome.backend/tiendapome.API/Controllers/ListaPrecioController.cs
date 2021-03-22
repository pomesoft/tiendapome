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
    public class ListaPrecioController : ApiController
    {
        // GET api/listaprecio
        public IHttpActionResult Get()
        {
            try
            {
                ServiciosProductos servicio = new ServiciosProductos();
                List<ListaPrecio> resp = servicio.Listar<ListaPrecio>()
                                                .OrderBy(item => item.Codigo)
                                                .ToList<ListaPrecio>();
                if (resp == null)
                    return NotFound();
                return Ok(resp);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // GET api/listaprecio
        [Route("api/listaprecio/GetVigentes/")]
        public IHttpActionResult GetVigentes()
        {
            try
            {
                ServiciosProductos servicio = new ServiciosProductos();
                List<ListaPrecio> resp = servicio.ListarVigentes<ListaPrecio>()
                                                .OrderBy(item => item.Codigo)
                                                .ToList<ListaPrecio>();
                if (resp == null)
                    return NotFound();
                return Ok(resp);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // GET api/listaprecio/5
        public IHttpActionResult Get(int id)
        {
            try
            {
                ServiciosProductos servicio = new ServiciosProductos();
                ListaPrecio resp = servicio.ObtenerObjeto<ListaPrecio>(id);
                if (resp == null)
                    return NotFound();
                return Ok(resp);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // POST api/listaprecio
        public IHttpActionResult Post([FromBody]ListaPrecio datos)
        {
            try
            {
                ServiciosProductos servicio = new ServiciosProductos();
                ListaPrecio resp = servicio.ListaPrecioGrabar(datos);   
                if (resp == null)
                    return NotFound();
                return Ok(resp);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // PUT api/listaprecio/5
        public void Put(int id, [FromBody]string value)
        {
        }

        [HttpPost]
        [Route("api/listaprecio/eliminar/{id}")]        
        public IHttpActionResult PostEliminar(int id)
        {
            try
            {
                ServiciosProductos servicio = new ServiciosProductos();
                ListaPrecio resp = servicio.ListaPrecioEliminar(id);
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
