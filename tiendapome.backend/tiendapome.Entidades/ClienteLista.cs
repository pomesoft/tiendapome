using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace tiendapome.Entidades
{
    [JsonObject]
    public class ClienteLista : EntidadBase
    {
        [JsonProperty("IdCliente")]
        public virtual int IdCliente { get; set; }

        [JsonProperty("ListaPrecio")]
        public virtual ListaPrecio ListaPrecio { get; set; }

        [JsonProperty("ListaPrecioCliente")]
        public virtual ListaPrecioCliente ListaPrecioCliente { get; set; }

        public ClienteLista() { }
    }
}
