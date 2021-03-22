using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace tiendapome.Entidades
{
    [JsonObject]
    public class ProductoStockMovimiento : EntidadBase
    {
        [JsonProperty("IdProductoStock")]
        public virtual int IdProductoStock { get; set; }
        [JsonProperty("Fecha")]
        public virtual DateTime Fecha { get; set; }
        [JsonProperty("IdTipoMovimiento")]
        public virtual int IdTipoMovimiento { get; set; }
        [JsonProperty("Cantidad")]
        public virtual int Cantidad { get; set; }
        [JsonProperty("Observaciones")]
        public virtual string Observaciones { get; set; }
        
        public ProductoStockMovimiento() { }
    }
}
