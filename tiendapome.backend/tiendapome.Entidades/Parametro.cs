using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace tiendapome.Entidades
{
    [JsonObject]
    public class Parametro : EntidadBaseParametrica
    {
        [JsonProperty("Clave")]
        public virtual string Clave { get; set; }

        [JsonProperty("Valor")]
        public virtual string Valor { get; set; }

        [JsonProperty("Editable")]
        public virtual Boolean Editable { get; set; }

        public Parametro() { }
    }
}
