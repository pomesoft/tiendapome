using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;


namespace tiendapome.Entidades
{
    [JsonObject]
    public class PedidoItemProducto : EntidadBase
    {
        [JsonProperty("IdPedidoItem")]
        public virtual int IdPedidoItem { get; set; }        
        [JsonProperty("IdProductoStock")]
        public virtual int IdProductoStock { get; set; }
        [JsonProperty("Medida")]
        public virtual Medida Medida { get; set; }
        [JsonProperty("Cantidad")]
        public virtual int Cantidad { get; set; }
        [JsonProperty("IdEstadoItem")]
        public virtual int IdEstadoItem { get; set; }
        [JsonProperty("StockReservado")]
        public virtual int StockReservado { get; set; }
        [JsonProperty("StockDisponible")]
        public virtual int? StockDisponible { get; set; }

        public PedidoItemProducto() { }
    }
}
