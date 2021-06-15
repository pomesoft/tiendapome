using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace tiendapome.Entidades
{
    [JsonObject]
    public class MovimientoStockDetalle : EntidadBase
    {
        [JsonProperty("Tipo")] public virtual string Tipo { get; set; }
        [JsonProperty("Categoria")] public virtual string Categoria { get; set; }
        [JsonProperty("Subcategoria")] public virtual string Subcategoria { get; set; }
        [JsonProperty("Codigo")] public virtual string Codigo { get; set; }
        [JsonProperty("IdProductoStock")] public virtual string IdProductoStock { get; set; }
        [JsonProperty("Orden")] public virtual string Orden { get; set; }
        [JsonProperty("Movimiento")] public virtual string Movimiento { get; set; }
        [JsonProperty("Fecha")] public virtual string Fecha { get; set; }
        [JsonProperty("Pedido")] public virtual string Pedido { get; set; }
        [JsonProperty("Observaciones")] public virtual string Observaciones { get; set; }
        [JsonProperty("IdMedida")] public virtual string IdMedida { get; set; }
        [JsonProperty("Medida")] public virtual string Medida { get; set; }
        [JsonProperty("Cantidad")] public virtual string Cantidad { get; set; }
        public MovimientoStockDetalle() { }
    }
}
