    using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace tiendapome.Entidades
{
    [JsonObject]
    public class Tipo : EntidadBaseParametrica
    {
        [JsonProperty("Carpeta")]
        public virtual string Carpeta { get; set; }

        [JsonProperty("Foto")]
        public virtual string Foto { get; set; }

        [JsonProperty("Visible")]
        public virtual bool Visible { get; set; }

        [JsonProperty("Orden")]
        public virtual int Orden { get; set; }

        [JsonProperty("Categorias")]
        public virtual IList<Categoria> Categorias { get; set;  }

        [JsonProperty("CantidadProductos")]
        public virtual int CantidadProductos { get; set; }


        public Tipo() { }
    }
}
