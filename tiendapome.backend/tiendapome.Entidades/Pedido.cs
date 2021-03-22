using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace tiendapome.Entidades
{
    [JsonObject]
    public class Pedido : EntidadBase
    {
        [JsonProperty("Numero")]
        public virtual int Numero { get; set; }
        
        [JsonProperty("Fecha")]
        public virtual DateTime Fecha { get; set; }

        [JsonProperty("Cliente")]
        public virtual Cliente Cliente { get; set; }

        [JsonProperty("Estado")]
        public virtual Estado Estado { get; set; }

        [JsonProperty("Observaciones")]
        public virtual string Observaciones { get; set; }

        [JsonProperty("Total")]
        public virtual decimal Total { get; set; }

        [JsonProperty("CompraMinima")]
        public virtual decimal CompraMinima { get; set; }

        [JsonProperty("CantidadItems")]
        public virtual int CantidadItems { get; set; }

        [JsonProperty("Porcentaje")]
        public virtual decimal Porcentaje { get; set; }

        [JsonProperty("Moneda")]
        public virtual string Moneda { get; set; }

        [JsonProperty("IdPedidoProveedor")]
        public virtual int IdPedidoProveedor { get; set; }

        [JsonProperty("NumeroPedidoProveedor")]
        public virtual int NumeroPedidoProveedor { get; set; }

        [JsonProperty("IdPedidoMinorista")]
        public virtual int IdPedidoMinorista { get; set; }

        [JsonProperty("NumeroPedidoMinorista")]
        public virtual int NumeroPedidoMinorista { get; set; }

        [JsonProperty("Items")]
        public virtual List<PedidoItem> Items { get; set; }

        [JsonProperty("StockReservado")]
        public virtual bool StockReservado 
        {
            get 
            {
                int stockReservado = 0;
                this.Items.ToList<PedidoItem>()
                    .ForEach(delegate(PedidoItem pi) 
                {
                    pi.ItemProductos.ToList<PedidoItemProducto>()
                        .ForEach(delegate(PedidoItemProducto pip) 
                    {
                        stockReservado += pip.StockReservado;
                    });
                });
                return (stockReservado > 0);
            }
            set { }
        }

        [JsonProperty("VerificarStock")]
        public virtual bool VerificarStock
        {
            get
            {
                int verificar = 0;
                this.Items.ToList<PedidoItem>()
                    .ForEach(delegate(PedidoItem pit) 
                    {
                        verificar += pit.ItemProductos.ToList<PedidoItemProducto>().FindAll(pip => pip.Cantidad < pip.StockDisponible).Count;
                    });
                return verificar == 0;
            }
            set { }
        }


        public Pedido() 
        {
            this.Items = new List<PedidoItem>();
        }

        public virtual string Validar()
        {
            StringBuilder msj = new StringBuilder();

            if (this.Cliente == null)
                msj.AppendLine("Debe indicar cliente");
            if (this.Items.Count == 0)
                msj.AppendLine("Debe ingresar ítems");
            else
            {
                string msjCantidad = string.Empty;
                this.Items.ToList<PedidoItem>().ForEach(delegate(PedidoItem item) 
                {
                    if (item.Cantidad == 0)
                        msjCantidad = "Debe completar cantidad";
                });
                if (msjCantidad != string.Empty)
                    msj.AppendLine(msjCantidad);
            }
            return msj.ToString();
        }
    }
}
