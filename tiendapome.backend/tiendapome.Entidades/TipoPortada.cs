using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace tiendapome.Entidades
{
    [JsonObject]
    public class TipoPortada : EntidadBaseParametrica
    {
        [JsonProperty("IdTipo")]
        public virtual int IdTipo { get; set; }

        [JsonProperty("Foto")]
        public virtual string Foto { get; set; }

        [JsonProperty("Visible")]
        public virtual bool Visible { get; set; }

        public TipoPortada() { }
    }
}
