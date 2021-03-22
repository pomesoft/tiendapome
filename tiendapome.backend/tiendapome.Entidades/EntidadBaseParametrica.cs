using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace tiendapome.Entidades
{

    public class EntidadBaseParametrica : EntidadBase
    {
        [JsonProperty("Descripcion")]
        public virtual string Descripcion { get; set; }
        [JsonProperty("Vigente")]
        public virtual bool Vigente { get; set; }
        
        public virtual string IdDescripcion
        {
            set { }
            get { return string.Format("{0} - {1}", Id.ToString(), Descripcion); }
        }

        public EntidadBaseParametrica()
        {
            this.Descripcion = string.Empty;
        }

        public EntidadBaseParametrica(int id, string descripcion)
        {
            this.Id = id;
            this.Descripcion = descripcion;
        }

        public override string ToString()
        {
            return string.Format("{0}", Descripcion);
        }

        public virtual void Validar()
        {
            if (Descripcion.Trim().Length == 0)
                throw new ApplicationException("Debe ingresar descripción.");
            
        }
    }
}