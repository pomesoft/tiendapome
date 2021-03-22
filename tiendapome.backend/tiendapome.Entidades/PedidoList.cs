using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace tiendapome.Entidades
{
    [JsonObject]
    public class PedidoList
    {
        [JsonProperty("TotalFilas")]
        public virtual int TotalFilas { get; set; }

        [JsonProperty("Pedidos")]
        public virtual List<Pedido> Pedidos { get; set; }

        public PedidoList() { }
    }
}
