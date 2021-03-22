using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace tiendapome.Entidades
{
    public enum TIPOS_COMPROBANTE
    {
        NOTA_DE_PEDIDO_ = 1,
        NOTA_DE_CREDITO_ = 2,
        AJUSTTE_CTACTE_POSITIVO_ = 3,
        AJUSTTE_CTACTE_NEGATIVO_ = 4,
        RECIBO_ = 5
    }

    [JsonObject]
    public class VentaTipoComprobante : EntidadBaseParametrica
    {
        [JsonProperty("Abreviado")]
        public virtual string Abreviado { get; set; }
        [JsonProperty("EsDebe")]
        public virtual bool EsDebe { get; set; }

        public VentaTipoComprobante() { }
    }
}
