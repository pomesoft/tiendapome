using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace tiendapome.Entidades
{
    [JsonObject]
    public class Cliente : EntidadBase
    {
        [JsonProperty("Rol")]
        public virtual Rol Rol { get; set; }

        [JsonProperty("Email")]
        public virtual string Email { get; set; }

        [JsonProperty("Codigo")]
        public virtual string Clave { get; set; }

        [JsonProperty("Apellido")]
        public virtual string Apellido { get; set; }

        [JsonProperty("Nombre")]
        public virtual string Nombre { get; set; }

        [JsonProperty("Celular")]
        public virtual string Celular { get; set; }

        [JsonProperty("IdentificacionTributaria")]
        public virtual string IdentificacionTributaria { get; set; }

        [JsonProperty("RazonSocial")]
        public virtual string RazonSocial { get; set; }

        [JsonProperty("NombreFantasia")]
        public virtual string NombreFantasia { get; set; }

        [JsonProperty("Vigente")]
        public virtual bool Vigente { get; set; }
        
        [JsonProperty("ComisionApp")]
        public virtual int ComisionApp { get; set; }

        [JsonProperty("Direccion")]
        public virtual string Direccion { get; set; }

        [JsonProperty("Localidad")]
        public virtual string Localidad { get; set; }

        [JsonProperty("Provincia")]
        public virtual Provincia Provincia { get; set; }

        [JsonProperty("CodigoPostal")]
        public virtual string CodigoPostal { get; set; }

        [JsonProperty("SituacionIVA")]
        public virtual SituacionIVA SituacionIVA { get; set; }

        [JsonProperty("Observaciones")]
        public virtual string Observaciones { get; set; }

        [JsonProperty("AsignarListaMayorista")]
        public virtual bool AsignarListaMayorista { get; set; }

        [JsonProperty("ListasPrecio")]
        public virtual IList<ClienteLista> ListasPrecio { get; set; }

        [JsonProperty("ListasPrecioAsignada")]
        public virtual bool ListasPrecioAsignada
        {
            get { return this.ListasPrecio.Count > 0; }
            set { }
        }

        [JsonProperty("IdProvincia")]
        public virtual int IdProvincia
        {
            get { return this.Provincia != null ? this.Provincia.Id : -1; }
            set { }
        }

        [JsonProperty("IdSituacionIVA")]
        public virtual int IdSituacionIVA
        {
            get { return this.SituacionIVA != null ? this.SituacionIVA.Id : -1; }
            set { }
        }

        [JsonProperty("ClienteList")]
        public virtual string ClienteList
        { 
            get 
            {
                string texto = string.Format("({0}) - {1} {2} - {3} - {4}",
                    this.Id.ToString(),
                    this.Nombre != null ? this.Nombre : string.Empty,
                    this.Apellido != null ? this.Apellido : string.Empty,
                    this.NombreFantasia != null ? this.NombreFantasia : string.Empty,
                    this.Email);
                return texto; 
            }
            set { }
        }

        public Cliente() 
        {
            this.ListasPrecio = new List<ClienteLista>();
            this.ListasPrecioAsignada = false;
        }
                
    }
}
