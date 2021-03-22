using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace tiendapome.Entidades
{
    [JsonObject]
    public class PedidoItemProductoDTO : EntidadBase
    {
        [JsonProperty("Cantidad")] 
        public virtual int Cantidad {get;     set;}
        [JsonProperty("Medida")]
        public virtual Medida Medida { get; set; }

        public PedidoItemProductoDTO() { }

        //public PedidoItemProductoDTO(int _cantidad, Medida _medida) 
        //{
        //    this.Cantidad = _cantidad;
        //    this.Medida = _medida;
        //}

    }   
}
