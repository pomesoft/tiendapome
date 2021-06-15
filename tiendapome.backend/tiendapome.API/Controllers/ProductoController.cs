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

using Newtonsoft.Json;
using Winnovative.WnvHtmlConvert.PdfDocument;

using tiendapome.Entidades;
using tiendapome.Servicios;
using tiendapome.Impresion;

using tiendapome.API.Helpers;

namespace tiendapome.API.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class ProductoController : ApiController
    {
        // GET api/producto
        public IHttpActionResult Get()
        {
            try
            {
                /// no se deberia llamar de ningun lado que liste todos los productos de una 
                ServiciosProductos servicio = new ServiciosProductos();
                List<Producto> resp = new List<Producto>();
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

        // GET api/producto
        [HttpGet]
        [Route("api/producto/listarabm/{subCategoria}/{tipoListado}/{numeroPagina}/{cantidadRegistros}")]
        public IHttpActionResult GetListarABM(int subcategoria, int tipoListado, int numeroPagina, int cantidadRegistros)
        {
            try
            {
                ServiciosProductos servicio = new ServiciosProductos();
                ProductoList resp = servicio.ProductoListarABM(subcategoria, tipoListado, numeroPagina, cantidadRegistros);
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

        // GET api/producto
        [HttpGet]
        [Route("api/producto/listarbusqueda/{conStock}/{subCategoria}/{textoBuscar}/{cliente}/{numeroPagina}/{cantidadRegistros}")]
        public IHttpActionResult GetListarBusqueda(bool conStock, int subcategoria, string textoBuscar, int cliente, int numeroPagina, int cantidadRegistros)
        {
            try
            {
                ServiciosProductos servicio = new ServiciosProductos();
                ServicioGenerico servGenerico = new ServicioGenerico();
                string estamosEnMantenimiento = servGenerico.ParametroObtenerValor("HOST_EN_MANTENIMIENTO");

                ProductoList resp = null;

                if (estamosEnMantenimiento.Equals("SI"))
                    resp = servicio.ProductoListarEstamosEnMantenimiento();
                else
                    resp = servicio.ProductoListarCarrito(conStock, subcategoria, textoBuscar, cliente, numeroPagina, cantidadRegistros);

                //LoggerHelper.LogInfo(System.Reflection.MethodBase.GetCurrentMethod(), JsonConvert.SerializeObject(resp));

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

        // GET api/producto
        [HttpGet]
        [Route("api/producto/buscarcodigo/{conStock}/{codigo}/{cliente}")]
        public IHttpActionResult GetBuscarCodigo(bool conStock, string codigo, int cliente)
        {
            try
            {
                ServiciosProductos servicio = new ServiciosProductos();
                ProductoList productoList = null;

                productoList = servicio.ProductoListarCarrito(conStock, -1, codigo, cliente, -1, -1);

                Producto resp = productoList.Productos.Find(item => item.Codigo.Equals(codigo.ConvertirInt()));

                LoggerHelper.LogInfo(System.Reflection.MethodBase.GetCurrentMethod(), JsonConvert.SerializeObject(resp));

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
        // GET api/producto
        [HttpGet]
        [Route("api/producto/listar/{conStock}/{subCategoria}/{cliente}/{numeroPagina}/{cantidadRegistros}")]
        public IHttpActionResult GetListar(bool conStock, int subcategoria, int cliente, int numeroPagina, int cantidadRegistros)
        {
            try
            {
                ServiciosProductos servicio = new ServiciosProductos();
                ServicioGenerico servGenerico = new ServicioGenerico();
                string estamosEnMantenimiento = servGenerico.ParametroObtenerValor("HOST_EN_MANTENIMIENTO");

                ProductoList resp = null;

                if (estamosEnMantenimiento.Equals("SI"))
                    resp = servicio.ProductoListarEstamosEnMantenimiento();
                else
                    resp = servicio.ProductoListarCarrito(conStock, subcategoria, string.Empty, cliente, numeroPagina, cantidadRegistros);

                LoggerHelper.LogInfo(System.Reflection.MethodBase.GetCurrentMethod(), JsonConvert.SerializeObject(resp));
    
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

        // GET api/producto
        [HttpGet]
        [Route("api/producto/buscar/{buscar}/{solocodigo}/{numeroPagina}/{cantidadRegistros}")]
        public IHttpActionResult GetBuscar(string buscar, bool soloCodigo, int numeroPagina, int cantidadRegistros)
        {
            try
            {
                ServiciosProductos servicio = new ServiciosProductos();
                ProductoList resp = servicio.ProductoBusqueda(buscar, soloCodigo, false, numeroPagina, cantidadRegistros);
                if (resp == null)
                    return NotFound();
                return Ok(resp);
            }
            catch (Exception ex)
            {
                return BadRequest(string.Format("ex.Message=>\n{0}\n\nex.InnerException=>\n{1}\n\nex.StackTrace=>\n{2}", ex.Message, (ex.InnerException != null ? ex.InnerException.Message : string.Empty), ex.StackTrace));
            }
        }

        // GET api/producto/5
        public IHttpActionResult Get(int id)
        {
            try
            {
                ServiciosProductos servicio = new ServiciosProductos();
                Producto resp = servicio.ObtenerObjeto<Producto>(id);
                
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

        // POST api/producto
        public IHttpActionResult Post([FromBody]Producto datos)
        {
            try
            {
                ServiciosProductos servicio = new ServiciosProductos();
                string pathFotos = HttpContext.Current.Server.MapPath(string.Format("{0}", this.DamePathFoto()));
                Producto resp = servicio.ProductoGrabar(datos, pathFotos);
                if (resp == null)
                    return NotFound();
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
                return BadRequest("El producto no se pudo actualizar.");
            }
        }

        // PUT api/producto/5
        public void Put(int id, [FromBody]string value)
        {
        }

        [HttpPost]
        [Route("api/producto/eliminar/{id}")]
        public IHttpActionResult PostEliminar(int id)
        {
            try
            {
                ServiciosProductos servicio = new ServiciosProductos();
                Producto resp = servicio.ProductoEliminar(id);
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
        [Route("api/producto/movimientostock/")]
        public IHttpActionResult PostMovimientoStock([FromBody] ProductoStockMovimiento dato)
        {
            try
            {
                ServiciosProductos servicio = new ServiciosProductos();
                Producto resp = servicio.ProductoStockMovimientoGrabar(dato);
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
        [Route("api/producto/movimientostock/{idProductoStock}")]
        public IHttpActionResult GetMovimientosStockDetalle(int idProductoStock)
        {
            try
            {
                ServiciosProductos servicio = new ServiciosProductos();
                List<MovimientoStockDetalle> resp = servicio.MovimientoStockDetalleObtener(idProductoStock);

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
        [Route("api/producto/movimientostockcsv/{idProductoStock}")]
        public HttpResponseMessage ExportarMovimientosStockDetalle(int idProductoStock)
        {
            HttpResponseMessage result = null;
            try
            {
                ServiciosProductos servicio = new ServiciosProductos();
                string registros = servicio.ExportarCSVMovimientoStockDetalle(idProductoStock);

                //// Exportacion a Excel 
                byte[] byteArray = Encoding.UTF8.GetBytes(registros);
                MemoryStream reportStream = new MemoryStream(byteArray);

                result = Request.CreateResponse(HttpStatusCode.OK);

                result.Content = new StreamContent(reportStream);
                result.Content.Headers.ContentType = new MediaTypeHeaderValue("text/csv");
                result.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment")
                {
                    FileName = string.Format("MovimientosStock_{0}_{1}.csv", idProductoStock.ToString(), DateTime.Now.ToString("yyyyMMdd"))
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
        [Route("api/producto/foto")]
        public IHttpActionResult PostFoto()
        {
            try
            {
                var request = HttpContext.Current.Request;

                if (request.Files.Count > 0)
                {
                    foreach (string file in request.Files)
                    {
                        var postedFile = request.Files[file];
                        var filePath = HttpContext.Current.Server.MapPath(string.Format("{0}/{1}", this.DamePathFoto(), file));
                        LoggerHelper.LogInfo(MethodBase.GetCurrentMethod(), "filePath: " + filePath);
                        postedFile.SaveAs(filePath);
                    }
                    return Ok(true);
                }
                else
                    return BadRequest();

            }
            catch (Exception ex)
            {
                LoggerHelper.LogError(MethodBase.GetCurrentMethod(), ex);
                return BadRequest(ex.GetExceptionOriginal().Message);
            }

        }

        private string DamePathFoto()
        {
            ServicioGenerico servicio = new ServicioGenerico();

            string pathFotos = string.Empty;
            string paramsPathFoto = servicio.ParametroObtenerValor("PATH_FOTOS");
            if (paramsPathFoto != null)
                pathFotos = paramsPathFoto;
            else
                pathFotos = "~/assets/fotos/";

            return pathFotos;
        }


        [HttpGet]
        [Route("api/producto/listadoproductos/")]
        public HttpResponseMessage ExportarEtiquetas(int idSubcategoria, int tipoListado)
        {
            HttpResponseMessage result = null;
            try
            {
                ServiciosProductos servicio = new ServiciosProductos();
                ProcesadorPlantilla procPlantilla = new ProcesadorPlantilla("ListadoProductos");

                procPlantilla.DiccionarioDatos = servicio.ExportarListadoProductos(idSubcategoria, tipoListado);
                procPlantilla.ProcesarPlantilla();

                //// Exportacion a Excel 
                byte[] byteArray = Encoding.UTF8.GetBytes(procPlantilla.HTMLProcesado);
                MemoryStream reportStream = new MemoryStream(byteArray);

                result = Request.CreateResponse(HttpStatusCode.OK);

                result.Content = new StreamContent(reportStream);
                result.Content.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");
                result.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment")
                {
                    FileName = string.Format("Productos_{0}_{1}.xls", idSubcategoria.ToString(), DateTime.Now.ToString("yyyyMMdd"))
                };

                return result;

                /*
                 * * * exportar a PDF
                 List<string> contenidoHTML = new List<string>();
                ProcesadorPDF procesador = new ProcesadorPDF();
                Document _docPDF = null;

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
                result.Content.Headers.ContentDisposition.FileName = string.Format("Productos_{0}_{1}.pdf", idSubcategoria.ToString(), DateTime.Now.ToString("yyyyMMdd"));

                return result;
                 */

            }
            catch (Exception ex)
            {
                LoggerHelper.LogError(MethodBase.GetCurrentMethod(), ex);
                return Request.CreateResponse(HttpStatusCode.Gone);
            }
        }




        
    }
}
