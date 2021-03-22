using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace tiendapome.Entidades
{
    public enum ESTADOS_RESPONSE
    {
        OK_ = 1,
        ERROR_ = 2
    }
    [JsonObject]
    public class MensajeResponse
    {
        [JsonProperty("Estado")]
        public virtual int Estado { get; set; }
        [JsonProperty("Mensaje")]
        public virtual string Mensaje { get; set; }

        public MensajeResponse() { }

        public MensajeResponse(int _estado, string _mensaje) 
        {
            this.Estado = _estado;
            this.Mensaje = _mensaje;
        }
    }
}
