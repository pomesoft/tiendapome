using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace tiendapome.Entidades
{
    [JsonObject]
    public class PedidoDTO : EntidadBase
    {
        [JsonProperty("IdCliente")]
        public virtual int IdCliente { get; set; }
        [JsonProperty("IdPedidoMinorista")]
        public virtual int IdPedidoMinorista { get; set; }
        [JsonProperty("NumeroPedidoMinorista")]
        public virtual int NumeroPedidoMinorista { get; set; }
        [JsonProperty("Items")]        
        public virtual List<PedidoItemDTO> Items { get; set; }

        public PedidoDTO() 
        {
            this.Items = new List<PedidoItemDTO>();
        }

    }
}
