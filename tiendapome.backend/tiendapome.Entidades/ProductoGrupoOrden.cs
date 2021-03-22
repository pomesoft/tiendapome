using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace tiendapome.Entidades
{
    public enum GRUPOS_ORDEN
    {
        DEFAULT_ = 1
    }

    [JsonObject]
    public class ProductoGrupoOrden: EntidadBaseParametrica
    {
        public ProductoGrupoOrden() { }
    }
}
