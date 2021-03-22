using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace tiendapome.Entidades
{
    [JsonObject]
    public class Subcategoria : EntidadBaseParametrica
    {
        [JsonIgnore]
        public virtual Categoria Categoria { get; set; }

        [JsonProperty("Carpeta")]
        public virtual string Carpeta { get; set; }
                
        [JsonProperty("CantidadProductos")]
        public virtual int CantidadProductos { get; set; }

        [JsonProperty("MostrarMedidas")]
        public virtual bool? MostrarMedidas { get; set; }

        [JsonProperty("Orden")]
        public virtual int Orden { get; set; }

        [JsonProperty("Visible")]
        public virtual bool Visible { get; set; }

        [JsonProperty("Medidas")]
        public virtual IList<SubcategoriaMedida> Medidas { get; set; }

        [JsonProperty("IdCategoria")]
        public virtual int IdCategoria { get; set; }

        [JsonProperty("DescripcionFull")]
        public virtual string DescripcionFull 
        {
            get 
            {
                string _tipo = this.Categoria != null && this.Categoria.Tipo != null ? this.Categoria.Tipo.Descripcion : string.Empty;
                string _categoria = this.Categoria != null ? this.Categoria.Descripcion : string.Empty;
                string _subcategoria = this.Descripcion != null ? this.Descripcion : string.Empty;

                string descFull = string.Empty;

                if (_tipo.Equals(_categoria) && _categoria.Equals(_subcategoria))
                    descFull = _subcategoria;
                else
                    descFull = string.Format("{0} - {1} - {2}", _tipo, _categoria, _subcategoria);

                return descFull;
            }
            set { } 
        }

        public Subcategoria() 
        {
            this.Medidas = new List<SubcategoriaMedida>();
        }
    }
}
