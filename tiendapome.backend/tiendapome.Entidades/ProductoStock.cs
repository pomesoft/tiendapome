using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace tiendapome.Entidades
{
    [JsonObject]
    public class ProductoStock : EntidadBase
    {
        [JsonProperty("IdProducto")]
        public virtual int IdProducto { get; set; }
        [JsonProperty("Medida")]
        public virtual Medida Medida { get; set; }
        [JsonProperty("Stock")]
        public virtual int Stock { get; set; }
        [JsonProperty("Reservado")]
        public virtual int Reservado { get; set; }
        [JsonProperty("CantidadPedido")]
        public virtual int CantidadPedido { get; set; }
        [JsonProperty("StockDisponible")]
        public virtual int StockDisponible 
        {
            get { return this.Stock - this.Reservado; }
            set { } 
        }

        public ProductoStock() { }
    }
}
