using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace tiendapome.Entidades
{
    public enum ESTADOS
    {
        INGRESADO_      = 1,
        SOLICITADO_     = 2,
        EN_PROCESO_     = 3,
        FINALIZADO_     = 4,
        ENTREGADO_      = 5,
        RECEPCIONADO_   = 6,
        CANCELADO_      = 7,
        PROVEEDOR_      = 8,
        FACTURADO_      = 9
    }

    [JsonObject]
    public class Estado : EntidadBaseParametrica
    {
        [JsonProperty("Chequed")]
        public virtual bool Chequed { get; set; }

        [JsonProperty("Orden")]
        public virtual int Orden { get; set; }

        [JsonProperty("PorximoEstado")]
        public virtual int PorximoEstado 
        {
            get 
            {
                int idReturn = -1;
                switch (this.Id)
                { 
                    case (int)ESTADOS.INGRESADO_:
                        idReturn = (int)ESTADOS.SOLICITADO_;
                        break;
                    case (int)ESTADOS.SOLICITADO_:
                        idReturn = (int)ESTADOS.EN_PROCESO_;
                        break;
                    case (int)ESTADOS.EN_PROCESO_:
                        idReturn = (int)ESTADOS.FINALIZADO_;
                        break;
                    case (int)ESTADOS.FINALIZADO_:
                        idReturn = (int)ESTADOS.FACTURADO_;
                        break;
                }
                return idReturn;
            }
            set { }
        }
        
        public Estado() { }
    }
}
