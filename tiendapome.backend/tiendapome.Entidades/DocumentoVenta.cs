using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace tiendapome.Entidades
{
    [JsonObject]
    public class DocumentoVenta : EntidadBase
    {        
        [JsonProperty("IdEmpresa")]
        public virtual int IdEmpresa { get; set; }
        [JsonProperty("Usuario")]
        public virtual Cliente Usuario { get; set; }
        [JsonProperty("Cliente")]
        public virtual Cliente Cliente { get; set; }
        [JsonProperty("IdPedido")]
        public virtual int IdPedido { get; set; }
        [JsonProperty("NumeroPedido")]
        public virtual int NumeroPedido { get; set; }
        [JsonProperty("TipoComprobante")]
        public virtual VentaTipoComprobante TipoComprobante { get; set; }        
        [JsonProperty("Letra")]
        public virtual decimal Letra { get; set; }
        [JsonProperty("Sucursal")]
        public virtual int Sucursal { get; set; }
        [JsonProperty("Numero")]
        public virtual int Numero { get; set; }
        [JsonProperty("Fecha")]
        public virtual DateTime Fecha { get; set; }
        [JsonProperty("Vencimiento")]
        public virtual DateTime Vencimiento { get; set; }
        [JsonProperty("Gravado")]
        public virtual decimal Gravado { get; set; }
        [JsonProperty("Descuento")]
        public virtual decimal Descuento { get; set; }
        [JsonProperty("PorcentajeIVA")]
        public virtual decimal PorcentajeIVA { get; set; }
        [JsonProperty("IVA")]
        public virtual decimal IVA { get; set; }
        [JsonProperty("Total")]
        public virtual decimal Total { get; set; }
        [JsonProperty("Pendiente")]
        public virtual decimal Pendiente { get; set; }
        [JsonProperty("Comision")]
        public virtual decimal Comision { get; set; }
        
        [JsonProperty("Efectivo")]
        public virtual decimal Efectivo { get; set; }
        [JsonProperty("EfectivoCotizaDolar")]
        public virtual decimal EfectivoCotizaDolar { get; set; }
        
        [JsonProperty("Dolares")]
        public virtual decimal Dolares { get; set; }
        [JsonProperty("DolaresCotizaDolar")]
        public virtual decimal DolaresCotizaDolar { get; set; }
        
        [JsonProperty("Euros")]
        public virtual decimal Euros { get; set; }
        [JsonProperty("EurosCotizaDolar")]
        public virtual decimal EurosCotizaDolar { get; set; }
        
        [JsonProperty("Cheques")]
        public virtual decimal Cheques { get; set; }
        [JsonProperty("ChequesCotizaDolar")]
        public virtual decimal ChequesCotizaDolar { get; set; }
        
        [JsonProperty("Tarjeta")]
        public virtual decimal Tarjeta { get; set; }
        [JsonProperty("TarjetaCotizaDolar")]
        public virtual decimal TarjetaCotizaDolar { get; set; }
        
        [JsonProperty("MercadoPago")]
        public virtual decimal MercadoPago { get; set; }
        [JsonProperty("MercadoPagoCotizaDolar")]
        public virtual decimal MercadoPagoCotizaDolar { get; set; }
        
        [JsonProperty("DepositoTransferencia")]
        public virtual decimal DepositoTransferencia { get; set; }
        [JsonProperty("DepositoTransferCotizaDolar")]
        public virtual decimal DepositoTransferCotizaDolar { get; set; }
        
        [JsonProperty("RetencionIVA")]
        public virtual decimal RetencionIVA { get; set; }
        [JsonProperty("RetencionGanancia")]
        public virtual decimal RetencionGanancia { get; set; }
        [JsonProperty("RetencionIngBrutos")]
        public virtual decimal RetencionIngBrutos { get; set; }
        [JsonProperty("Anulado")]
        public virtual bool Anulado { get; set; }

        [JsonProperty("Items")]
        public virtual List<DocumentoVentaItem> Items { get; set; }

        [JsonProperty("Observaciones")]
        public virtual DocumentoVentaObservaciones Observaciones{ get; set; }


        [JsonProperty("IdTipoComprobanteGenerar")]
        public virtual int IdTipoComprobanteGenerar { get; set; }

        [JsonProperty("DiasVencido")]
        public virtual int DiasVencido 
        {
            get 
            {
                TimeSpan tSpan = DateTime.Now - this.Vencimiento;
                return this.Pendiente == 0 ? 0 : tSpan.Days;
            }
            set { }
        }

        public DocumentoVenta() { }

        public void Validar()
        {
            StringBuilder sb = new StringBuilder();

            if (Cliente == null)
                sb.AppendLine("Debe indicar cliente.");

            if (Usuario == null)
                sb.AppendLine("Debe indicar usuario.");

            if (TipoComprobante == null)
                sb.AppendLine("Debe seleccionar un tipo de comprobante.");

        }
    }
}
