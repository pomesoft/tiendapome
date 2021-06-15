using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace tiendapome.Entidades
{
    [JsonObject]
    public class SubcategoriaDescuento : EntidadBase
    {
        [JsonProperty("IdSubcategoria")]
        public virtual int IdSubcategoria{ get; set; }
        [JsonProperty("PorcentajeDescuento")]
        public virtual decimal PorcentajeDescuento { get; set; }
        
        public SubcategoriaDescuento() { }
    }
}
