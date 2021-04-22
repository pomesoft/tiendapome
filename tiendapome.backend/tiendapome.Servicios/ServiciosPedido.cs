using Newtonsoft.Json;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;

using tiendapome.Entidades;
using tiendapome.Repository;
using tiendapome.Servicios.Cache;


namespace tiendapome.Servicios
{
    public class ServiciosPedido : AbstractService
    {
        const string gobalKeyCache = "TiendaPome";
        public ServiciosPedido() { }


        public List<PedidoItem> PedidoItemsObtenerCache(int idPedido)
        {
            List<PedidoItem> listReturn = new List<PedidoItem>();
            string keyItem = "GetPedidoItems_" + idPedido.ToString();

            var itemsCache = CacheManager.GetToCache<List<PedidoItem>>(gobalKeyCache, keyItem);

            if (itemsCache == null)
            {
                listReturn = this.Listar<PedidoItem>("IdPedido", idPedido).ToList<PedidoItem>();
                if (listReturn == null) listReturn = new List<PedidoItem>();
                CacheManager.AddToCache(gobalKeyCache, keyItem, listReturn);
            }
            else
            {
                listReturn = itemsCache;
            }
            return listReturn;
        }

        public List<Pedido> PedidoListar()
        {
            return this.Listar<Pedido>().ToList<Pedido>();
        }

        public PedidoList PedidoListar(string estados, int idCliente, string fechaDesde, string fechaHasta, int numeroPagina, int cantidadRegistros)
        {
            PedidoRepository repository = new PedidoRepository();
            
            List<Estado> listEstados = this.ListarVigentes<Estado>().ToList<Estado>();
            List<Estado> listEstadosParams = null;

            bool ordenarAscendente = true;

            if (!string.IsNullOrEmpty(estados))
            {
                string[] ids = estados.Split(',');
                if (ids.Length > 0)
                {
                    listEstadosParams = new List<Estado>();
                    for (int i = 0; i < ids.Length; i++)
                    {
                        int idEstado = ids[i].ConvertirInt();
                        if (idEstado > 0)
                            listEstadosParams.Add(listEstados.Find(item => item.Id.Equals(idEstado)));
                    }
                }
            }
            else
            {
                //se ordena descendente para mostrar Mis Pedidos en el carrito
                ordenarAscendente = false;
                listEstadosParams = listEstados;
            }

            PedidoList datos = repository.ObtenerPedidos(listEstadosParams,
                                                        idCliente,
                                                        fechaDesde.ConvertirDateTimeNulleable(),
                                                        fechaHasta.ConvertirDateTimeNulleable(),         
                                                        numeroPagina, cantidadRegistros,
                                                        ordenarAscendente);
            
            return datos;
        }

        public Pedido PedidoObtener(int id)
        {
            return this.PedidoObtener(id, -1, -1);
        }
        public Pedido PedidoObtener(int id, int numeroPagina, int cantidadRegistros)
        {
            Pedido pedido = this.ObtenerObjeto<Pedido>(id);

            pedido.Items = this.PedidoObtenerItems(id, numeroPagina, cantidadRegistros);            
            
            return pedido;
        }

        public List<PedidoItem> PedidoObtenerItems(int idPedido, int numeroPagina, int cantidadRegistros)
        {
            PedidoRepository repository = new PedidoRepository();
            ServicioGenerico servGenerico = new ServicioGenerico();

            string url_host = servGenerico.ParametroObtenerValor("URL_HOST");

            List<PedidoItem> itemsReturn = new List<PedidoItem>();

            List<PedidoItem> listItemsFULL = this.Listar<PedidoItem>("IdPedido", idPedido)
                                                .OrderBy(item => item.Producto.Ubicacion)
                                                .ToList<PedidoItem>();

            bool paginar = (numeroPagina != -1 && cantidadRegistros != -1);

            if (paginar)
            {
                int nro_fila = 1;
                listItemsFULL.ForEach(delegate(PedidoItem item)
                {
                    item.NroFila = nro_fila;
                    nro_fila++;
                });
                int filaDesde = (numeroPagina - 1) * cantidadRegistros;
                int filaHasta = filaDesde + cantidadRegistros;
                itemsReturn = listItemsFULL.FindAll(item => item.NroFila > filaDesde && item.NroFila <= filaHasta);
            }
            else
            {
                itemsReturn = listItemsFULL;
            }


            return itemsReturn;
        }

        //devuelve el pedido con estado INGRESADO del cliente
        //si no existe lo crea
        public Pedido PedidoObtenerClienteIngresado(int idCliente, int numeroPagina, int cantidadRegistros)
        {
            PedidoRepository repository = new PedidoRepository();
            Pedido pedido = repository.ObtenerPedidoClienteIngresado(idCliente);

            if (pedido == null)
                pedido = this.PedidoCrear(idCliente);

            pedido.Items = this.PedidoObtenerItems(pedido.Id, numeroPagina, cantidadRegistros);

            ServicioGenerico servGenerico = new ServicioGenerico();
            string paramsCompraMinima = servGenerico.ParametroObtenerValor("COMPRA_MINIMA");
            pedido.CompraMinima = paramsCompraMinima.ConvertirDecimal() > 0 ? paramsCompraMinima.ConvertirDecimal() : -1;

            return pedido;
        }
        public Pedido PedidoGrabar(Pedido datosGraba)
        {
            RepositoryGenerico<Pedido> repository = new RepositoryGenerico<Pedido>();
            Pedido dato;

            int _id = datosGraba.Id;
            if (_id == -1)
                dato = new Pedido();
            else
                dato = repository.Obtener(_id);

            dato.Numero = datosGraba.Numero;
            if (_id == -1) dato.Fecha = DateTime.Now;
            dato.Cliente = this.ObtenerObjeto<Cliente>(datosGraba.Cliente.Id);
            dato.Estado = this.ObtenerObjeto<Estado>(datosGraba.Estado.Id);
            dato.Observaciones = datosGraba.Observaciones;
            dato.Total = datosGraba.Total;
            dato.IdPedidoProveedor = datosGraba.IdPedidoProveedor;
            dato.ExsportoEtiquetasCSV = datosGraba.ExsportoEtiquetasCSV;

            repository.Actualizar(dato);

            return this.PedidoObtener(dato.Id);
        }
        public Pedido PedidoCrear(int idCliente)
        {
            try
            {
                RepositoryGenerico<Pedido> repository = new RepositoryGenerico<Pedido>();
                Pedido dato = new Pedido();

                Parametro paramMonedaVenta = this.ObtenerObjeto<Parametro>("Clave", "MONEDA_VENTA");
                string monedaVenta = paramMonedaVenta == null ? "DOLAR_EEUU" : paramMonedaVenta.Valor;

                dato.Numero = -1;
                dato.Fecha = DateTime.Now;
                dato.Cliente = this.ObtenerObjeto<Cliente>(idCliente);
                dato.Estado = this.ObtenerObjeto<Estado>((int)ESTADOS.INGRESADO_);
                dato.Moneda = monedaVenta.Equals("DOLAR_EEUU") ? "USD" : "$";
                repository.Actualizar(dato);

                return this.PedidoObtener(dato.Id);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public void PedidoLiberarStock(int idPedido)
        {
            ServicioGenerico servGenerico = new ServicioGenerico();
            string descuentaAlConfirmar = servGenerico.ParametroObtenerValor("DESCONTAR_STCOK_AL_CONFIRMAR");
            if (!string.IsNullOrEmpty(descuentaAlConfirmar) && descuentaAlConfirmar.Equals("SI"))
            {
                PedidoRepository repository = new PedidoRepository();
                repository.PedidoLiberarStock(idPedido);
            }
        }

        public void PedidoCancelar(int idPedido)
        {
            ServicioGenerico servGenerico = new ServicioGenerico();
            PedidoRepository repository = new PedidoRepository();
            Pedido dato;

            dato = repository.Obtener(idPedido);
            dato.Estado = this.ObtenerObjeto<Estado>((int)ESTADOS.CANCELADO_);
            
            repository.Actualizar(dato);

            string descuentaAlConfirmar = servGenerico.ParametroObtenerValor("DESCONTAR_STCOK_AL_CONFIRMAR");
            if (!string.IsNullOrEmpty(descuentaAlConfirmar) && descuentaAlConfirmar.Equals("SI"))
                repository.PedidoLiberarStock(dato.Id);
        }

        public MensajeResponse PedidoAvanzar(Pedido datosGraba, bool esReenvioPedidoMinorista)
        {
            ServicioGenerico servGenerico = new ServicioGenerico();
            //Actualizamos el pedido
            Pedido pedido = this.PedidoGrabar(datosGraba);
            
            //Validamos que esté completo
            //string validaciones = pedido.Validar();
            //if (validaciones != string.Empty)
            //    return new MensajeResponse((int)ESTADOS_RESPONSE.ERROR_, validaciones); 


            //3ro Actualizamos items modificados en caso que hubiera
            List<PedidoItem> itemsPedido = datosGraba.Items.FindAll(item => item.Modificado).ToList<PedidoItem>();
            if (itemsPedido != null && itemsPedido.Count > 0)
            {
                itemsPedido.ForEach(delegate(PedidoItem item)
                {
                    this.PedidoItemGrabarSinTotalPedido(item);
                });
                pedido = this.PedidoGrabarTotal(pedido.Id);            
            }

            string descuentaAlConfirmar = servGenerico.ParametroObtenerValor("DESCONTAR_STCOK_AL_CONFIRMAR");

            PedidoRepository repository = new PedidoRepository();

            pedido = repository.Obtener(pedido.Id);

            //si está todo OK avanzamos el estado y actualizamos el pedido
            Estado proximoEstado = this.ObtenerObjeto<Estado>(pedido.Estado.PorximoEstado);

            switch (proximoEstado.Id)
            {
                case (int)ESTADOS.SOLICITADO_:

                    string verificarStock = servGenerico.ParametroObtenerValor("VERIFICAR_STCOK");
                    string esMayorista = servGenerico.ParametroObtenerValor("VENTA_MAYORISTA");


                    if ((!string.IsNullOrEmpty(verificarStock) && verificarStock.Equals("SI"))
                        && (!string.IsNullOrEmpty(esMayorista) && esMayorista.Equals("SI")))
                    {
                        pedido.Items = repository.PedidoVerificarStock(pedido.Id);

                        bool stockDisponibleOK = true;
                        pedido.Items.ForEach(delegate (PedidoItem pi)
                        {
                            //hago esta truchada para que si una vez da false no se pise con el true, y no puedo cortar la ejecucion del foreach
                            if (stockDisponibleOK)
                            {
                                stockDisponibleOK = pi.ItemProductos.ToList<PedidoItemProducto>()
                                    .FindAll(x => x.Cantidad > 0 && x.Cantidad != x.StockDisponible).Count == 0;
                            }
                        });

                        if (!stockDisponibleOK)
                        {
                            string verificarStockMsjError = servGenerico.ParametroObtenerValor("VERIFICAR_STCOK_ MSJ_ERROR");
                            return new MensajeResponse((int)ESTADOS_RESPONSE.ERROR_, (string.IsNullOrEmpty(verificarStockMsjError) ? "Verificar pedido por falta de stock disponible." : verificarStockMsjError));
                        }
                    }

                    //se reserva el stock                    
                    if (!string.IsNullOrEmpty(descuentaAlConfirmar) && descuentaAlConfirmar.Equals("SI"))
                    {
                        repository.PedidoReservarStock(pedido.Id);
                        CacheManager.RemoveToCache(gobalKeyCache);
                    }

                    //asignamos Fecha y Número
                    Pedido ultimo = repository.ObtenerUltimoPedido();
                    pedido.Numero = (ultimo != null) ? (ultimo.Numero + 1) : 1;
                    pedido.Fecha = DateTime.Now;
                    pedido.Estado = proximoEstado;

                    if (esReenvioPedidoMinorista)
                    {
                        pedido.IdPedidoMinorista = datosGraba.IdPedidoMinorista;
                        pedido.NumeroPedidoMinorista = datosGraba.NumeroPedidoMinorista;
                    }

                    repository.Actualizar(pedido);

                    break;

                case (int)ESTADOS.FINALIZADO_:
                    
                    if (!string.IsNullOrEmpty(descuentaAlConfirmar) && descuentaAlConfirmar.Equals("SI"))
                    {
                        repository.PedidoDescontarStock(pedido.Id);
                        CacheManager.RemoveToCache(gobalKeyCache);
                    }
                    pedido.Estado = proximoEstado;
                    repository.Actualizar(pedido);

                    break;
            }

            
            return new MensajeResponse((int)ESTADOS_RESPONSE.OK_, "");
        }

        public Pedido PedidoGrabarTotal(int id)
        {
            RepositoryGenerico<Pedido> repository = new RepositoryGenerico<Pedido>();
            Pedido dato = repository.Obtener(id);
            List<PedidoItem> items = this.Listar<PedidoItem>("IdPedido", id).ToList<PedidoItem>();

            decimal total = 0;
            int cantidad = 0;
            items.ForEach(delegate(PedidoItem item) 
            {
                total += item.Subtotal;
                cantidad++;
            });

            ServicioGenerico servGenerico = new ServicioGenerico();
            //Parametro paramProcentaje = servGenerico.ParametroListarCache().FirstOrDefault(item => item.Clave.Equals("PORCENTAJE_SUBTOTAL"));

            string paramProcentaje = servGenerico.ParametroObtenerValor("PORCENTAJE_SUBTOTAL");
            dato.Porcentaje = (paramProcentaje.ConvertirDecimal() < 0 ? 0 : paramProcentaje.ConvertirDecimal());

            dato.Total = total + ((total * dato.Porcentaje) / 100);
            dato.CantidadItems = cantidad;
            
            repository.Actualizar(dato);

            return dato;
        }

        public void PedidoItemGrabarSinTotalPedido(PedidoItem datosGraba)
        {
            ServicioGenerico servGenerico = new ServicioGenerico();
            ServiciosProductos servProducto = new ServiciosProductos();
            ServicioClientes servClientes = new ServicioClientes();
            RepositoryGenerico<PedidoItem> repository = new RepositoryGenerico<PedidoItem>();
            PedidoRepository repositoryPedido = new PedidoRepository();
            
            try
            {
                if (datosGraba.Producto.Id == -1)
                    throw new ApplicationException("Falta indicar Producto.");

                Pedido pedido = this.PedidoObtener(datosGraba.IdPedido);

                List<ClienteLista> listaCliente = servClientes.ClienteListaObtenerVigentesCache()
                                                            .Where(item => item.IdCliente == pedido.Cliente.Id)
                                                            .ToList<ClienteLista>();

                PedidoItem itemProducto = repositoryPedido.ObtenerItemPorProducto(datosGraba.IdPedido, datosGraba.Producto.Codigo);

                PedidoItem dato = null;
                if (itemProducto == null)
                    dato = new PedidoItem();
                else
                    dato = repository.Obtener(itemProducto.Id);

                decimal precioProcesado = 0;
                if (datosGraba.Producto.StockPropio)
                {
                    decimal cotizacionDolar = servProducto.CotizacionDolarVigente().Cotizacion;
                    precioProcesado = servProducto.ProcesarStockPropio(listaCliente, "", datosGraba.Producto).PrecioUnitarioProcesado;
                    if (pedido.Moneda != "USD")
                        precioProcesado = Decimal.Round(precioProcesado * cotizacionDolar, 2);
                }
                else
                {

                    if (datosGraba.Id == -1)
                    {
                        precioProcesado = datosGraba.Producto.PrecioUnitarioFinal;
                        datosGraba.Producto = servProducto.ProductoMayoristaGrabar(datosGraba.Producto);
                    }
                    else
                    {
                        precioProcesado = dato.Precio;
                    }

                }
                dato.Precio = precioProcesado;

                dato.IdPedido = datosGraba.IdPedido;
                dato.Producto = datosGraba.Producto;
                dato.EstadoItem = datosGraba.EstadoItem;
                dato.Porcentaje = 0;
                dato.Observaciones = datosGraba.Observaciones;
                dato.MostrarMedidas = datosGraba.MostrarMedidas;

                // PrecioUnitario => (Peso * PrecioGramo)
                decimal precioUnitario = 0;
                if (dato.Producto.PrecioPorPeso)
                    precioUnitario = dato.Producto.Peso * dato.Precio;
                else
                    precioUnitario = dato.Precio;
                
                repository.Actualizar(dato);


                if (datosGraba.Producto.StockPropio)
                    this.PedidoItemProductoGrabar(dato, datosGraba.ItemProductos);
                else
                    this.PedidoItemProductoMayoristaGrabar(dato, datosGraba.ItemProductos);

                int _cantidad = 0;
                dato.ItemProductos.ToList<PedidoItemProducto>()
                    .ForEach(delegate(PedidoItemProducto item)
                    {
                        _cantidad += item.Cantidad;
                    });
                dato.Cantidad = _cantidad;

                //TODO: este sin stock debe ser el del PedidoItemProducto 
                if (dato.SinStock)
                {
                    ServiciosProductos servProductos = new ServiciosProductos();
                    dato.Producto = servProductos.ProductoSinStock(dato.Producto.Id);
                    dato.Subtotal = 0;
                }
                else
                    dato.Subtotal = (precioUnitario * dato.Cantidad);

                repository.Actualizar(dato);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        private void PedidoItemProductoGrabar(PedidoItem datoGraba, IList<PedidoItemProducto> pitemProdGraba)
        {
            if (datoGraba.ItemProductos == null)
                datoGraba.ItemProductos = new List<PedidoItemProducto>();

            List<PedidoItemProducto> pitemProd = datoGraba.ItemProductos.ToList<PedidoItemProducto>();
                        
            if (pitemProd != null && pitemProd.Count > 0)
            {
                //si los items ya estan en el pedido se actualizan las cantidades
                pitemProd.ForEach(delegate(PedidoItemProducto pip)
                {
                    PedidoItemProducto itemPP = pitemProdGraba.ToList<PedidoItemProducto>()
                                                                .Find(x => x.IdProductoStock == pip.IdProductoStock);
                    pip.Cantidad = itemPP.Cantidad;
                });
            }
            else
            {   

                
                pitemProdGraba.ToList<PedidoItemProducto>()
                    .ForEach(delegate(PedidoItemProducto itemPP)
                    {
                        itemPP.IdPedidoItem = datoGraba.Id;
                        datoGraba.ItemProductos.Add(itemPP);
                    });                    
            }
        }

        private void PedidoItemProductoMayoristaGrabar(PedidoItem datoGraba, IList<PedidoItemProducto> pitemProdGraba)
        {
            ServiciosProductos servProductos = new ServiciosProductos();

            if (datoGraba.ItemProductos == null)
                datoGraba.ItemProductos = new List<PedidoItemProducto>();

            List<PedidoItemProducto> pitemProd = datoGraba.ItemProductos.ToList<PedidoItemProducto>();

            List<ProductoStock> listProdStock = servProductos.ProductoStockListar(datoGraba.Producto.Codigo);

            if (pitemProd != null && pitemProd.Count > 0)
            {
                //si los items ya estan en el pedido se actualizan las cantidades
                pitemProd.ForEach(delegate(PedidoItemProducto pip)
                {
                    PedidoItemProducto itemPP = pitemProdGraba.ToList<PedidoItemProducto>().Find(x => x.Medida.Descripcion.Equals(pip.Medida.Descripcion));
                    pip.Cantidad = itemPP.Cantidad;
                });
            }
            else
            {
                pitemProdGraba.ToList<PedidoItemProducto>()
                        .ForEach(delegate(PedidoItemProducto itemPP)
                        {
                            ProductoStock prodStock = listProdStock.Find(ps => ps.Medida.Descripcion.Equals(itemPP.Medida.Descripcion));
                            itemPP.IdPedidoItem = datoGraba.Id;
                            itemPP.IdProductoStock = prodStock.Id;
                            itemPP.Medida = prodStock.Medida;
                            datoGraba.ItemProductos.Add(itemPP);
                        });

                
            }

        }
        public PedidoItem PedidoItemGrabarCambioEstado(PedidoItem datosGraba)
        {
            RepositoryGenerico<PedidoItem> repository = new RepositoryGenerico<PedidoItem>();

            PedidoItem dato = repository.Obtener(datosGraba.Id);

            dato.EstadoItem = datosGraba.EstadoItem;
            
            this.PedidoItemProductoGrabar(dato, datosGraba.ItemProductos);
            int _cantidad = 0;
            dato.ItemProductos.ToList<PedidoItemProducto>()
                .ForEach(delegate(PedidoItemProducto item)
                {
                    _cantidad += item.Cantidad;
                });

            bool cambioCantidades = dato.Cantidad != _cantidad;
            dato.Cantidad = _cantidad;

            
            decimal precioUnitario = 0;
            if (dato.Producto.PrecioPorPeso)
                precioUnitario = dato.Producto.Peso * dato.Precio;
            else
                precioUnitario = dato.Precio;

            dato.Subtotal = precioUnitario * _cantidad;
            

            repository.Actualizar(dato);

            if (cambioCantidades)
                this.PedidoGrabarTotal(dato.IdPedido);
            
            return dato;
        }
        
        public Pedido PedidoItemGrabar(PedidoItem datosGraba)
        {
            this.PedidoItemGrabarSinTotalPedido(datosGraba);
            return this.PedidoGrabarTotal(datosGraba.IdPedido);
        }

        public decimal DamePrecioListaCliente(int idCliente, Producto producto)
        {
            ServicioClientes servClientes = new ServicioClientes();
            decimal precioReturn = -1;            
            ListaPrecio listaProducto = producto.ListaPrecio;
            if (listaProducto != null)
            {
                //List<ClienteLista> lista = this.Listar<ClienteLista>("IdCliente", idCliente).ToList<ClienteLista>();
                List<ClienteLista> lista = servClientes.ClienteListaObtenerVigentesCache()
                                                        .Where(item => item.IdCliente == idCliente)
                                                        .ToList<ClienteLista>();

                if (lista != null)
                {
                    ClienteLista cliLista = lista.Find(item => item.ListaPrecio == listaProducto);
                    if (cliLista != null)
                        precioReturn = cliLista.ListaPrecioCliente.Precio;
                }
            }
            return precioReturn;
        }

        public decimal DamePrecioListaCliente(List<ClienteLista> listaCliente, Producto producto)
        {
            ServicioClientes servClientes = new ServicioClientes();
            decimal precioReturn = -1;
            ListaPrecio listaProducto = producto.ListaPrecio;
            if (listaProducto != null && listaCliente != null)
            {
                ClienteLista cliLista = listaCliente.Find(item => item.ListaPrecio == listaProducto);
                if (cliLista != null)
                    precioReturn = cliLista.ListaPrecioCliente.Precio;
            }
            return precioReturn;
        }

        public decimal DamePrecioListaClienteMayorista(int idCliente)
        {
            ServicioClientes servClientes = new ServicioClientes();
            ServicioGenerico servGenerico = new ServicioGenerico();
            decimal precioReturn = -1;

            string codListaMayorista = servGenerico.ParametroObtenerValor("LISTA_MAYORISTA");

            ListaPrecio listaMayorista = this.ObtenerObjeto<ListaPrecio>("Codigo", codListaMayorista);

            if (listaMayorista != null)
            {
                //List<ClienteLista> lista = this.Listar<ClienteLista>("IdCliente", idCliente).ToList<ClienteLista>();
                List<ClienteLista> lista = servClientes.ClienteListaObtenerVigentesCache()
                                                        .Where(item => item.IdCliente == idCliente)
                                                        .ToList<ClienteLista>();

                if (lista != null)
                {
                    ClienteLista cliLista = lista.Find(item => item.ListaPrecio == listaMayorista);
                    if (cliLista != null)
                        precioReturn = cliLista.ListaPrecioCliente.Precio;
                }
            }
            return precioReturn;
        }

        public void PedidoItemEliminar(int idPedidoItem)
        {
            ServicioGenerico servGenerico = new ServicioGenerico();
            RepositoryGenerico<PedidoItem> repository = new RepositoryGenerico<PedidoItem>();
            PedidoItem dato = repository.Obtener(idPedidoItem);

            repository.Eliminar(dato);

            this.PedidoGrabarTotal(dato.IdPedido);
        }

        public async Task<Pedido> PedidoProveedor(int idPedido)
        {
            ServicioGenerico servicio = new ServicioGenerico();
            ServiciosProductos servProductos = new ServiciosProductos();
            string urlMayorista = servicio.ParametroObtenerValor("URL_MAYORISTA");
            string myIdCliente = servicio.ParametroObtenerValor("TRADING_ID_CLIENTE");

            if (string.IsNullOrEmpty(urlMayorista))
                throw new ApplicationException("No está vinculado ningún proveedor mayorista");

            if (string.IsNullOrEmpty(myIdCliente))
                throw new ApplicationException("No tiene asingdo IdCliente en el proveedor mayorista");

            RepositoryGenerico<Pedido> repository = new RepositoryGenerico<Pedido>();
            Pedido pedido = repository.Obtener(idPedido);
            if (pedido == null)
                throw new ApplicationException("No existe pedido");
                        
            //PEdido se se enviara al proveedor
            PedidoDTO pedidoProveedor = new PedidoDTO();
            
                                   
            pedido.Items = this.Listar<PedidoItem>("IdPedido", idPedido).ToList<PedidoItem>();
            //agregamos los productos de nuestro cliente en al app del mayorista
            pedido.Items
                    .FindAll(item => item.Producto.StockPropio == false)
                    .ForEach(delegate(PedidoItem item)
            {
                int cantidadProducto = item.Cantidad;

                PedidoItemDTO itemProveedor = new PedidoItemDTO();
                itemProveedor.Id = -1;
                itemProveedor.CodigoProducto = item.Producto.Codigo;

                if (item.ItemProductos.Count == 0)
                {
                    itemProveedor.Cantidad = item.Cantidad;
                    itemProveedor.Observaciones = string.Format("Cant: {0} - Obs: {1}", item.Cantidad, item.Observaciones); 
                }
                else
                {
                    item.ItemProductos.ToList<PedidoItemProducto>()
                        .ForEach(delegate(PedidoItemProducto pip)
                        {
                            PedidoItemProductoDTO pipProv = new PedidoItemProductoDTO()
                            {
                                Cantidad = pip.Cantidad,
                                Medida = pip.Medida
                            }; 
                            itemProveedor.ItemProductos.Add(pipProv);
                        });
                }
                pedidoProveedor.Items.Add(itemProveedor);
            });

            pedidoProveedor.IdCliente =  myIdCliente.ConvertirInt();
            //enviamos el id y numero del pedido para mantener trazabilidad
            pedidoProveedor.IdPedidoMinorista = pedido.Id;
            pedidoProveedor.NumeroPedidoMinorista = pedido.Numero;

            Pedido nuevoPedidoGenerado = new Pedido();

            using (var httpClient = new HttpClient())
            {

                httpClient.BaseAddress = new Uri(urlMayorista);
                httpClient.DefaultRequestHeaders.Accept.Clear();
                httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                HttpContent httpContent = new StringContent(JsonConvert.SerializeObject(pedidoProveedor), Encoding.UTF8);
                httpContent.Headers.ContentType = new MediaTypeHeaderValue("application/json");

                HttpResponseMessage Res = await httpClient.PostAsync("api/Pedido/Minorista", httpContent);

                if (Res.IsSuccessStatusCode)
                {
                    var pedidoResponse = Res.Content.ReadAsStringAsync().Result;
                    nuevoPedidoGenerado = JsonConvert.DeserializeObject<Pedido>(pedidoResponse);
                }
                else
                {
                    throw new ApplicationException("Error");
                }
            }


            if (nuevoPedidoGenerado.VerificarStock)
            {                
                List<PedidoItem> itemsVerificar = nuevoPedidoGenerado.Items.ToList<PedidoItem>();
                pedido.Items.ToList<PedidoItem>()
                    .ForEach(delegate(PedidoItem pit) 
                    {
                        PedidoItem piVerificar =itemsVerificar.Find(x => x.Producto.Codigo == pit.Producto.Codigo);
                        if (piVerificar != null)
                        {
                            List<PedidoItemProducto> pitNuevoPedido = piVerificar.ItemProductos.ToList<PedidoItemProducto>();

                            if (pit.ItemProductos.Count > 0)
                            {
                                pit.ItemProductos.ToList<PedidoItemProducto>()
                                    .ForEach(delegate(PedidoItemProducto pip)
                                    {
                                        pip.StockDisponible = pitNuevoPedido.Find(x => x.Medida.Descripcion == pip.Medida.Descripcion).StockDisponible;
                                    });
                            }
                        }
                    });
            }
            /**  ATENCION!!!  SI EL PEDIDO VIENE CON VerificarStock  TRUE => NO SE DEBE MODIFICAR EL ESTADO NI LOS NUMEROS DEL PROVEEDRO **/
            //para la trazabilidad, guardo el id y el numero del pedido en el proveedor
            pedido.IdPedidoProveedor = nuevoPedidoGenerado.Id;
            pedido.NumeroPedidoProveedor = nuevoPedidoGenerado.Numero;
            pedido.Estado = this.ObtenerObjeto<Estado>((int)ESTADOS.PROVEEDOR_);                

            repository.Actualizar(pedido);

            return this.PedidoObtener(pedido.Id);
        }


        /// <summary>
        /// procesa los pedidos del minorista, cuidado que tiene los id de Producto del minorista o revendedor NO SON LOS DE Trading
        /// </summary>
        /// <param name="datos"></param>
        /// <returns></returns>
        public Pedido PedidoProcesarMinorista(PedidoDTO datos)
        {
            ServiciosProductos servProductos = new ServiciosProductos();
            
            try
            {
                
                //creamos nuevo pedido como ingresado   
                Pedido nuevoPedido = this.PedidoCrear(datos.IdCliente);

            
                datos.Items.ForEach(delegate(PedidoItemDTO item)
                {
                    PedidoItem itemGraba = new PedidoItem();

                    itemGraba.IdPedido = nuevoPedido.Id;

                    //siempre hay que buscar por codigo porque estos items 
                    itemGraba.Producto = this.ObtenerObjeto<Producto>("Codigo", item.CodigoProducto);
                    
                    itemGraba.Cantidad = item.Cantidad;
                    itemGraba.Observaciones = item.Observaciones;
                    
            
                    List<ProductoStock> listProdStock = itemGraba.Producto.ProductoStock.ToList<ProductoStock>();
                    if (item.ItemProductos.Count == 0)
                    {                        
                        // si entra por aca es porque son pedidos viejos
                        bool esTalleUnico = (listProdStock.Count == 1);
                        listProdStock.ForEach(delegate(ProductoStock ps)
                        {
                            PedidoItemProducto itemPP = new PedidoItemProducto();

                            itemPP.IdPedidoItem = -1;
                            itemPP.IdProductoStock = ps.Id;
                            itemPP.Medida = ps.Medida;
                            itemPP.Cantidad = esTalleUnico ? itemGraba.Cantidad : 0; // si es Talle Unico actualizamos cantidad, si no la dejamos en 0

                            itemGraba.ItemProductos.Add(itemPP);
                        });                        
                    }
                    else
                    {
                        item.ItemProductos.ToList<PedidoItemProductoDTO>()
                        .ForEach(delegate(PedidoItemProductoDTO itemDTO)
                        {
                            ProductoStock prodStock = listProdStock.Find(ps => ps.Medida.Descripcion.Equals(itemDTO.Medida.Descripcion));
                            
                            PedidoItemProducto itemPP = new PedidoItemProducto();
                            itemPP.IdPedidoItem = -1;
                            itemPP.IdProductoStock = prodStock.Id;
                            itemPP.Medida = prodStock.Medida;
                            itemPP.Cantidad = itemDTO.Cantidad;

                            itemGraba.ItemProductos.Add(itemPP);
                        });
                    }

                    this.PedidoItemGrabarSinTotalPedido(itemGraba);

                });
                nuevoPedido = this.PedidoGrabarTotal(nuevoPedido.Id);
                nuevoPedido.Items = this.Listar<PedidoItem>("IdPedido", nuevoPedido.Id).ToList<PedidoItem>();

                //finalizamos el pedido con los id y numero del minorista
                nuevoPedido.IdPedidoMinorista = datos.IdPedidoMinorista;
                nuevoPedido.NumeroPedidoMinorista = datos.NumeroPedidoMinorista;                
                MensajeResponse resp = this.PedidoAvanzar(nuevoPedido, true);
                
                if (resp.Estado == (int)ESTADOS_RESPONSE.ERROR_)
                {

                    //provisoriamente forzamos el SOLICITADO
                    PedidoRepository repository = new PedidoRepository();
                    Pedido ultimo = repository.ObtenerUltimoPedido();
                    nuevoPedido.Numero = (ultimo != null) ? (ultimo.Numero + 1) : 1;
                    nuevoPedido.Fecha = DateTime.Now;
                    nuevoPedido.Estado = this.ObtenerObjeto<Estado>((int)ESTADOS.SOLICITADO_);
                    nuevoPedido.IdPedidoMinorista = datos.IdPedidoMinorista;
                    nuevoPedido.NumeroPedidoMinorista = datos.NumeroPedidoMinorista;

                    repository.PedidoReservarStock(nuevoPedido.Id);
                    CacheManager.RemoveToCache(gobalKeyCache);

                    //Version OK pra cuando este funcionando todo ok
                    //nuevoPedido.Observaciones = string.Format("Falta de Stock - Numero Pedido: {0}", datos.NumeroPedidoMinorista);
                    //nuevoPedido.Estado = this.ObtenerObjeto<Estado>((int)ESTADOS.CANCELADO_);

                    return this.PedidoGrabar(nuevoPedido);
                }
                else
                {
                    return this.PedidoObtener(nuevoPedido.Id);
                }


            }
            catch (Exception ex)
            {
                throw new ApplicationException(string.Format("{0}\n{1}", ex.Message));
            }
        }

        public string ImprimirEtiquetas(int idPedido)
        {
            StringBuilder registros = new StringBuilder();

            Pedido pedido = this.PedidoObtener(idPedido);

            int nroItem = 1;
            decimal precioUnitario = 0;

            registros.AppendLine("NroItem,Codigo,Cantidad,PrecioUnitario");

            pedido.Items.ToList<PedidoItem>()
                .ForEach(delegate (PedidoItem pi)
                {
                    pi.ItemProductos.ToList<PedidoItemProducto>()
                        .ForEach(delegate (PedidoItemProducto pip)
                        {
                            if (pip.Cantidad > 0)
                            {
                                precioUnitario = pi.Producto.PrecioPorPeso ? pi.Precio * pi.Producto.Peso : pi.Precio;

                                registros.AppendLine(string.Format("{0},{1},{2},{3}", nroItem, pi.Producto.Codigo, pip.Cantidad, string.Format("{0} {1:0.00}", pedido.Moneda, precioUnitario)));

                                nroItem++;

                            }
                        });
                });

            pedido.ExsportoEtiquetasCSV = true;
            this.PedidoGrabar(pedido);

            return registros.ToString();
        }
    }    
}
