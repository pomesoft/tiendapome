using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace tiendapome.Entidades
{
    [JsonObject]
    public class CotizacionDolar : EntidadBase
    {
        [JsonProperty("Cotizacion")]
        public virtual decimal Cotizacion { get; set; }
        [JsonProperty("Fecha")]
        public virtual DateTime Fecha { get; set; }
        [JsonProperty("FechaToString")]
        public virtual string FechaToString 
        {
            get { return this.Fecha.ToString("dd/MM/yyyy"); }
            set { } 
        }

        public CotizacionDolar() { }
    }
}
