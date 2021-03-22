using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace tiendapome.Entidades
{
    [JsonObject]
    public class Medida : EntidadBaseParametrica
    {
        [JsonProperty("Observaciones")]
        public virtual string Observaciones { get; set; }

        public Medida() { }
    }
}
