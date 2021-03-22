using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

using Newtonsoft.Json;

using tiendapome.Entidades;
using tiendapome.Repository;
using tiendapome.Servicios.Cache;
using tiendapome.Impresion;

namespace tiendapome.Servicios
{
    public class ServiciosVentas : AbstractService
    {
        const string gobalKeyCache = "TiendaPome";

        public ServiciosVentas() { }

        public DocumentoVentaList DocumentosVentasListar(int numeroPagina, int cantidadRegistros, string fechaDesde, string fechaHasta, int? idUsuario, int? idCliente, int? tipoListado)
        {
            VentaRepository repository = new VentaRepository();

            DateTime? fDesde = fechaDesde.ConvertirDateTimeNulleable();
            DateTime? fHasta = fechaHasta.ConvertirDateTimeNulleable();
            if (fHasta.HasValue)
                fHasta = fHasta.Value.AddDays(1);
            return repository.ListarVentas(numeroPagina, cantidadRegistros, fDesde, fHasta, idUsuario, idCliente, tipoListado);
        }

        public List<ListadoCtaCte> ObenerResumenSaldosCtaCte()
        {
            VentaRepository repository = new VentaRepository();
            return repository.ObtenerResumenSaldosCtaCte().ToList<ListadoCtaCte>();
        }

        public DocumentoVenta DocumentoVentaObtener(int idDocVenta)
        {
            VentaRepository repository = new VentaRepository();
            DocumentoVenta docventa = repository.Obtener(idDocVenta);
            if (docventa != null) 
            { 
                docventa.Items = this.Listar<DocumentoVentaItem>("IdVenta", idDocVenta).ToList<DocumentoVentaItem>();
                docventa.Observaciones = this.ObtenerObjeto<DocumentoVentaObservaciones>("IdVenta", idDocVenta);
            }
            return docventa;
        }

        public DocumentoVenta DocumentoVentaGrabar(DocumentoVenta datosGraba)
        {
            VentaRepository repository = new VentaRepository();
            DocumentoVenta dato;

            int _id = datosGraba.Id;
            if (_id == -1)
            {
                dato = new DocumentoVenta();
                dato.TipoComprobante = datosGraba.TipoComprobante;
                dato.Numero = repository.ObtenerProximoNumero(datosGraba.TipoComprobante.Id);
            }
            else
                dato = repository.Obtener(_id);

            dato.IdEmpresa = datosGraba.IdEmpresa;
            dato.Usuario = this.ObtenerObjeto<Cliente>(datosGraba.Usuario.Id);
            dato.Cliente = this.ObtenerObjeto<Cliente>(datosGraba.Cliente.Id);
            dato.IdPedido = datosGraba.IdPedido;
            dato.NumeroPedido = datosGraba.NumeroPedido;            
            dato.Letra = datosGraba.Letra;
            dato.Sucursal = datosGraba.Sucursal;            
            dato.Fecha = datosGraba.Fecha;
            dato.Vencimiento = datosGraba.Vencimiento;
            dato.Gravado = datosGraba.Gravado;
            dato.Descuento = datosGraba.Descuento;
            dato.PorcentajeIVA = datosGraba.PorcentajeIVA;
            dato.IVA = datosGraba.IVA;
            dato.Total = datosGraba.Total;
            dato.Pendiente = datosGraba.Pendiente;
            dato.Comision = datosGraba.Comision;
            dato.Efectivo = datosGraba.Efectivo;
            dato.EfectivoCotizaDolar = datosGraba.EfectivoCotizaDolar;
            dato.Dolares = datosGraba.Dolares;
            dato.DolaresCotizaDolar = datosGraba.DolaresCotizaDolar;            
            dato.Euros = datosGraba.Euros;
            dato.EurosCotizaDolar = datosGraba.EurosCotizaDolar;
            dato.Cheques = datosGraba.Cheques;
            dato.ChequesCotizaDolar = datosGraba.ChequesCotizaDolar;
            dato.Tarjeta = datosGraba.Tarjeta;
            dato.TarjetaCotizaDolar = datosGraba.TarjetaCotizaDolar;
            dato.MercadoPago = datosGraba.MercadoPago;
            dato.MercadoPagoCotizaDolar = datosGraba.MercadoPagoCotizaDolar;
            dato.DepositoTransferencia = datosGraba.DepositoTransferencia;
            dato.DepositoTransferCotizaDolar = datosGraba.DepositoTransferCotizaDolar;  
            dato.RetencionIVA = datosGraba.RetencionIVA;
            dato.RetencionGanancia = datosGraba.RetencionGanancia;
            dato.RetencionIngBrutos = datosGraba.RetencionIngBrutos;
            
            repository.Actualizar(dato);

            if (datosGraba.Observaciones != null)
            {
                datosGraba.Observaciones.IdVenta = dato.Id;
                dato.Observaciones = this.DocumentoVentaObservacionesGrabar(datosGraba.Observaciones);
            }

            if (datosGraba.Items != null && datosGraba.Items.Count > 0)
            {
                if (dato.Items == null) dato.Items = new List<DocumentoVentaItem>();

                datosGraba.Items.ToList<DocumentoVentaItem>()
                    .ForEach(delegate(DocumentoVentaItem item)
                    {
                        item.IdVenta = dato.Id;
                        DocumentoVentaItem docItem = this.DocumentoVentaItemGrabar(item);

                        dato.Gravado = dato.Gravado + docItem.Precio;
                    });

                dato = this.CalcularTotales(dato);
                dato.Items = this.Listar<DocumentoVentaItem>("IdVenta", dato.Id).ToList<DocumentoVentaItem>();
            }

            
            return dato;
        }

        public DocumentoVenta CalcularTotales(DocumentoVenta dato)
        {
            VentaRepository repository = new VentaRepository();

            dato.Gravado = 0;
            dato.Items = this.Listar<DocumentoVentaItem>("IdVenta", dato.Id).ToList<DocumentoVentaItem>();


            dato.Items.ToList<DocumentoVentaItem>()
                .ForEach(delegate(DocumentoVentaItem item)
                {                
                    dato.Gravado = dato.Gravado + item.Precio;
                });

            dato.Total = dato.Gravado - dato.Descuento;
            dato.Pendiente = dato.Total;

            repository.Actualizar(dato);

            return this.DocumentoVentaObtener(dato.Id);
        }

        public DocumentoVenta DocumentoVentaAnular(DocumentoVenta datosGraba)
        {
            ServiciosProductos servProductos = new ServiciosProductos();
            VentaRepository repository = new VentaRepository();
            DocumentoVenta dato = this.DocumentoVentaObtener(datosGraba.Id);
            
            dato.Anulado = datosGraba.Anulado;            
            
            repository.Actualizar(dato);

            dato.Items.ToList<DocumentoVentaItem>()
                .ForEach(delegate(DocumentoVentaItem docItem) 
                {
                    if (docItem.IdProductoStock > 0 && docItem.IdPedidoItemProducto <= 0)
                    {
                        bool? _descuentaStock = null;
                        if (dato.TipoComprobante.Id == (int)TIPOS_COMPROBANTE.NOTA_DE_PEDIDO_)
                            _descuentaStock = datosGraba.Anulado ? false : true;

                        else if (dato.TipoComprobante.Id == (int)TIPOS_COMPROBANTE.NOTA_DE_CREDITO_)
                            _descuentaStock = datosGraba.Anulado ? true : false;

                        if (_descuentaStock.HasValue)
                            servProductos.ProductoStockActualizarStock(docItem.IdProductoStock, docItem.Cantidad, _descuentaStock.Value);
                    }
                });

            return dato;
        }

        public DocumentoVentaItem DocumentoVentaItemGrabar(DocumentoVentaItem datosGraba)
        {
            RepositoryGenerico<DocumentoVentaItem> repository = new RepositoryGenerico<DocumentoVentaItem>();
            DocumentoVentaItem dato;

            int _id = datosGraba.Id;
            if (_id == -1)
                dato = new DocumentoVentaItem();
            else
                dato = repository.Obtener(_id);
            
            dato.IdVenta = datosGraba.IdVenta;
            dato.NroItem = datosGraba.NroItem;
            dato.IdProductoStock = datosGraba.IdProductoStock;
            dato.IdPedidoItemProducto = datosGraba.IdPedidoItemProducto;
            dato.Descripcion = datosGraba.Descripcion;
            dato.Cantidad = datosGraba.Cantidad;
            dato.PrecioUnitario = datosGraba.PrecioUnitario;
            dato.Precio = datosGraba.Precio;

            repository.Actualizar(dato);

            return dato;
        }

        public DocumentoVentaObservaciones DocumentoVentaObservacionesGrabar(DocumentoVentaObservaciones datosGraba)
        {
            ServicioGenerico servGenerico = new ServicioGenerico();
            RepositoryGenerico<DocumentoVentaObservaciones> repository = new RepositoryGenerico<DocumentoVentaObservaciones>();
            DocumentoVentaObservaciones dato;

            string url_host = servGenerico.ParametroObtenerValor("URL_HOST");
            
            int _id = datosGraba.Id;
            if (_id == -1)
                dato = new DocumentoVentaObservaciones();
            else
                dato = repository.Obtener(_id);

            dato.IdVenta = datosGraba.IdVenta;
            dato.Observaciones = datosGraba.Observaciones;
            dato.Adjunto = datosGraba.Adjunto;
            dato.AdjuntoLink = string.Format("{0}{1}{2}", url_host, "assets/adjuntos/", dato.Adjunto);

            repository.Actualizar(dato);

            return dato;
        }

        public DocumentoVenta DocumentoVentaItemEliminar(DocumentoVentaItem docItem)
        {
            RepositoryGenerico<DocumentoVentaItem> repository = new RepositoryGenerico<DocumentoVentaItem>();
            ServiciosProductos servProductos = new ServiciosProductos();

            DocumentoVentaItem dato = repository.Obtener(docItem.Id);
            repository.Eliminar(dato);

            DocumentoVenta docVenta = this.DocumentoVentaObtener(docItem.IdVenta);

            if (docItem.IdPedidoItemProducto <= 0 && docItem.IdProductoStock > 0)
            {
                bool? _descuentaStock = null;
                if (docVenta.TipoComprobante.Id == (int)TIPOS_COMPROBANTE.NOTA_DE_PEDIDO_)
                    _descuentaStock = false;
                else if (docVenta.TipoComprobante.Id == (int)TIPOS_COMPROBANTE.NOTA_DE_CREDITO_)
                    _descuentaStock = true;

                if (_descuentaStock.HasValue)
                    servProductos.ProductoStockActualizarStock(docItem.IdProductoStock, docItem.Cantidad, _descuentaStock.Value);
            }
            return this.CalcularTotales(docVenta);
        }

        public void DocumentoVentaAplicarRecibo(int idVenta)
        {
            VentaRepository repository = new VentaRepository();
            DocumentoVenta recibo = repository.Obtener(idVenta);

            DocumentoVentaList comprobantesPendientes = repository.ListarVentas(-1, -1, null, null, -1, recibo.Cliente.Id, 1);

            comprobantesPendientes.DocumentosVenta.ForEach(delegate(DocumentoVenta docNP) 
            {
                if (recibo.Pendiente >= 0)
                {
                    recibo.Pendiente = recibo.Pendiente - docNP.Pendiente;
                
                    docNP.Pendiente = recibo.Pendiente >= 0 ? 0 : docNP.Pendiente - recibo.Pendiente;
                    repository.Actualizar(docNP);
                }
            });
            repository.Actualizar(recibo);
        }


        public DocumentoVenta DocumentoVentaFacturarProducto(Producto producto)
        {
            ServiciosProductos servProductos = new ServiciosProductos();
            DocumentoVenta dato = this.DocumentoVentaObtener(producto.IdDocumentoVenta);

            producto.ProductoStock.ToList<ProductoStock>()
                .ForEach(delegate(ProductoStock ps)
                {
                    if (ps.CantidadPedido > 0)
                    {
                        Producto prodDescripcion = this.ObtenerObjeto<Producto>(producto.Id);
                        string descripcion = string.Format("{0} {1} - Código: {2} - {3}",
                                                                prodDescripcion.DescripcionCategoria,
                                                                prodDescripcion.DescripcionSubcategoria,
                                                                producto.Codigo.ToString(),
                                                                ps.Medida.Observaciones);

                        decimal precioUnitario = 0;
                        if (producto.PrecioPorPeso)
                            precioUnitario = producto.PrecioUnitarioFinal * producto.Peso;
                        else
                            precioUnitario = producto.PrecioUnitarioFinal;

                        DocumentoVentaItem dvItem = new DocumentoVentaItem()
                        {
                            Id = -1,
                            IdVenta = dato.Id,
                            NroItem = dato.Items.Count + 1,
                            Descripcion = descripcion,
                            IdProductoStock = ps.Id,
                            Cantidad = ps.CantidadPedido,
                            PrecioUnitario = precioUnitario,
                            Precio = ps.CantidadPedido * precioUnitario
                        };
                        dato.Items.Add(dvItem);
                    }
                });

            dato = this.DocumentoVentaGrabar(dato);

            //para actualizar, vuelvo a ciclar por las dudas que la actualización que de error al Grabar
            bool? _descuentaStock = null;
            if (dato.TipoComprobante.Id == (int)TIPOS_COMPROBANTE.NOTA_DE_PEDIDO_)
                _descuentaStock = true;
            else if (dato.TipoComprobante.Id == (int)TIPOS_COMPROBANTE.NOTA_DE_CREDITO_)
                _descuentaStock = false;

            if (_descuentaStock.HasValue)
            {
                producto.ProductoStock.ToList<ProductoStock>()
                    .ForEach(delegate(ProductoStock ps)
                    {
                        if (ps.CantidadPedido > 0)
                            servProductos.ProductoStockActualizarStock(ps.Id, ps.CantidadPedido, _descuentaStock.Value);
                    });
            }
            
            return dato;
        }

        public DocumentoVenta DocumentoVentaFacturarPedido(DocumentoVenta dato)
        {
            ServiciosProductos servProductos = new ServiciosProductos();
            ServiciosPedido servPedido = new ServiciosPedido();
            VentaRepository repository = new VentaRepository();

            if (dato.Items == null)
                dato.Items = new List<DocumentoVentaItem>();
            
            Pedido pedido = servPedido.PedidoObtener(dato.IdPedido);            
            pedido.Items.ToList<PedidoItem>()
                .OrderBy(item => item.Producto.Ubicacion).ToList<PedidoItem>()
                .ForEach(delegate(PedidoItem pi)
                {

                    decimal _precioUnitario = 0;
                    if (pi.Producto.PrecioPorPeso)
                        _precioUnitario = pi.Precio * pi.Producto.Peso;
                    else
                        _precioUnitario = pi.Precio;

                    if (pi.Cantidad == 0)
                    {
                        // si la cantidad esta en 0 lo mismo se genera el item de la factura en 0 
                        // para mantener la numeracion de los items
                        string _descripcion = string.Format("{0} {1} - Código: {2} ",
                                                                        pi.Producto.DescripcionCategoria,
                                                                        pi.Producto.DescripcionSubcategoria,
                                                                        pi.Producto.Codigo.ToString());

                        DocumentoVentaItem dvItem = new DocumentoVentaItem()
                        {
                            Id = -1,
                            IdVenta = dato.Id,
                            NroItem = dato.Items.Count + 1,
                            Descripcion = _descripcion,
                            IdProductoStock = pi.Producto.ProductoStock[0].Id,
                            IdPedidoItemProducto = -1,
                            Cantidad = 0,
                            PrecioUnitario = _precioUnitario,
                            Precio = 0
                        };
                        dato.Items.Add(dvItem);

                    }
                    else
                    {
                        pi.ItemProductos.ToList<PedidoItemProducto>()
                            .ForEach(delegate(PedidoItemProducto pip)
                            {
                                if (pip.Cantidad > 0)
                                {
                                    string _descripcion = string.Format("{0} {1} - Código: {2} - {3}",
                                                                            pi.Producto.DescripcionCategoria,
                                                                            pi.Producto.DescripcionSubcategoria,
                                                                            pi.Producto.Codigo.ToString(),
                                                                            pip.Medida.Observaciones);

                                    DocumentoVentaItem dvItem = new DocumentoVentaItem()
                                    {
                                        Id = -1,
                                        IdVenta = dato.Id,
                                        NroItem = dato.Items.Count + 1,
                                        Descripcion = _descripcion,
                                        IdProductoStock = pip.IdProductoStock,
                                        IdPedidoItemProducto = pip.Id,
                                        Cantidad = pip.Cantidad,
                                        PrecioUnitario = _precioUnitario,
                                        Precio = pip.Cantidad * _precioUnitario
                                    };
                                    dato.Items.Add(dvItem);
                                }
                            });
                    }
                });

            if (pedido.Cliente.ComisionApp > 0 && pedido.NumeroPedidoMinorista > 0)
            {
                DocumentoVentaItem dvItem = new DocumentoVentaItem()
                {
                    Id = -1,
                    IdVenta = dato.Id,
                    NroItem = dato.Items.Count + 1,
                    Descripcion = string.Format("Comisión APP Tienda WEB {0}%", pedido.Cliente.ComisionApp),
                    IdProductoStock = -1,
                    IdPedidoItemProducto = -1,
                    Cantidad = 1,
                    PrecioUnitario = (pedido.Total * pedido.Cliente.ComisionApp) / 100,
                    Precio = (pedido.Total * pedido.Cliente.ComisionApp) / 100
                };
                dato.Items.Add(dvItem);
            }

            /************************/
            pedido.Estado = this.ObtenerObjeto<Estado>((int)ESTADOS.FACTURADO_);
            servPedido.PedidoGrabar(pedido);
            /************************/

            //hay que grabar para que se actualice el numero de pedido que se esta facturando..
            dato.NumeroPedido = pedido.Numero;
            dato= this.DocumentoVentaGrabar(dato);

            return dato;
        }

        public decimal DocumentoVentaObtenerSaldoInicial(int idCliente, string fecha)
        {
            VentaRepository repository = new VentaRepository();
            if (!fecha.ConvertirDateTimeNulleable().HasValue)
                fecha = DateTime.MaxValue.ToString();
            return repository.ObtenerSaldoInicialCtaCte(idCliente, fecha.ConvertirDateTime());    
        }

        public IDictionary ImprimirDatosNotaPedido(int idVenta)
        {
            IDictionary datos = new Hashtable();
            DocumentoVenta docVenta = this.DocumentoVentaObtener(idVenta);

            if(docVenta==null)
                throw new ApplicationException("No existe Nota de Pedido");

            datos.Add("DescripcionComprobante", docVenta.TipoComprobante.Descripcion);
            datos.Add("Numero", string.Format("{0:00000}", docVenta.Numero));
            datos.Add("Fecha", string.Format("{0}", string.Format("{0:dd/MM/yyy}", docVenta.Fecha)));
            datos.Add("NombreCliente", string.Format("{0} - {1} {2}", docVenta.Cliente.Id.ToString(), docVenta.Cliente.Nombre, docVenta.Cliente.Apellido));
            datos.Add("NombreFantasia", docVenta.Cliente.NombreFantasia.ConvertirString());
            datos.Add("RazonSocial", docVenta.Cliente.RazonSocial.ConvertirString());
            datos.Add("CodigoCliente", string.Format("{0:0000}", docVenta.Cliente.Id));
            datos.Add("ListadoItems", docVenta.Items.ToList<DocumentoVentaItem>());
            datos.Add("NroPedido", string.Format("{0:00000}", docVenta.NumeroPedido > 0 ? docVenta.NumeroPedido : 0));
            datos.Add("Direccion", docVenta.Cliente.Direccion.ConvertirString());
            datos.Add("Localidad", docVenta.Cliente.Localidad.ConvertirString());
            datos.Add("Provincia", docVenta.Cliente.Provincia != null ? docVenta.Cliente.Provincia.Descripcion : string.Empty);
            datos.Add("CodigoPostal", docVenta.Cliente.CodigoPostal.ConvertirString());
            datos.Add("Telefono", docVenta.Cliente.Celular.ConvertirString());
            datos.Add("Email", docVenta.Cliente.Email);
            datos.Add("SituacionIVA", docVenta.Cliente.SituacionIVA != null ? docVenta.Cliente.SituacionIVA.Descripcion : string.Empty);
            datos.Add("Subtotal", string.Format("{0:#,##0.00}", docVenta.Gravado));
            datos.Add("Descuento", string.Format("{0:#,##0.00}", docVenta.Descuento));
            datos.Add("ImprimirSubtotal", string.Format("{0}", docVenta.Descuento != 0 ? 1 : 0));
            datos.Add("Total", string.Format("{0:#,##0.00}", docVenta.Total));
            datos.Add("TextoPiePagina", string.Empty);
                        
            return datos;
        }

        public List<ItemListado> ObtenerCtaCteCliente(string fechaDesde, string fechaHasta, int idCliente, decimal saldoInicial)
        {
            DocumentoVentaList listadoVentas = this.DocumentosVentasListar(-1, -1, fechaDesde, fechaHasta, -1, idCliente, null);

            decimal saldo = saldoInicial;

            List<ItemListado> listado = new List<ItemListado>();
            listado.Add(new ItemListado()
            {
                Campo1 = "",
                Campo2 = "Saldo Inicial",
                Campo3 = "",
                Campo4 = "",
                Campo5 = "",
                Campo6 = string.Format("{0:0.00}", saldo)
            });

            decimal debe = 0;
            decimal haber = 0;

            listadoVentas.DocumentosVenta.ForEach(delegate(DocumentoVenta dv)
            {
                debe = dv.TipoComprobante.EsDebe ? dv.Total : 0;
                haber = !dv.TipoComprobante.EsDebe ? dv.Total : 0;
                saldo = saldo + debe - haber;

                listado.Add(new ItemListado()
                {
                    Campo1 = string.Format("{0:dd/MM/yyy}", dv.Fecha),
                    Campo2 = string.Format("{0} {1}", dv.TipoComprobante.Descripcion, string.Format("{0:00000}", dv.Numero)),
                    Campo3 = string.Format("{0:00000}", dv.NumeroPedido),
                    Campo4 = dv.TipoComprobante.EsDebe ? string.Format("{0:#,##0.00}", debe) : string.Empty,
                    Campo5 = !dv.TipoComprobante.EsDebe ? string.Format("{0:#,##0.00}", haber) : string.Empty,
                    Campo6 = string.Format("{0:#,##0.00}", saldo)
                });
            });

            return listado;
        }

        public IDictionary ImprimirCtaCteCliente(string fechaDesde, string fechaHasta, int idCliente)
        {
            Cliente cliente = this.ObtenerObjeto<Cliente>(idCliente);

            if (cliente == null)
                throw new ApplicationException("No existe el Cliente");

            decimal saldoInicial = this.DocumentoVentaObtenerSaldoInicial(idCliente, fechaDesde);
            List<ItemListado> listado = this.ObtenerCtaCteCliente(fechaDesde, fechaHasta, idCliente, saldoInicial);
            decimal saldoFinal = this.DocumentoVentaObtenerSaldoInicial(idCliente, null);

            string fDesde = string.Format("{0:dd/MM/yyy}", fechaDesde.ConvertirDateTime());
            string fHasta = string.Format("{0:dd/MM/yyy}", fechaHasta.ConvertirDateTime());

            IDictionary datos = new Hashtable();

            datos.Add("NombreCliente", string.Format("{0} - {1} {2}", cliente.Id.ToString(), cliente.Nombre, cliente.Apellido));
            datos.Add("NombreFantasia", cliente.NombreFantasia.ConvertirString());
            datos.Add("PeriodoDesdeHasta", string.Format("{0} al {1}", fDesde, fHasta));
            datos.Add("Listado", listado);
            datos.Add("Saldo", string.Format("{0:#,##0.00}", saldoFinal));
            
            return datos;
        }
        
    }
}
