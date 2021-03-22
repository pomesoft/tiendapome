using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace tiendapome.Entidades
{
    [JsonObject]
    public class DocumentoVentaList
    {
        [JsonProperty("TotalFilas")]
        public virtual int TotalFilas { get; set; }

        [JsonProperty("DocumentosVenta")]
        public virtual List<DocumentoVenta> DocumentosVenta { get; set; }

        public DocumentoVentaList() { }
    }
}
