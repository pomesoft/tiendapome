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
    public class PedidoItemController : ApiController
    {
        
        // GET api/pedidoitem/5
        public IHttpActionResult Get(int id)
        {
            try
            {
                ServiciosPedido servicio = new ServiciosPedido();
                PedidoItem resp = servicio.ObtenerObjeto<PedidoItem>(id);
                if (resp == null)
                    return NotFound();
                return Ok(resp);
            }
            catch (Exception ex)
            {
                LoggerHelper.LogError(MethodBase.GetCurrentMethod(), ex);
                return BadRequest(ex.Message);
            }
        }

        // POST api/pedido
        public IHttpActionResult Post([FromBody]PedidoItem datos)
        {
            try
            {
                ServiciosPedido servicio = new ServiciosPedido();

                LoggerHelper.LogInfo(MethodBase.GetCurrentMethod(), JsonConvert.SerializeObject(datos));

                Pedido resp = servicio.PedidoItemGrabar(datos);
                if (resp.Items == null || resp.Items.Count == 0)
                    resp.Items = servicio.PedidoObtenerItems(resp.Id, -1, -1);

                if (resp == null)
                    return NotFound();
                return Ok(resp);
            }
            catch (Exception ex)
            {
                LoggerHelper.LogError(MethodBase.GetCurrentMethod(), ex);
                return BadRequest("El pedido no se pudo actualizar." + ex.Message);
            }
        }

        [HttpGet]
        [Route("api/pedidoitem/minorista/{idPedido}/{codigo}/{cantidad}")]
        public IHttpActionResult PedidoItemMinorista(int idPedido, int codigo, int cantidad) 
        {
            try
            {
                ServiciosPedido servicio = new ServiciosPedido();
                
                LoggerHelper.LogInfo(MethodBase.GetCurrentMethod(), string.Format("idPedido={0} - codigo={1} - cantidad={2}", idPedido, codigo, cantidad));

                PedidoItem datos = new PedidoItem();
                datos.IdPedido = idPedido;
                datos.Producto = servicio.ObtenerObjeto<Producto>("Codigo", codigo);
                datos.Cantidad = cantidad;

                Pedido resp = servicio.PedidoItemGrabar(datos);

                if (resp == null)
                    return NotFound();
                return Ok(resp);
            }
            catch (Exception ex)
            {
                LoggerHelper.LogError(MethodBase.GetCurrentMethod(), ex);
                return BadRequest("El pedido no se pudo actualizar." + ex.Message);
            }
        }

        [HttpPost]
        [Route("api/pedidoitem/cambioestado")]
        public IHttpActionResult PostCambioEstado([FromBody]PedidoItem datos)
        {
            try
            {
                ServiciosPedido servicio = new ServiciosPedido();
                PedidoItem resp = servicio.PedidoItemGrabarCambioEstado(datos);

                if (resp == null)
                    return NotFound();
                return Ok(resp);
            }
            catch (Exception ex)
            {
                LoggerHelper.LogError(MethodBase.GetCurrentMethod(), ex);
                return BadRequest("El pedido no se pudo actualizar.");
            }
        }

        // PUT api/pedidoitem/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/pedidoitem/5
        public IHttpActionResult Delete(int id)
        {
            try
            {
                ServiciosPedido servicio = new ServiciosPedido();
                servicio.PedidoItemEliminar(id);
                return Ok("OK");
            }
            catch (Exception ex)
            {
                LoggerHelper.LogError(MethodBase.GetCurrentMethod(), ex);
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("api/pedidoitem/eliminar/{id}")]
        public IHttpActionResult PostEliminar(int id)
        {
            try
            {
                ServiciosPedido servicio = new ServiciosPedido();
                servicio.PedidoItemEliminar(id);
                return Ok("OK");
            }
            catch (Exception ex)
            {
                LoggerHelper.LogError(MethodBase.GetCurrentMethod(), ex);
                return BadRequest("El pedido no se pudo eliminar.");
            }
        }
    }
}
