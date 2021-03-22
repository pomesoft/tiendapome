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
    public class LoginController : ApiController
    {
        [HttpGet]
        [Route("api/login/{usuario}/{clave}")]
        public IHttpActionResult Login(string usuario, string clave)
        {
            try
            {
                LoggerHelper.LogInfo(System.Reflection.MethodBase.GetCurrentMethod(), string.Format("Login usuario: {0} - clave: {1}", usuario, clave));

                ServicioClientes servicio = new ServicioClientes();
                Cliente resp = servicio.ClienteLogIn(usuario, clave);

                if (resp == null)
                    return NotFound();
                LoggerHelper.LogInfo(System.Reflection.MethodBase.GetCurrentMethod(), JsonConvert.SerializeObject(resp));

                return Ok(resp);
            }
            catch (ApplicationException ex)
            {
                LoggerHelper.LogError(MethodBase.GetCurrentMethod(), ex);
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                LoggerHelper.LogError(MethodBase.GetCurrentMethod(), ex);
                return BadRequest("Ocurrió un error al validar el usuario.");
            }
        }

        [HttpPost]
        public IHttpActionResult Post([FromBody]Cliente datos)
        {
            try
            {
                ServicioClientes servicio = new ServicioClientes();
                servicio.ClienteLogOut(datos.Id);
                
                return Ok();
            }
            catch (Exception ex)
            {
                LoggerHelper.LogError(MethodBase.GetCurrentMethod(), ex);
                return BadRequest(ex.Message);
            }
        }
    }
}
