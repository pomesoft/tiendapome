using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace tiendapome.Entidades
{


    [JsonObject]
    public class TipoMovimientoStock : EntidadBaseParametrica
    {
        [JsonProperty("Tipo")]
        public virtual int Tipo { get; set; }

        public TipoMovimientoStock() { }
    }
}
