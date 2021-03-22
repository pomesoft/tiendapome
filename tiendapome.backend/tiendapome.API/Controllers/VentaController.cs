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
    public class VentaController : ApiController
    {
        [HttpGet]
        public IHttpActionResult Get(int id)
        {
            try
            {
                ServiciosVentas servicio = new ServiciosVentas();
                DocumentoVenta resp = servicio.DocumentoVentaObtener(id);
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
        [Route("api/venta/listpaginado/")]
        public IHttpActionResult ListPaginado(int numeroPagina, int cantidadRegistros, string fechaDesde, string fechaHasta, int idUsuario, int idCliente, string tipoListado)
        {
            try
            {
                ServiciosVentas servicio = new ServiciosVentas();
                DocumentoVentaList resp = servicio.DocumentosVentasListar(numeroPagina, cantidadRegistros, fechaDesde, fechaHasta, idUsuario, idCliente, tipoListado.ConvertirIntNulleable());
                if (resp == null)
                    return NotFound();
                return Ok(resp);
            }
            catch (Exception ex)
            {
                LoggerHelper.LogError(MethodBase.GetCurrentMethod(), ex);
                return BadRequest(ex.GetExceptionOriginal().Message);
            }
        }

        [HttpGet]
        [Route("api/venta/listresumensaldoctacte/")]
        public IHttpActionResult ListResumenSaldoCtaCte()
        {
            try
            {
                ServiciosVentas servicio = new ServiciosVentas();
                List<ListadoCtaCte> resp = servicio.ObenerResumenSaldosCtaCte();
                if (resp == null)
                    return NotFound();
                return Ok(resp);
            }
            catch (Exception ex)
            {
                LoggerHelper.LogError(MethodBase.GetCurrentMethod(), ex);
                return BadRequest(ex.GetExceptionOriginal().Message);
            }
        }

        [HttpGet]
        [Route("api/venta/saldoinicialcliente/")]
        public IHttpActionResult SaldoInicial(string fecha, int idCliente)
        {
            try
            {
                ServiciosVentas servicio = new ServiciosVentas();
                decimal resp = servicio.DocumentoVentaObtenerSaldoInicial(idCliente, fecha);
                return Ok(resp);
            }
            catch (Exception ex)
            {
                LoggerHelper.LogError(MethodBase.GetCurrentMethod(), ex);
                return BadRequest(ex.GetExceptionOriginal().Message);
            }
        }

        [HttpGet]
        [Route("api/venta/tipocomprobate/{idTipoComprobante}")]
        public IHttpActionResult TipoComprobante(int idTipoComprobante)
        {
            try
            {
                ServiciosVentas servicio = new ServiciosVentas();
                VentaTipoComprobante resp = servicio.ObtenerObjeto<VentaTipoComprobante>(idTipoComprobante);
                if (resp == null)
                    return NotFound();
                return Ok(resp);
            }
            catch (Exception ex)
            {
                LoggerHelper.LogError(MethodBase.GetCurrentMethod(), ex);
                return BadRequest(ex.GetExceptionOriginal().Message);
            }
        }

        // POST api/venta
        [HttpPost]
        [Route("api/venta/")]
        public IHttpActionResult Post([FromBody] DocumentoVenta venta)
        {
            try
            {
                ServiciosVentas servicio = new ServiciosVentas();
                DocumentoVenta resp = servicio.DocumentoVentaGrabar(venta);

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
                return BadRequest("El documento de venta no se pudo actualizar.");
            }
        }

        [HttpPost]
        [Route("api/venta/anular/")]
        public IHttpActionResult Anular([FromBody] DocumentoVenta venta)
        {
            try
            {
                ServiciosVentas servicio = new ServiciosVentas();
                DocumentoVenta resp = servicio.DocumentoVentaAnular(venta);

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
                return BadRequest("El documento de venta no se pudo actualizar.");
            }
        }
        
        [HttpPost]
        [Route("api/venta/item/")]
        public IHttpActionResult Post([FromBody] DocumentoVentaItem item)
        {
            try
            {
                ServiciosVentas servicio = new ServiciosVentas();
                DocumentoVentaItem resp = servicio.DocumentoVentaItemGrabar(item);

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
                return BadRequest("El documento de venta no se pudo actualizar.");
            }
        }

        [HttpPost]
        [Route("api/venta/eliminaritem/")]
        public IHttpActionResult EliminarItem([FromBody] DocumentoVentaItem docItem)
        {
            try
            {
                ServiciosVentas servicio = new ServiciosVentas();
                DocumentoVenta resp = servicio.DocumentoVentaItemEliminar(docItem);

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
                return BadRequest("El documento de venta no se pudo actualizar.");
            }
        }


        [HttpPost]
        [Route("api/venta/facturarpedido/")]
        public IHttpActionResult FacturarPedido([FromBody] DocumentoVenta docVenta)
        {
            try
            {
                ServiciosVentas servicio = new ServiciosVentas();
                DocumentoVenta resp = servicio.DocumentoVentaFacturarPedido(docVenta);

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
                return BadRequest("El documento de venta no se pudo actualizar.");
            }
        }

        [HttpPost]
        [Route("api/venta/facturarproducto/")]
        public IHttpActionResult FacturarPedido([FromBody] Producto producto)
        {
            try
            {
                ServiciosVentas servicio = new ServiciosVentas();
                DocumentoVenta resp = servicio.DocumentoVentaFacturarProducto(producto);

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
                return BadRequest("El documento de venta no se pudo actualizar.");
            }
        }

        [HttpGet]
        [Route("api/venta/imprimirnp/")]
        public HttpResponseMessage ImprimirNP(int idVenta)
        {
            HttpResponseMessage result = null;
            try
            {
                ServiciosVentas servicio = new ServiciosVentas();
                ProcesadorPlantilla procPlantilla = new ProcesadorPlantilla("formDocumentoVenta");
                List<string> contenidoHTML = new List<string>();
                ProcesadorPDF procesador = new ProcesadorPDF();
                Document _docPDF = null;


                procPlantilla.DiccionarioDatos = servicio.ImprimirDatosNotaPedido(idVenta);
                procPlantilla.ProcesarPlantilla();

                string nombreArchivo = string.Format("Comprob_{0}_{1}.pdf", procPlantilla.DiccionarioDatos["Numero"].ToString(), DateTime.Now.ToString("yyyyMMdd"));

                contenidoHTML.Add(procPlantilla.HTMLProcesado);
                
                procesador.MostrarEncabezado = true;
                procesador.AltoEncabezado = 65;
                procesador.MostrarPieDePagina = true;
                procesador.AltoPieDePagina = 20;
                procesador.TextoPieDePagina = true;

                _docPDF = procesador.ProcesarDocumentoPDF(contenidoHTML);
                byte[] outPdfBuffer = _docPDF.Save();

                result = Request.CreateResponse(HttpStatusCode.OK);
                result.Content = new ByteArrayContent(outPdfBuffer);
                result.Content.Headers.ContentDisposition = new System.Net.Http.Headers.ContentDispositionHeaderValue("attachment");
                result.Content.Headers.ContentDisposition.FileName = nombreArchivo;

                return result;
            }
            catch (Exception ex)
            {
                LoggerHelper.LogError(MethodBase.GetCurrentMethod(), ex);
                return Request.CreateResponse(HttpStatusCode.Gone);
            }
        }

        [HttpGet]
        [Route("api/venta/exportctactetopdf/")]
        public HttpResponseMessage ExportarCtaCtePdf(string fechaDesde, string fechaHasta, int idCliente)
        {
            HttpResponseMessage result = null;
            try
            {
                ServiciosVentas servicio = new ServiciosVentas();
                ProcesadorPlantilla procPlantilla = new ProcesadorPlantilla("ListadoCtaCte");
                List<string> contenidoHTML = new List<string>();
                ProcesadorPDF procesador = new ProcesadorPDF();
                Document _docPDF = null;


                procPlantilla.DiccionarioDatos = servicio.ImprimirCtaCteCliente(fechaDesde, fechaHasta, idCliente);
                procPlantilla.ProcesarPlantilla();

                string nombreArchivo = string.Format("CtaCte_{0}_{1}.pdf", idCliente.ToString(), DateTime.Now.ToString("yyyyMMdd"));

                contenidoHTML.Add(procPlantilla.HTMLProcesado);

                procesador.MostrarEncabezado = true;
                procesador.AltoEncabezado = 30;
                procesador.MostrarPieDePagina = true;
                procesador.AltoPieDePagina = 20;
                procesador.TextoPieDePagina = true;

                _docPDF = procesador.ProcesarDocumentoPDF(contenidoHTML);
                byte[] outPdfBuffer = _docPDF.Save();

                result = Request.CreateResponse(HttpStatusCode.OK);
                result.Content = new ByteArrayContent(outPdfBuffer);
                result.Content.Headers.ContentDisposition = new System.Net.Http.Headers.ContentDispositionHeaderValue("attachment");
                result.Content.Headers.ContentDisposition.FileName = nombreArchivo;

                return result;
            }
            catch (Exception ex)
            {
                LoggerHelper.LogError(MethodBase.GetCurrentMethod(), ex);
                return Request.CreateResponse(HttpStatusCode.Gone);
            }
        }

        [HttpGet]
        [Route("api/venta/exportctactetocsv/")]
        public HttpResponseMessage ExportarCtaCteCsv(string fechaDesde, string fechaHasta, int idCliente)
        {
            HttpResponseMessage result = null;
            try
            {
                ServiciosVentas servicio = new ServiciosVentas();

                decimal saldoInicial = servicio.DocumentoVentaObtenerSaldoInicial(idCliente, fechaDesde);
                List<ItemListado> listado = servicio.ObtenerCtaCteCliente(fechaDesde, fechaHasta, idCliente, saldoInicial);
                StringBuilder registros = new StringBuilder();

                registros.AppendLine("Fecha,Comprobante,Pedido Facturado,Debito,Credito,Saldo");

                listado.ForEach(delegate(ItemListado item) 
                {
                    registros.AppendLine(string.Format("{0},{1},{2},{3},{4},{5}", item.Campo1, item.Campo2, item.Campo3, item.Campo4, item.Campo5, item.Campo6));
                });


                byte[] byteArray = Encoding.UTF8.GetBytes(registros.ToString());
                MemoryStream reportStream = new MemoryStream(byteArray);

                result = Request.CreateResponse(HttpStatusCode.OK);

                result.Content = new StreamContent(reportStream);
                //excel
                //result.Content.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");
                //csv
                result.Content.Headers.ContentType = new MediaTypeHeaderValue("text/csv");
                result.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment")
                {
                    FileName = string.Format("CtaCte_{0}_{1}.csv", idCliente.ToString(), DateTime.Now.ToString("yyyyMMdd"))
                };

                return result;
            }
            catch (Exception ex)
            {
                LoggerHelper.LogError(MethodBase.GetCurrentMethod(), ex);
                return Request.CreateResponse(HttpStatusCode.Gone);
            }
        }

        [HttpGet]
        [Route("api/venta/exportresumensaldotocsv/")]
        public HttpResponseMessage ExportarResumenSaldoCsv()
        {
            HttpResponseMessage result = null;
            try
            {
                ServiciosVentas servicio = new ServiciosVentas();

                List<ListadoCtaCte> listado = servicio.ObenerResumenSaldosCtaCte();
                StringBuilder registros = new StringBuilder();

                registros.AppendLine("Cliente,Nombre Fantasia,Debitos,Creditos,Saldo");
                string _cli = string.Empty;
                listado.ForEach(delegate(ListadoCtaCte item)
                {
                    _cli = string.Format("({0}) - {1}", item.Campo1, item.Campo2);
                    registros.AppendLine(string.Format("{0},{1},{2},{3},{4}", _cli, item.Campo3, item.Campo4, item.Campo5, item.Campo6));
                });


                byte[] byteArray = Encoding.UTF8.GetBytes(registros.ToString());
                MemoryStream reportStream = new MemoryStream(byteArray);

                result = Request.CreateResponse(HttpStatusCode.OK);

                result.Content = new StreamContent(reportStream);
                //excel
                //result.Content.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");
                //csv
                result.Content.Headers.ContentType = new MediaTypeHeaderValue("text/csv");
                result.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment")
                {
                    FileName = string.Format("ResumenSaldo_{0}.csv", DateTime.Now.ToString("yyyyMMdd"))
                };

                return result;
            }
            catch (Exception ex)
            {
                LoggerHelper.LogError(MethodBase.GetCurrentMethod(), ex);
                return Request.CreateResponse(HttpStatusCode.Gone);
            }
        }

        [HttpPost]
        [Route("api/venta/adjunto")]
        public IHttpActionResult PostFoto()
        {
            var request = HttpContext.Current.Request;

            if (request.Files.Count > 0)
            {
                foreach (string file in request.Files)
                {
                    var postedFile = request.Files[file];
                    var filePath = HttpContext.Current.Server.MapPath(string.Format("{0}/{1}", "~/assets/adjuntos/", file));
                    postedFile.SaveAs(filePath);
                }
                return Ok(true);
            }
            else
                return BadRequest();
        }


    }
}
