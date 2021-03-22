using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace tiendapome.Entidades
{
    [JsonObject]
    public class PedidoItemDTO : EntidadBase
    {
        [JsonProperty("CodigoProducto")] 
        public virtual int CodigoProducto { get; set; }
        [JsonProperty("Cantidad")]
        public virtual int Cantidad { get; set; }
        [JsonProperty("Observaciones")]
        public virtual string Observaciones { get; set; }
        [JsonProperty("Items")]
        public virtual List<PedidoItemProductoDTO> ItemProductos { get; set; }

        public PedidoItemDTO() 
        {
            this.ItemProductos = new List<PedidoItemProductoDTO>();
        }

        //public PedidoItemDTO(int _codigoProducto)
        //{
        //    this.CodigoProducto = _codigoProducto;
        //    this.ItemProductos = new List<PedidoItemProductoDTO>();
        //}

        public void AgregarItem(int _cantidad, Medida _medida)
        {
            PedidoItemProductoDTO item = new PedidoItemProductoDTO()
            {
                Cantidad = _cantidad,
                Medida = _medida
            };
            this.ItemProductos.Add(item);
        }
    }
}
