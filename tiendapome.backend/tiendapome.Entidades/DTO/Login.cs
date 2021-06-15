using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace tiendapome.Entidades
{
    [JsonObject]
    public class Login : EntidadBase
    {

        [JsonProperty("Usuario")]
        public virtual string Usuario { get; set; }
        [JsonProperty("Clave")]
        public virtual string Clave { get; set; }
        public Login() { }

    }
}
