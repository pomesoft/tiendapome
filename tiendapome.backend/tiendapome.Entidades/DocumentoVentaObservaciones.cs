using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace tiendapome.Entidades
{
    [JsonObject]
    public class DocumentoVentaObservaciones : EntidadBase
    {
        [JsonProperty("IdVenta")]
        public virtual int IdVenta { get; set; }
        [JsonProperty("Observaciones")]
        public virtual string Observaciones { get; set; }
        [JsonProperty("Adjunto")]
        public virtual string Adjunto { get; set; }
        [JsonProperty("AdjuntoLink")]
        public virtual string AdjuntoLink { get; set; }

        public DocumentoVentaObservaciones() { }
    }
}
