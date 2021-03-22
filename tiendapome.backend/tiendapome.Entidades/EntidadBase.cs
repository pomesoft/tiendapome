using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace tiendapome.Entidades
{
    public abstract class EntidadBase
    {
        [JsonProperty("Id")]
        public virtual int Id { get; set; }

        protected EntidadBase()
        {
            Id = -1;
        }

        public override bool Equals(object obj)
        {
            EntidadBase aux = obj as EntidadBase;

            if (object.ReferenceEquals(aux, null))
                return false;

            if (base.Equals(aux))
                return true;
            else
                return this.GetType() == obj.GetType() && this.Id == aux.Id;
        }

        public override int GetHashCode()
        {
            return this.GetType().GetHashCode() ^ Id.GetHashCode();
        }

        public override string ToString()
        {
            return string.Format("{0}", Id);
        }

        public static bool operator ==(EntidadBase obj1, EntidadBase obj2)
        {
            if (object.ReferenceEquals(obj1, obj2))
                return true;

            if (object.ReferenceEquals(obj1, null))
                return obj2.Equals(obj1);
            else
                return obj1.Equals(obj2);
        }

        public static bool operator !=(EntidadBase obj1, EntidadBase obj2)
        {
            return !(obj1 == obj2);
        }
    }
}
