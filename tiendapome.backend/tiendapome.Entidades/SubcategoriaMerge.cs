using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace tiendapome.Entidades
{
    [JsonObject]
    public class SubcategoriaMerge : EntidadBase
    {
        [JsonProperty("IdSubcategoriaMinorista")]
        public virtual int IdSubcategoriaMinorista { get; set; }
        [JsonProperty("IdSubcategoriaMayorista")]
        public virtual int IdSubcategoriaMayorista { get; set; }
        [JsonProperty("Etiqueta")]
        public virtual string Etiqueta { get; set; }

        public SubcategoriaMerge() { }
    }
}
