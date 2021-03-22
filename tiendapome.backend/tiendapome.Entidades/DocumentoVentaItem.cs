using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace tiendapome.Entidades
{
    [JsonObject]
    public class DocumentoVentaItem : EntidadBase
    {
        [JsonProperty("IdVenta")]
        public virtual int IdVenta { get; set; }
        [JsonProperty("NroItem")]
        public virtual int NroItem { get; set; }
        [JsonProperty("IdProductoStock")]
        public virtual int IdProductoStock { get; set; }
        [JsonProperty("IdPedidoItemProducto")]
        public virtual int IdPedidoItemProducto { get; set; }
        [JsonProperty("Descripcion")]
        public virtual string Descripcion { get; set; }
        [JsonProperty("Cantidad")]
        public virtual int Cantidad { get; set; }
        [JsonProperty("PrecioUnitario")]
        public virtual decimal PrecioUnitario { get; set; }
        [JsonProperty("Precio")]
        public virtual decimal Precio { get; set; }

        [JsonProperty("PrecioUnitarioToString")]
        public virtual string PrecioUnitarioToString 
        {
            get { return string.Format("{0:0.00}", this.PrecioUnitario); }
            set { }
        }
        [JsonProperty("PrecioToString")]
        public virtual string PrecioToString
        {
            get { return string.Format("{0:0.00}", this.Precio); }
            set { }
        }

        public DocumentoVentaItem() { }
    }
}
