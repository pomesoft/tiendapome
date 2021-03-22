
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
    public class CotizacionController : ApiController
    {
        // GET api/tipo
        public IHttpActionResult Get()
        {
            try
            {
                ServiciosProductos servicio = new ServiciosProductos();
                List<CotizacionDolar> resp = servicio.Listar<CotizacionDolar>()
                                                    .OrderByDescending(item=>item.Fecha)
                                                    .ToList<CotizacionDolar>();
                if (resp == null)
                    return NotFound();
                return Ok(resp);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // GET api/parametro/5
        public IHttpActionResult Get(int id)
        {
            try
            {
                ServiciosProductos servicio = new ServiciosProductos();
                CotizacionDolar resp = servicio.CotizacionDolarObtenerCache()
                                                .FirstOrDefault(item => item.Id.Equals(id));
                if (resp == null)
                    return NotFound();
                return Ok(resp);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // POST api/parametro
        public IHttpActionResult Post([FromBody]CotizacionDolar datos)
        {
            try
            {
                ServiciosProductos servicio = new ServiciosProductos();
                CotizacionDolar resp = servicio.CotizacionDolarGrabar(datos);
                if (resp == null)
                    return NotFound();
                return Ok(resp);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("api/Cotizacion/eliminar/{id}")]
        public IHttpActionResult PostEliminar(int id)
        {
            try
            {
                ServiciosProductos servicio = new ServiciosProductos();
                CotizacionDolar resp = servicio.CotizacionDolarEliminar(id);
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
