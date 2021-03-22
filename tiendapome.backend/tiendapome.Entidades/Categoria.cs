using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace tiendapome.Entidades
{
    [JsonObject]
    public class Categoria : EntidadBaseParametrica
    {
        [JsonIgnore]
        public virtual Tipo Tipo { get; set; }

        [JsonProperty("Carpeta")]
        public virtual string Carpeta { get; set; }

        [JsonProperty("Foto")]
        public virtual string Foto { get; set; }

        [JsonProperty("Subcategorias")]
        public virtual IList<Subcategoria> Subcategorias { get; set; }

        [JsonProperty("CantidadProductos")]
        public virtual int CantidadProductos { get; set; }

        [JsonProperty("Orden")]
        public virtual int Orden { get; set; }

        [JsonProperty("Visible")]
        public virtual bool Visible { get; set; }

        [JsonProperty("IdTipo")]
        public virtual int IdTipo { get; set; }

        public Categoria() { }
    }
}
