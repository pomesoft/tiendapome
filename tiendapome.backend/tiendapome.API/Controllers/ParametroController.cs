using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Reflection;

using tiendapome.Entidades;
using tiendapome.Servicios;
using tiendapome.API.Helpers;

namespace tiendapome.API.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class ParametroController : ApiController
    {
        // GET api/tipo
        public IHttpActionResult Get()
        {
            try
            {
                ServicioGenerico servicio = new ServicioGenerico();
                List<Parametro> resp = servicio.ParametroListar();
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
                ServicioGenerico servicio = new ServicioGenerico();
                Parametro resp = servicio.ParametroObtener(id);
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
        [Route("api/parametro/getall")]
        public IHttpActionResult GetAll()
        {
            try
            {
                ServicioGenerico servicio = new ServicioGenerico();

                List<Parametro> resp = servicio.Listar<Parametro>();
                
                return Ok(resp);
            }
            catch (Exception ex)
            {
                LoggerHelper.LogError(MethodBase.GetCurrentMethod(), ex);
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("api/parametro/valor/{clave}")]
        public IHttpActionResult GetValor(string clave)
        {
            try
            {
                ServicioGenerico servicio = new ServicioGenerico();

                //LoggerHelper.LogInfo(MethodBase.GetCurrentMethod(), string.Format("Parametro: {0} ", clave));
                Parametro resp = null;
                if (clave != "VERSION_APP")
                    resp = servicio.ParametroObtener(clave);
                //if (resp == null)
                //    return NotFound();
                return Ok(resp);
            }
            catch (Exception ex)
            {
                LoggerHelper.LogError(MethodBase.GetCurrentMethod(), ex);
                return BadRequest(ex.Message);
            }
        }

        // GET api/parametro/5
        public IHttpActionResult Get(string clave)
        {
            try
            {
                ServicioGenerico servicio = new ServicioGenerico();
                Parametro resp = servicio.ParametroObtener(clave);
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
        public IHttpActionResult Post([FromBody]Parametro datos)
        {
            try
            {
                ServicioGenerico servicio = new ServicioGenerico();
                Parametro resp = servicio.ParametroGrabar(datos);
                if (resp == null)
                    return NotFound();
                return Ok(resp);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        
        // PUT api/parametro/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/parametro/5
        public void Delete(int id)
        {
        }
    }
}
