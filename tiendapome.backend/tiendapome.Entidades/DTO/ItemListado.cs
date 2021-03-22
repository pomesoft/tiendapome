using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace tiendapome.Entidades
{
    [JsonObject]
    public class ItemListado : EntidadBase
    {

        [JsonProperty("Campo1")]
        public virtual string Campo1 { get; set; }
        [JsonProperty("Campo2")]
        public virtual string Campo2 { get; set; }
        [JsonProperty("Campo3")]
        public virtual string Campo3 { get; set; }
        [JsonProperty("Campo4")]
        public virtual string Campo4 { get; set; }
        [JsonProperty("Campo5")]
        public virtual string Campo5 { get; set; }
        [JsonProperty("Campo6")]
        public virtual string Campo6 { get; set; }
        [JsonProperty("Campo7")]
        public virtual string Campo7 { get; set; }
        [JsonProperty("Campo8")]
        public virtual string Campo8 { get; set; }
        [JsonProperty("Campo9")]
        public virtual string Campo9 { get; set; }
        [JsonProperty("Campo10")]
        public virtual string Campo10 { get; set; }

        public ItemListado() { }

    }
}
