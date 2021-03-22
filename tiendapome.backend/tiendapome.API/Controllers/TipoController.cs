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
    public class TipoController : ApiController
    {
        // GET api/tipo
        public IHttpActionResult Get()
        {
            try
            {
                //tiene  que haber dos metodos de estos, uno para el carrito que guarda en cache 
                //y otro para el abm que va a la base directamente
                ServiciosTipos servicio = new ServiciosTipos();
                List<Tipo> resp = servicio.TipoListar(false);
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

        // GET api/tipo
        public IHttpActionResult Get(int id)
        {
            ServiciosTipos servicio = new ServiciosTipos();
            Tipo resp = servicio.TipoObtener(id);
            if (resp == null)
                return NotFound();
            return Ok(resp);
        }

        [HttpGet]
        [Route("api/tipo/listarabm")]
        public IHttpActionResult GetTipoABM()
        {
            try
            {
                //tiene  que haber dos metodos de estos, uno para el carrito que guarda en cache 
                //y otro para el abm que va a la base directamente
                //este metodo devuelve las medidas de cada subcategoria
                ServiciosTipos servicio = new ServiciosTipos();
                List<Tipo> resp = servicio.TipoListarABM();

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

        // POST api/parametro
        public IHttpActionResult Post([FromBody]Tipo datos)
        {
            try
            {
                ServiciosTipos servicio = new ServiciosTipos();
                Tipo resp = servicio.TipoGrabar(datos);
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
        [Route("api/tipo/eliminar")]
        public IHttpActionResult PostTipoEliminar(int id)
        {
            try
            {
                ServiciosTipos servicio = new ServiciosTipos();
                servicio.TipoEliminar(id);

                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("api/categoria/")]
        public IHttpActionResult PostCategoria([FromBody]Categoria datos)
        {
            try
            {
                ServiciosTipos servicio = new ServiciosTipos();
                servicio.CategoriaGrabar(datos);

                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("api/categoria/eliminar")]
        public IHttpActionResult PostCategoriaEliminar(int id)
        {
            try
            {
                ServiciosTipos servicio = new ServiciosTipos();
                servicio.CategoriaEliminar(id);

                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("api/subcategoria/")]
        public IHttpActionResult PostSubcategoria([FromBody]Subcategoria datos)
        {
            try
            {
                ServiciosTipos servicio = new ServiciosTipos();
                servicio.SubcategoriaGrabar(datos);

                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("api/subcategoria/eliminar")]
        public IHttpActionResult PostSubcategoriaEliminar(int id)
        {
            try
            {
                ServiciosTipos servicio = new ServiciosTipos();
                servicio.SubcategoriaEliminar(id);

                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpGet]
        [Route("api/tipo/listarsubcategoriasmerge")]
        public IHttpActionResult GetSubcategoriasMerge()
        {
            try
            {
                //tiene  que haber dos metodos de estos, uno para el carrito que guarda en cache 
                //y otro para el abm que va a la base directamente
                //este metodo devuelve las medidas de cada subcategoria
                ServiciosTipos servicio = new ServiciosTipos();
                List<SubcategoriaMerge> resp = servicio.Listar<SubcategoriaMerge>();

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
    }
}
