using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace tiendapome.Entidades
{
    [JsonObject]
    public class ListaPrecioCliente : EntidadBaseParametrica
    {
        [JsonProperty("Codigo")]
        public virtual string Codigo { get; set; }

        [JsonProperty("Precio")]
        public virtual decimal Precio { get; set; }
        
        [JsonProperty("ListaPrecio")]
        public virtual ListaPrecio ListaPrecio { get; set; }

        public ListaPrecioCliente() { }
    }
}
