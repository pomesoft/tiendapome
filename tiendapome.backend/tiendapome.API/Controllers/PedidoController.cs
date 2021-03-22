using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;
using System.Net;
using System.Reflection;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Threading.Tasks;

using Newtonsoft.Json;
using Winnovative.WnvHtmlConvert.PdfDocument;

using tiendapome.Entidades;
using tiendapome.Servicios;
using tiendapome.Impresion;
using tiendapome.API.Helpers;

namespace tiendapome.API.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class PedidoController : ApiController
    {
        // GET api/Pedido
        public IHttpActionResult Get()
        {
            try
            {
                ServiciosPedido servicio = new ServiciosPedido();
                List<Pedido> resp = servicio.Listar<Pedido>().ToList<Pedido>();
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

        // GET api/pedido/5
        public IHttpActionResult Get(int id)
        {
            try
            {
                ServiciosPedido servicio = new ServiciosPedido();
                Pedido resp = servicio.PedidoObtener(id);
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

        [HttpGet]
        [Route("api/Pedido/Obtener/{idPedido}/{numeroPagina}/{cantidadRegistros}")]        
        public IHttpActionResult Obtener(int idPedido, int numeroPagina, int cantidadRegistros)
        {
            try
            {
                ServiciosPedido servicio = new ServiciosPedido();
                Pedido resp = servicio.PedidoObtener(idPedido, numeroPagina, cantidadRegistros);
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

        [HttpGet]
        [Route("api/Pedido/Cliente/{idCliente}")]
        public IHttpActionResult Cliente(int idCliente)
        {
            //[Route("api/Pedido/Cliente/{idCliente}/{numeroPagina}/{cantidadRegistros}")]
            try
            {
                LoggerHelper.LogInfo(System.Reflection.MethodBase.GetCurrentMethod(), string.Format("PedidoObtenerClienteIngresado idCliente: {0} ", idCliente));
                ServiciosPedido servicio = new ServiciosPedido();
                Pedido resp = servicio.PedidoObtenerClienteIngresado(idCliente, -1, -1);
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

        [HttpGet]
        [Route("api/Pedido/Cliente/{idCliente}/{numeroPagina}/{cantidadRegistros}")]
        public IHttpActionResult Cliente(int idCliente, int numeroPagina, int cantidadRegistros)
        {            
            try
            {
                LoggerHelper.LogInfo(System.Reflection.MethodBase.GetCurrentMethod(), string.Format("PedidoObtenerClienteIngresado idCliente: {0} ", idCliente));
                ServiciosPedido servicio = new ServiciosPedido();
                Pedido resp = servicio.PedidoObtenerClienteIngresado(idCliente, numeroPagina, cantidadRegistros);
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

        // GET api/pedido/5
        [HttpGet]
        [Route("api/Pedido/List/")]
        public IHttpActionResult List(string estados, int idCliente, string fechaDesde, string fechaHasta)
        {
            try
            {
                ServiciosPedido servicio = new ServiciosPedido();
                List<Pedido> resp = servicio.PedidoListar(estados, idCliente, fechaDesde, fechaHasta, -1, -1).Pedidos;

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

        [HttpGet]
        [Route("api/Pedido/ListPaginado/")]
        public IHttpActionResult ListPaginado(string estados, int idCliente, string fechaDesde, string fechaHasta, int numeroPagina, int cantidadRegistros)
        {
            try
            {
                ServiciosPedido servicio = new ServiciosPedido();
                PedidoList resp = servicio.PedidoListar(estados, idCliente, fechaDesde, fechaHasta, numeroPagina, cantidadRegistros);

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
        public IHttpActionResult Post([FromBody]Pedido datos)
        {
            try
            {
                ServiciosPedido servicio = new ServiciosPedido();
                Pedido resp = servicio.PedidoGrabar(datos);
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
        [HttpPost]
        [Route("api/Pedido/Crear/{idCliente}")]
        public IHttpActionResult Crear(int idCliente)
        {
            try
            {
                ServiciosPedido servicio = new ServiciosPedido();
                Pedido resp = servicio.PedidoCrear(idCliente);

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
                return BadRequest("El pedido no se pudo actualizar.");
            }
        }

        [HttpPost]
        [Route("api/Pedido/Proveedor/{idPedido}")]
        public async Task<IHttpActionResult> Proveedor(int idPedido)
        {
            try
            {
                ServiciosPedido servicio = new ServiciosPedido();
                Pedido resp = await servicio.PedidoProveedor(idPedido);

                return Ok();
            }
            catch (ApplicationException ex)
            {
                LoggerHelper.LogError(MethodBase.GetCurrentMethod(), ex);
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                LoggerHelper.LogError(MethodBase.GetCurrentMethod(), ex);
                return BadRequest("El pedido no se pudo actualizar.");
            }
        }

        // POST api/pedido
        [HttpPost]
        [Route("api/Pedido/Avanzar/")]        
        public IHttpActionResult Avanzar([FromBody]Pedido datos)
        {
            try
            {
                ServiciosPedido servicio = new ServiciosPedido();
                MensajeResponse resp = servicio.PedidoAvanzar(datos, false);

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
                return BadRequest("El pedido no se pudo actualizar.");
            }
        }

        [HttpPost]
        [Route("api/Pedido/liberarstock/{idPedido}")]
        public IHttpActionResult LiberarStock(int idPedido)
        {
            try
            {
                ServiciosPedido servicio = new ServiciosPedido();
                servicio.PedidoLiberarStock(idPedido);

                return Ok();
            }
            catch (ApplicationException ex)
            {
                LoggerHelper.LogError(MethodBase.GetCurrentMethod(), ex);
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                LoggerHelper.LogError(MethodBase.GetCurrentMethod(), ex);
                return BadRequest("El pedido no se pudo actualizar.");
            }
        }

        [HttpPost]
        [Route("api/Pedido/cancelar/{idPedido}")]
        public IHttpActionResult Cancelar(int idPedido)
        {
            try
            {
                ServiciosPedido servicio = new ServiciosPedido();
                servicio.PedidoCancelar(idPedido);

                return Ok();
            }
            catch (ApplicationException ex)
            {
                LoggerHelper.LogError(MethodBase.GetCurrentMethod(), ex);
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                LoggerHelper.LogError(MethodBase.GetCurrentMethod(), ex);
                return BadRequest("El pedido no se pudo actualizar.");
            }
        }


        //este post es el que procesa los pedidos que los minorista enivaron al proveedor
        // POST api/pedido
        [HttpPost]
        [Route("api/Pedido/Minorista/")]
        public IHttpActionResult PedidoMinorista([FromBody] PedidoDTO datos)
        {
            LoggerHelper.LogError(MethodBase.GetCurrentMethod(), "Entró en  GET => PedidoMinorista(string datos)");
            try
            {
                ServiciosPedido servicio = new ServiciosPedido();

                LoggerHelper.LogError(MethodBase.GetCurrentMethod(), string.Format("datos  \n{0}", JsonConvert.SerializeObject(datos)));

                if (datos == null)
                    throw new ApplicationException("Llegó parametro en null la puta que te parió!!");

                //PedidoDTO datosDTO = JsonConvert.DeserializeObject<PedidoDTO>(datos);
                //LoggerHelper.LogError(MethodBase.GetCurrentMethod(), string.Format("PedidoDTO datosDTO \n{0}", JsonConvert.SerializeObject(datosDTO)));
                
                //Pedido resp = servicio.PedidoProcesarMinorista(datosDTO);

                Pedido resp = servicio.PedidoProcesarMinorista(datos);

                LoggerHelper.LogError(System.Reflection.MethodBase.GetCurrentMethod(), string.Format("Pedido generado\n{0}\n\n", JsonConvert.SerializeObject(resp)));

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
                return BadRequest("El pedido no se pudo actualizar.");
            }
        }

        [HttpGet]
        [Route("api/pedido/listadoetiquetas/")]
        public HttpResponseMessage ExportarEtiquetas(int idPedido)
        {
            HttpResponseMessage result = null;
            try
            {
                ServiciosPedido servicio = new ServiciosPedido();
                //ProcesadorPlantilla procPlantilla = new ProcesadorPlantilla("ListadoEtiquetas");

                //procPlantilla.DiccionarioDatos = servicio.ImprimirEtiquetas(idPedido);
                //procPlantilla.ProcesarPlantilla();

                //// Exportacion a Excel 
                string registros = servicio.ImprimirEtiquetas(idPedido);
                byte[] byteArray = Encoding.UTF8.GetBytes(registros);
                MemoryStream reportStream = new MemoryStream(byteArray);

                result = Request.CreateResponse(HttpStatusCode.OK);

                result.Content = new StreamContent(reportStream);
                //excel
                //result.Content.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");
                //csv
                result.Content.Headers.ContentType = new MediaTypeHeaderValue("text/csv");
                result.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment")
                {
                    FileName = string.Format("Pedido_{0}_{1}.csv", idPedido.ToString(), DateTime.Now.ToString("yyyyMMdd"))
                };

                return result;
            }
            catch (Exception ex)
            {
                LoggerHelper.LogError(MethodBase.GetCurrentMethod(), ex);
                return Request.CreateResponse(HttpStatusCode.Gone);
            }
        }

    }
}
