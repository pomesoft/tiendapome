using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace tiendapome.Entidades
{
    [JsonObject]
    public class ProductoList
    {
        [JsonProperty("TotalFilas")]
        public virtual int TotalFilas { get; set; }

        [JsonProperty("Productos")]
        public virtual List<Producto> Productos { get; set; }

        public ProductoList() { }
    }
}
