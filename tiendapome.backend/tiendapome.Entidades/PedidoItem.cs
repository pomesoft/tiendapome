using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace tiendapome.Entidades
{
    [JsonObject]
    public class PedidoItem : EntidadBase
    {
        [JsonProperty("IdPedido")]
        public virtual int IdPedido { get; set; }

        [JsonProperty("Producto")]
        public virtual Producto Producto { get; set; }
        
        [JsonProperty("Precio")]
        public virtual decimal Precio { get; set; }

        [JsonProperty("Cantidad")]
        public virtual int Cantidad { get; set; }

        [JsonProperty("Porcentaje")]
        public virtual decimal Porcentaje { get; set; }

        [JsonProperty("Subtotal")]
        public virtual decimal Subtotal { get; set; }

        [JsonProperty("EstadoItem")]
        public virtual int? EstadoItem { get; set; }

        [JsonProperty("Observaciones")]
        public virtual string Observaciones { get; set; }

        [JsonProperty("ItemProductos")]
        public virtual IList<PedidoItemProducto> ItemProductos { get; set; }

        [JsonProperty("MostrarMedidas")]
        public virtual bool MostrarMedidas { get; set; }

        [JsonProperty("Confirmado")]
        public virtual bool Confirmado
        {
            get { return this.EstadoItem.HasValue && this.EstadoItem.Value.Equals(1); } 
            set { } 
        }

        [JsonProperty("SinStock")]
        public virtual bool SinStock
        {
            get { return this.EstadoItem.HasValue && this.EstadoItem.Value.Equals(2); }
            set { }
        }

        [JsonProperty("VerificarStock")]
        public virtual bool VerificarStock
        {
            get { return this.EstadoItem.HasValue && this.EstadoItem.Value.Equals(3); }
            set { }
        }

        [JsonProperty("Modificado")]
        public virtual bool Modificado { get; set; }

        [JsonProperty("NroFila")]
        public virtual int NroFila { get; set; }

        public PedidoItem()
        {
            this.Modificado = false;
            this.ItemProductos = new List<PedidoItemProducto>();
        }
    }
}
