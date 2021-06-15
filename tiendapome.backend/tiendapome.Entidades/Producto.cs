using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace tiendapome.Entidades
{
    public enum TIPO_PRECIO
    {
        POR_PESO = 1,
        POR_PIEZA = 2
    }

    [JsonObject]
    public class Producto : EntidadBaseParametrica
    {
        [JsonProperty("Codigo")]
        public virtual int Codigo { get; set; }

        [JsonProperty("Subcategoria")]
        public virtual Subcategoria Subcategoria { get; set; }

        [JsonProperty("Peso")]
        public virtual decimal Peso { get; set; }

        [JsonProperty("TipoPrecio")]
        public virtual int TipoPrecio { get; set; }
        
        [JsonProperty("PrecioUnitario")]
        public virtual decimal PrecioUnitario { get; set; }

        [JsonProperty("PrecioUnitarioFinal")]
        public virtual decimal PrecioUnitarioFinal { get; set; }

        [JsonProperty("PrecioUnitarioFinalSinDescuento")]
        public virtual decimal PrecioUnitarioFinalSinDescuento { get; set; }
        
        [JsonProperty("PrecioUnitarioProcesado")]
        public virtual decimal PrecioUnitarioProcesado { get; set; }

        [JsonProperty("MonedaVenta")]
        public virtual string MonedaVenta { get; set; }

        [JsonProperty("ListaPrecio")]
        public virtual ListaPrecio ListaPrecio { get; set; }

        [JsonProperty("Ubicacion")]
        public virtual int Ubicacion { get; set; }

        [JsonProperty("StockPropio")]
        public virtual bool StockPropio { get; set; }

        [JsonProperty("Foto")]
        public virtual string Foto { get; set; }

        [JsonProperty("FotoLink")]
        public virtual string FotoLink { get; set; }

        [JsonProperty("Etiquetas")]
        public virtual string Etiquetas { get; set; }

        [JsonProperty("ProductoPedido")]
        public virtual bool ProductoPedido { get; set; }

        [JsonProperty("CantidadPedido")]
        public virtual int CantidadPedido { get; set; }
        [JsonProperty("IdDocumentoVenta")]
        public virtual int IdDocumentoVenta { get; set; }

        [JsonProperty("ObservacionesPedido")]
        public virtual string ObservacionesPedido { get; set; }

        [JsonProperty("ProductoStock")]
        public virtual IList<ProductoStock> ProductoStock { get; set; }

        [JsonProperty("GrupoOrden")]
        public virtual ProductoGrupoOrden GrupoOrden { get; set; }



        [JsonProperty("NroFila")]
        public virtual int NroFila { get; set; }

        [JsonProperty("Orden")]
        public virtual string Orden 
        {
            get
            {
                if (this.GrupoOrden != null && this.GrupoOrden.Descripcion.Trim().Length > 0)
                    return string.Format("{0}{1}", this.GrupoOrden.Descripcion, this.Codigo.ToString());
                else
                    return string.Format("ZZZZZZZZZ{0}", this.Codigo.ToString());
            }
            set { }
        }

        [JsonProperty("StockReal")]
        public virtual int StockReal 
        {
            get 
            {
                int _stock = 0;
                if (this.ProductoStock != null)
                    this.ProductoStock.ToList<ProductoStock>().ForEach(delegate(ProductoStock item) { _stock += item.Stock; });
                return _stock;
            }
            set { }
        }
        [JsonProperty("StockReservado")]
        public virtual int StockReservado
        {
            get
            {
                int _reservado = 0;
                if (this.ProductoStock != null)
                    this.ProductoStock.ToList<ProductoStock>().ForEach(delegate(ProductoStock item) { _reservado += item.Reservado; });
                return _reservado;
            }
            set { }
        }
        [JsonProperty("Stock")]
        public virtual int Stock
        {
            get
            {
                int _reservado = 0;
                int _stock = 0;
                if (this.ProductoStock != null)
                    this.ProductoStock.ToList<ProductoStock>().ForEach(delegate(ProductoStock item) 
                    {
                        _stock += item.Stock; 
                        _reservado += item.Reservado; 
                    });
                return (_stock - _reservado);
            }
            set { }
        }

        [JsonProperty("Path")]
        public virtual string Path
        {
            get 
            {
                string carpetaTipo = string.Empty;
                string carpetaCategoria = string.Empty;
                string carpetaSubcategoria = string.Empty;

                if (this.Subcategoria != null)
                {
                    carpetaSubcategoria = string.IsNullOrEmpty(this.Subcategoria.Carpeta) ? string.Empty : this.Subcategoria.Carpeta + "/";
                    if (this.Subcategoria.Categoria != null)
                    {
                        carpetaCategoria = string.IsNullOrEmpty(this.Subcategoria.Categoria.Carpeta) ? string.Empty : this.Subcategoria.Categoria.Carpeta + "/";
                        if (this.Subcategoria.Categoria.Tipo != null)
                            carpetaTipo = string.IsNullOrEmpty(this.Subcategoria.Categoria.Tipo.Carpeta) ? string.Empty : this.Subcategoria.Categoria.Tipo.Carpeta + "/";
                    }
                }
                return string.Format("/{0}{1}{2}", carpetaTipo, carpetaCategoria, carpetaSubcategoria);
            }
            set { }
        }

        [JsonProperty("IdTipo")]
        public virtual int IdTipo 
        {
            get { return this.Subcategoria != null && this.Subcategoria.Categoria != null ? this.Subcategoria.Categoria.Tipo.Id : -1; }
            set { }
        }
        
        [JsonProperty("IdCategoria")]
        public virtual int IdCategoria
        {
            get { return this.Subcategoria != null && this.Subcategoria.Categoria != null ? this.Subcategoria.Categoria.Id : -1; }
            set { }
        }

        [JsonProperty("DescripcionTipo")]
        public virtual string DescripcionTipo
        {
            get { return this.Subcategoria != null && this.Subcategoria.Categoria != null ? this.Subcategoria.Categoria.Tipo.Descripcion : string.Empty; }
            set { }
        }

        [JsonProperty("DescripcionCategoria")]
        public virtual string DescripcionCategoria
        {
            get { return this.Subcategoria != null && this.Subcategoria.Categoria != null ? this.Subcategoria.Categoria.Descripcion: string.Empty; }
            set { }
        }

        [JsonProperty("DescripcionSubcategoria")]
        public virtual string DescripcionSubcategoria
        {
            get { return this.Subcategoria != null  ? this.Subcategoria.Descripcion : string.Empty; }
            set { }
        }

        [JsonProperty("PrecioPorPeso")]
        public virtual bool PrecioPorPeso
        {
            get { return this.TipoPrecio == (int)TIPO_PRECIO.POR_PESO; }
            set { }
        }
        [JsonProperty("PrecioPorPieza")]
        public virtual bool PrecioPorPieza
        {
            get { return this.TipoPrecio == (int)TIPO_PRECIO.POR_PIEZA; }
            set { }
        }
        [JsonProperty("MostrarMedidas")]
        public virtual bool MostrarMedidas
        {
            get { return (this.Subcategoria != null && this.Subcategoria.MostrarMedidas.HasValue ? this.Subcategoria.MostrarMedidas.Value : false); }
            set { }
        }

        public Producto() 
        {
            this.StockPropio = true;
            this.ProductoStock = new List<ProductoStock>();
        }

        public void Validar()
        {
            StringBuilder sb = new StringBuilder();

            if (this.Subcategoria == null)
                sb.AppendLine("Falta indicar Suibcategoria.");

        }
    }
}
