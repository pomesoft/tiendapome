using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;

using Newtonsoft.Json;

using tiendapome.Entidades;
using tiendapome.Servicios;

namespace tiendapome.API.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class SubcategoriaController : ApiController
    {
        // GET api/subcategoria
        public IHttpActionResult Get()
        {
            ServicioGenerico servicio = new ServicioGenerico();
            List<Subcategoria> resp = servicio.Listar<Subcategoria>();
            if (resp == null)
                return NotFound();
            return Ok(resp);
        }

        // GET api/subcategoria/5
        public IHttpActionResult Get(int id)
        {
            ServiciosTipos servicio = new ServiciosTipos();
            Subcategoria resp = servicio.SubcategoriaObtenerCache(id);
            if (resp == null)
                return NotFound();
            return Ok(resp);
        }

        // POST api/subcategoria
        public void Post([FromBody]string value)
        {
        }

        // PUT api/subcategoria/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/subcategoria/5
        public void Delete(int id)
        {
        }
    }
}
