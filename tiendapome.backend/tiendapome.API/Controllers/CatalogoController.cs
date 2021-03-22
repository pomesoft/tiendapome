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
    public class CatalogoController : ApiController
    {
        // GET api/catalogo
        [HttpGet]
        [Route("api/catalogo/estados")]
        public IHttpActionResult Estados()
        {
            try
            {
                ServicioGenerico servicio = new ServicioGenerico();
                List<Estado> resp = servicio.Listar<Estado>().OrderBy(item=>item.Orden).ToList<Estado>();

                resp.ForEach(delegate(Estado estado) 
                {
                    if (estado.Id == (int)ESTADOS.SOLICITADO_ || estado.Id == (int)ESTADOS.EN_PROCESO_ || estado.Id == (int)ESTADOS.PROVEEDOR_)
                        estado.Chequed = true;
                    else
                        estado.Chequed = false;

                });

                if (resp == null)
                    return NotFound();
                return Ok(resp);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // GET api/catalogo
        [HttpGet]
        [Route("api/catalogo/Roles")]
        public IHttpActionResult Roles()
        {
            try
            {
                ServicioGenerico servicio = new ServicioGenerico();
                List<Rol> resp = servicio.Listar<Rol>().ToList<Rol>();
                
                if (resp == null)
                    return NotFound();
                return Ok(resp);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // GET api/catalogo
        [HttpGet]
        [Route("api/catalogo/Provincias")]
        public IHttpActionResult Provincias()
        {
            try
            {
                ServicioGenerico servicio = new ServicioGenerico();
                List<Provincia> resp = servicio.Listar<Provincia>().ToList<Provincia>();

                if (resp == null)
                    return NotFound();
                return Ok(resp);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // GET api/catalogo
        [HttpGet]
        [Route("api/catalogo/TiposComprobante")]
        public IHttpActionResult TipoComprobantes()
        {
            try
            {
                ServicioGenerico servicio = new ServicioGenerico();
                List<VentaTipoComprobante> resp = servicio.Listar<VentaTipoComprobante>().ToList<VentaTipoComprobante>();

                if (resp == null)
                    return NotFound();
                return Ok(resp);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // GET api/catalogo
        [HttpGet]
        [Route("api/catalogo/TiposComprobante/{id}")]
        public IHttpActionResult TipoComprobantes(int id)
        {
            try
            {
                ServicioGenerico servicio = new ServicioGenerico();
                VentaTipoComprobante resp = servicio.ObtenerObjeto<VentaTipoComprobante>(id);

                if (resp == null)
                    return NotFound();
                return Ok(resp);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // GET api/catalogo
        [HttpGet]
        [Route("api/catalogo/SituacionesIVA")]
        public IHttpActionResult SituacionesIVA()
        {
            try
            {
                ServicioGenerico servicio = new ServicioGenerico();
                List<SituacionIVA> resp = servicio.Listar<SituacionIVA>().ToList<SituacionIVA>();

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
        [Route("api/catalogo/medida")]
        public IHttpActionResult Medida()
        {
            try
            {
                ServiciosCatalogos servicio = new ServiciosCatalogos();
                List<Medida> resp = servicio.Listar<Medida>().ToList<Medida>();

                
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
        [Route("api/catalogo/medida/{id}")]
        public IHttpActionResult Medida(int id)
        {
            try
            {
                ServiciosCatalogos servicio = new ServiciosCatalogos();
                Medida resp = servicio.ObtenerObjeto<Medida>(id);

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
        [Route("api/catalogo/medida")]
        public IHttpActionResult MedidaGrabar(Medida dato)
        {
            try
            {
                ServiciosCatalogos servicio = new ServiciosCatalogos();
                servicio.MedidaGrabar(dato);

                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpPost]
        [Route("api/catalogo/medida/eliminar/{id}")]
        public IHttpActionResult MedidaEliminar(int id)
        {
            try
            {
                ServiciosCatalogos servicio = new ServiciosCatalogos();
                servicio.MedidaEliminar(id);

                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }



        [HttpGet]
        [Route("api/catalogo/grupoorden")]
        public IHttpActionResult ProductoGrupoOrden()
        {
            try
            {
                ServiciosCatalogos servicio = new ServiciosCatalogos();
                List<ProductoGrupoOrden> resp = servicio.Listar<ProductoGrupoOrden>().ToList<ProductoGrupoOrden>();


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
        [Route("api/catalogo/grupoorden/{id}")]
        public IHttpActionResult ProductoGrupoOrden(int id)
        {
            try
            {
                ServiciosCatalogos servicio = new ServiciosCatalogos();
                ProductoGrupoOrden resp = servicio.ObtenerObjeto<ProductoGrupoOrden>(id);

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
        [Route("api/catalogo/grupoorden")]
        public IHttpActionResult ProductoGrupoOrdenGrabar(ProductoGrupoOrden dato)
        {
            try
            {
                ServiciosCatalogos servicio = new ServiciosCatalogos();
                ProductoGrupoOrden resp = servicio.ProductoGrupoOrdenGrabar(dato);

                return Ok(resp);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpPost]
        [Route("api/catalogo/grupoorden/eliminar/{id}")]
        public IHttpActionResult ProductoGrupoOrdenEliminar(int id)
        {
            try
            {
                ServiciosCatalogos servicio = new ServiciosCatalogos();
                servicio.ProductoGrupoOrdenEliminar(id);

                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
