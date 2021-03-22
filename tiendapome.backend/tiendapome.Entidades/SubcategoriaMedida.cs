using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace tiendapome.Entidades
{
    [JsonObject]
    public class SubcategoriaMedida : EntidadBase
    {
        [JsonProperty("IdSubcategoria")]
        public virtual int IdSubcategoria { get; set; }
        [JsonProperty("Medida")]
        public virtual Medida Medida { get; set; }

        public SubcategoriaMedida() { }
    }
}
