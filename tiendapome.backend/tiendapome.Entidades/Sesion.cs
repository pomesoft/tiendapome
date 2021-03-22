using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace tiendapome.Entidades
{
    [JsonObject]
    public class Sesion: EntidadBase
    {
        [JsonProperty("IdCliente")]
        public virtual int IdCliente { get; set; }
        [JsonIgnore]
        public virtual string Token { get; set; }
        [JsonProperty("Device")]
        public virtual string Device{ get; set; }
        
        public Sesion() { }
    }
}
