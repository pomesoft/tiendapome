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

namespace tiendapome.Servicios
{
    public class ServiciosProductos : AbstractService
    {
        const string gobalKeyCache = "TiendaPome";

        public ServiciosProductos() { }

        #region Producto
        public List<Producto> ProductoObtenerVigentesCache(int idSubcategoria)
        {
            //string keyCache = string.Format("GetProductos_{0}", idSubcategoria);

            //List<Producto> listProds = new List<Producto>();
            
            //var productosCache = CacheManager.GetToCache<List<Producto>>(gobalKeyCache, keyCache);
            
            //if (productosCache == null)
            //{
            //    ProductoRepository repository = new ProductoRepository();
            //    listProds = repository.ObtenerProductos(idSubcategoria);
            //    CacheManager.AddToCache(gobalKeyCache, keyCache, listProds);                
            //}
            //else
            //    listProds = productosCache;


            List<Producto> listProds = new List<Producto>();
            ProductoRepository repository = new ProductoRepository();
            listProds = repository.ObtenerProductos(idSubcategoria);
                
            return listProds;
        }

        private List<Producto> ProductoObtenerDelMayorista(bool conStock, int idSubcategoria, string textoBuscar, int idCliente)
        {
            ServicioGenerico servicio = new ServicioGenerico();
            ProductoList prodsMayorista = null;
            List<Producto> listReturn = new List<Producto>();

            string urlMayorista = servicio.ParametroObtenerValor("URL_MAYORISTA");
            if (!string.IsNullOrEmpty(urlMayorista))
            {

                try
                {
                    string keyItem = string.Format("GetProductosMayorista{0}{1}{2}", conStock.ToString(), idSubcategoria.ToString(), textoBuscar);
                    var prodsMayoristaCache = CacheManager.GetToCache<string>(gobalKeyCache, keyItem);

                    if (prodsMayoristaCache == null)
                    {
                        if (textoBuscar == string.Empty) textoBuscar = "1";
                        urlMayorista += string.Format("api/producto/listarbusqueda/{0}/{1}/{2}/{3}/1/250", conStock, idSubcategoria, textoBuscar, idCliente);
                        using (WebClient webClient = new WebClient())
                        {
                            prodsMayoristaCache = webClient.DownloadString(urlMayorista);
                            CacheManager.AddToCache(gobalKeyCache, keyItem, prodsMayoristaCache);
                        }
                    }

                    if (prodsMayoristaCache != null)
                    {
                        prodsMayorista = JsonConvert.DeserializeObject<ProductoList>(prodsMayoristaCache);
                        listReturn = prodsMayorista.Productos;
                        listReturn.ForEach(item => item.StockPropio = false);
                    }
                }
                catch (Exception ex)
                {
                    throw new ApplicationException(string.Format("API Mayorista url: {0} - textoBuscar:{1}", urlMayorista, textoBuscar), ex);
                }

            }
            return listReturn;
        }

        public Producto ProductoObtenerDelMayorista(int codigo)
        {
            ServicioGenerico servicio = new ServicioGenerico();
            ProductoList prodsMayorista = null;
            Producto prodReturn = null;

            string urlMayorista = servicio.ParametroObtenerValor("URL_MAYORISTA");
            if (!string.IsNullOrEmpty(urlMayorista))
            {
                urlMayorista += string.Format("api/producto/buscar/{0}/true/-1/-1", codigo.ToString());
                using (WebClient webClient = new WebClient())
                {
                    var prodResponse = webClient.DownloadString(urlMayorista);
                    prodsMayorista = JsonConvert.DeserializeObject<ProductoList>(prodResponse);
                    if (prodsMayorista != null)
                    {
                        prodReturn = prodsMayorista.Productos[0];
                    }
                }
            }
            return prodReturn;
        }

        public ProductoList ProductoBusqueda(string buscar, bool soloCodigo, bool conStock, int numeroPagina, int cantidadRegistros)
        {
            ProductoRepository repository = new ProductoRepository();
            List<Producto> listProdsTotal = new List<Producto>();
            List<Producto> listProds = new List<Producto>();
            
            if (soloCodigo)
            {
                listProdsTotal.Add(this.ObtenerObjeto<Producto>("Codigo", buscar.ConvertirInt()));
                listProds.Add(this.ObtenerObjeto<Producto>("Codigo", buscar.ConvertirInt()));
            }
            else
            {
                listProdsTotal = repository.BuscarProductos(buscar, conStock, false, numeroPagina, cantidadRegistros);
                listProds = repository.BuscarProductos(buscar, conStock, true, numeroPagina, cantidadRegistros);
            }

            ProductoList listReturn = new ProductoList();
            listReturn.TotalFilas = listProdsTotal.Count;
            listReturn.Productos = listProds;
            return listReturn;
        }

        public ProductoList ProductoListarABM(int idSubcategoria, int tipoListado, int numeroPagina, int cantidadRegistros)
        {
            //este metodo no lee los datos del Cache
            ServicioGenerico servGenerico = new ServicioGenerico();
            
            ProductoRepository repository = new ProductoRepository();
            List<Producto> listProds = new List<Producto>();
            
            string url_host = servGenerico.ParametroObtenerValor("URL_HOST");
            
            
            List<Producto> listProdsFull = new List<Producto>();

            bool paginar = (numeroPagina != -1 && cantidadRegistros != -1);


            switch (tipoListado)
            {
                case 1:
                    listProdsFull.AddRange(this.Listar<Producto>("Subcategoria.Id", idSubcategoria).ToList<Producto>());
                    break;

                case 2:
                    //listar solo productos CON stock
                    listProdsFull.AddRange(this.Listar<Producto>("Subcategoria.Id", idSubcategoria).ToList<Producto>()
                                            .FindAll(item => item.Stock > 0).ToList<Producto>());
                    break;

                case 3:
                    //listar solo productos SIN stock
                    listProdsFull.AddRange(this.Listar<Producto>("Subcategoria.Id", idSubcategoria).ToList<Producto>()
                                            .FindAll(item => item.Stock <= 0).ToList<Producto>());
                    break;
            }



            int totalFilas = listProdsFull.Count;

            if (paginar)
            {
                int nro_fila = 1;
                listProdsFull.ForEach(delegate(Producto item)
                {
                    item.NroFila = nro_fila;
                    nro_fila++;
                });
                int filaDesde = (numeroPagina - 1) * cantidadRegistros;
                int filaHasta = filaDesde + cantidadRegistros;
                listProds = listProdsFull.FindAll(item => item.NroFila > filaDesde && item.NroFila <= filaHasta);
            }
            else
            {
                listProds = listProdsFull;
            }

            ProductoList listReturn = new ProductoList();
            listReturn.TotalFilas = totalFilas;
            listReturn.Productos = listProds;
            return listReturn;
        }

        public ProductoList ProductoListarEstamosEnMantenimiento()
        {
            ServicioGenerico servGenerico = new ServicioGenerico();

            string url_host = servGenerico.ParametroObtenerValor("URL_HOST");

            List<Producto> listProds = new List<Producto>();

            listProds.Add(new Producto()
            {
                Id = 9999,
                Descripcion = "Estamos en mantenimiento",
                Vigente = true,
                Codigo = 9999,
                Stock = 1,
                StockPropio = true,
                FotoLink = string.Format("{0}{1}", url_host, "/assets/img/EnMantenimiento.png"),
                Subcategoria = new Subcategoria()
                {
                    Id = 1,
                    Descripcion = "Estamos en mantenimiento",
                    Vigente = true,
                    Carpeta = "",
                    CantidadProductos = 1,
                    DescripcionFull = "Estamos en mantenimiento",
                    IdDescripcion = "1"
                },
                ListaPrecio = new ListaPrecio()
                {
                    Id = 6,
                    Descripcion = "",
                    Vigente = true,
                    Codigo = "",
                    Precio = 0,
                    IdDescripcion = ""
                },
                PrecioUnitarioFinal = 0,
                PrecioUnitarioProcesado = 0,
                MonedaVenta = "",
                ProductoPedido = false,
                CantidadPedido = 0,
                NroFila = 1,
                Path = "",
                IdTipo = 1,
                IdCategoria = 1,
                DescripcionTipo = "",
                DescripcionCategoria = "",
                DescripcionSubcategoria = "Estamos en mantenimiento",
                PrecioPorPeso = true,
                PrecioPorPieza = false,
                IdDescripcion = ""
            });

            ProductoList listReturn = new ProductoList();
            listReturn.TotalFilas = 1;
            listReturn.Productos = listProds;
            return listReturn;
        }

        public SubcategoriaMerge ObtenerSubcategoriaMerge(int idSubCategoriaMinorista)
        {
            //List<SubcategoriaMerge> listSubcateMerge = this.Listar<SubcategoriaMerge>("IdSubcategoriaMayorista", idSubCategoriaMayorista).ToList<SubcategoriaMerge>();
            List<SubcategoriaMerge> listSubcateMerge = this.Listar<SubcategoriaMerge>("IdSubcategoriaMinorista", idSubCategoriaMinorista).ToList<SubcategoriaMerge>();
            SubcategoriaMerge scReturn = null;
            if (listSubcateMerge != null && listSubcateMerge.Count > 0)
                scReturn = listSubcateMerge[0];

            return scReturn;
        }
            

        public ProductoList ProductoListarCarrito(bool conStock, int idSubcategoria, string textoBuscar, int idCliente, int numeroPagina, int cantidadRegistros)
        {
            ServiciosPedido servPedido = new ServiciosPedido();
            ServicioGenerico servGenerico = new ServicioGenerico();

            ProductoRepository repository = new ProductoRepository();
            List<Producto> listProds = new List<Producto>();
            List<PedidoItem> pedidoItems = new List<PedidoItem>();

            /* MONEDA_VENTA => Se parametriza desde el ABM de Cotizaciones
             * valores posibles
             * * PESO_ARGENTINO 
             * * DOLAR_EEUU 
             */

            /*Parametros del sistema*/
            string monedaVenta = servGenerico.ParametroObtenerValor("MONEDA_VENTA");
            string url_host = servGenerico.ParametroObtenerValor("URL_HOST");
            string myIdCliente = servGenerico.ParametroObtenerValor("TRADING_ID_CLIENTE");

            List<ClienteLista> listaCliente = null;

            if (idCliente > 0)
            {
                ServicioClientes servClientes = new ServicioClientes();
                listaCliente = servClientes.ClienteListaObtenerVigentesCache()
                                                        .Where(item => item.IdCliente == idCliente)
                                                        .ToList<ClienteLista>();
                //Pedido pedido = servPedido.PedidoObtenerClienteIngresado(idCliente, -1, -1);
            }
            else
            {
                //cuando se muestra el carrito a usuarios no registrados se fuerza PESO_ARGENTINO
                monedaVenta = "PESO_ARGENTINO";
            }

            decimal cotizacionDolar = this.CotizacionDolarVigente().Cotizacion;

            List<Producto> listProdsFull = new List<Producto>();

            if (idSubcategoria != -1)
            {
                //1ro se obtienen y listan los productos del MONORISTA

                if (textoBuscar.Contains("ETIQUETA=NOVEDAD"))
                {
                    listProdsFull.AddRange(this.ProductoObtenerVigentesCache(idSubcategoria)
                                                .FindAll(item => item.Stock > 0 && item.Etiquetas.Contains("NOVEDAD"))
                                                .OrderBy(item => item.Orden)
                                                .ToList<Producto>());
                }
                else
                {
                    List<Producto> listAux = this.ProductoObtenerVigentesCache(idSubcategoria);
                    listProdsFull.AddRange(listAux
                                        .FindAll(item => item.Stock > 0)
                                        .OrderBy(item => item.Orden)
                                        .ToList<Producto>());
                }
                
                //despues se buscan los del mayorista
                SubcategoriaMerge subcateMerge = this.ObtenerSubcategoriaMerge(idSubcategoria);
                if (subcateMerge != null && subcateMerge.IdSubcategoriaMayorista > 0)
                { 
                    idSubcategoria = subcateMerge.IdSubcategoriaMayorista;
                    textoBuscar = subcateMerge.Etiqueta;
                }
            }
            else
            {
                listProdsFull.AddRange(repository.BuscarProductos(textoBuscar, conStock, true, 1, 100));
            }

            //2ro se obtienen y listan los productos del MAYORISTA
            listProdsFull.AddRange(this.ProductoObtenerDelMayorista(conStock, idSubcategoria, textoBuscar, myIdCliente.ConvertirInt()));
            
            int totalFilas = listProdsFull.Count;

            bool paginar = (numeroPagina != -1 && cantidadRegistros != -1);

            if (paginar)
            {
                int nro_fila = 1;
                listProdsFull                    
                    .ForEach(delegate(Producto item)
                {
                    item.NroFila = nro_fila;
                    nro_fila++;
                });
                int filaDesde = (numeroPagina - 1) * cantidadRegistros;
                int filaHasta = filaDesde + cantidadRegistros;
                listProds = listProdsFull.FindAll(item => item.NroFila > filaDesde && item.NroFila <= filaHasta);
            }
            else
            {
                listProds = listProdsFull;
            }
                        

            listProds.ForEach(delegate(Producto prod)
            {
                if (prod.StockPropio)
                    prod = ProcesarStockPropio(listaCliente, url_host, prod);
                else
                    prod = ProcesarStockMayorista(idCliente, prod);

                prod.MonedaVenta = monedaVenta == "DOLAR_EEUU" ? "USD" : "$";
                if (monedaVenta != "DOLAR_EEUU")
                    prod.PrecioUnitarioFinal = Decimal.Round(prod.PrecioUnitarioProcesado * cotizacionDolar, 2);
                else
                    prod.PrecioUnitarioFinal = Decimal.Round(prod.PrecioUnitarioProcesado, 2);


                prod.CantidadPedido = 0;
                prod.ProductoPedido = false;               
               
            });        

            ProductoList listReturn = new ProductoList();
            listReturn.TotalFilas = totalFilas;
            listReturn.Productos = listProds;
            return listReturn;
        }

        public Producto ProcesarStockPropio(List<ClienteLista> listaCliente, string url_host, Producto prod)
        {
            /*URL DE LA FOTO*/
            //if (prod.Foto != null)
            //    prod.FotoLink = string.Format("{0}{1}{2}{3}", url_host, "assets/fotos", prod.Path, prod.Foto);
            
            /*CALCULO DEL PRECIO SEGUN LISTA*/
            ServiciosPedido servPedido = new ServiciosPedido();
            decimal precioListaCliente = servPedido.DamePrecioListaCliente(listaCliente, prod);
            
            //determinar precio del producto puede ser de la lista del producto o la asignada al cliente            
            decimal precio = 0;

            if (precioListaCliente != -1)
            {
                if (prod.PrecioPorPeso)
                    precio = precioListaCliente;
                else
                    precio = prod.PrecioUnitario - ((precioListaCliente * prod.PrecioUnitario) / 100);
            }
            else
            {
                if (prod.PrecioPorPeso)
                    precio = prod.ListaPrecio.Precio;
                else
                    precio = prod.PrecioUnitario;
            }

            prod.PrecioUnitarioProcesado = precio;

            return prod;
        }

        public Producto ProcesarStockMayorista(int idCliente, Producto prod)
        {            
            /*URL DE LA FOTO*/
            /*Se usa la URL del mayorista*/
            ServicioGenerico servGenerico = new ServicioGenerico();
            decimal myGanancia = servGenerico.ParametroObtenerValor("PORC_GANANCIA_GRAL").ConvertirDecimal();
            
            //Para revendedor, el precio unitario es el precio final del mayorista mas la ganancia
            prod.PrecioUnitario = prod.PrecioUnitarioFinal;

            if (myGanancia > 0)
                prod.PrecioUnitario = prod.PrecioUnitarioFinal + ((prod.PrecioUnitarioFinal * myGanancia) / 100);

            /*CALCULO DEL PRECIO SEGUN LISTA*/
            ServiciosPedido servPedido = new ServiciosPedido();
            decimal precioListaCliente = servPedido.DamePrecioListaClienteMayorista(idCliente);

            decimal precio = 0;         
   
            //Aplicamos descuento para clientes que tengan asignada lista
            if (precioListaCliente != -1)
                precio = prod.PrecioUnitario - ((precioListaCliente * prod.PrecioUnitario) / 100);
            else
                precio = prod.PrecioUnitario;
             
            prod.PrecioUnitarioProcesado = precio;

            return prod;
        }


        public Producto ProductoMayoristaGrabar(Producto datoGraba)
        {
            ProductoRepository repository = new ProductoRepository();
            RepositoryGenerico<ProductoStock> repProdStock = new RepositoryGenerico<ProductoStock>();

            Producto dato = repository.ObtenerProductoMayorista(datoGraba.Codigo);
            if (dato == null) dato = new Producto();
                        
            dato.Vigente = true;
            dato.Codigo = datoGraba.Codigo;
            dato.Descripcion = datoGraba.Descripcion;
            dato.Peso = datoGraba.Peso;
            dato.TipoPrecio = datoGraba.TipoPrecio;
            dato.PrecioUnitario = datoGraba.PrecioUnitarioFinal;
            dato.StockPropio = false;
            dato.FotoLink = datoGraba.FotoLink;
            
            repository.Actualizar(dato);
            dato = repository.Obtener(dato.Id);

            List<ProductoStock> listProdStock = this.ProductoStockListar(dato.Codigo);
            List<Medida> listMedidas = this.Listar<Medida>();

            datoGraba.ProductoStock.ToList<ProductoStock>()
                .ForEach(delegate(ProductoStock item)
            {
                ProductoStock prodStock = listProdStock.Find(ps => ps.Medida.Descripcion.Equals(item.Medida.Descripcion));
                if (prodStock == null)
                {
                    prodStock = new ProductoStock();
                    prodStock.IdProducto = dato.Id;
                    prodStock.Medida = listMedidas.Find(m => m.Descripcion.Equals(item.Medida.Descripcion));
                    repProdStock.Actualizar(prodStock);
                    dato.ProductoStock.Add(prodStock);
                }
            });

            repository.Actualizar(dato);

            return repository.Obtener(dato.Id);
        }

        public List<ProductoStock> ProductoStockListar(int codigo)
        {
            ProductoRepository repository = new ProductoRepository();
            return repository.ObtenerProductoStockMayorista(codigo);
        }

        public Producto ProductoGrabar(Producto datoGraba, string carpetaFoto)
        {
            ServicioGenerico servGenerico = new ServicioGenerico();
            ProductoRepository repository = new ProductoRepository();
            Producto dato;

            string pathOrigen = string.Empty;

            if (datoGraba.Id == -1)
            {
                dato = new Producto();
                string codigoAutomatico = servGenerico.ParametroObtenerValor("CODIGO_AUTOMATICO");
                string primerCodigo = servGenerico.ParametroObtenerValor("PRIMER_CODIGO_AUTOMATICO");

                if (codigoAutomatico != null && codigoAutomatico.Equals("SI"))
                {
                    Producto ultimo = repository.ObtenerUltimoProducto();
                    if (ultimo == null)
                        dato.Codigo = primerCodigo.ConvertirInt();
                    else
                        dato.Codigo = ultimo.Codigo + 1;
                }
            }
            else
            {
                dato = repository.Obtener(datoGraba.Id);
                if (dato == null) throw new ApplicationException("No existe Producto");
                pathOrigen = dato.Path;
            }


            string url_host = servGenerico.ParametroObtenerValor("URL_HOST");


            if (!string.IsNullOrEmpty(datoGraba.Foto))
            {
                Producto validar = null;
                validar = repository.Obtener("Foto", datoGraba.Foto);
                if (validar != null && validar.Id != datoGraba.Id)
                    throw new ApplicationException("Ya existe un producto con la misma foto");
            }
                        
            dato.Vigente = true;
            dato.Descripcion = datoGraba.Descripcion;
            
            dato.Peso = datoGraba.Peso;
            dato.TipoPrecio = datoGraba.TipoPrecio;
            
            if (dato.PrecioPorPeso)
                dato.PrecioUnitario = 0;
            else
                dato.PrecioUnitario = datoGraba.PrecioUnitario;

            bool cambioSubcategoria = (dato.Subcategoria != null && dato.Subcategoria.Id != datoGraba.Subcategoria.Id);
            dato.Subcategoria = this.ObtenerObjeto<Subcategoria>(datoGraba.Subcategoria.Id);

            dato.Ubicacion = datoGraba.Ubicacion;
            
            dato.Foto = datoGraba.Foto;

            if (string.IsNullOrEmpty(dato.FotoLink) && !string.IsNullOrEmpty(dato.Foto))
                dato.FotoLink = string.Format("{0}{1}{2}{3}", url_host, "assets/fotos", dato.Path, dato.Foto);

            dato.ListaPrecio = this.ObtenerObjeto<ListaPrecio>(datoGraba.ListaPrecio.Id);

            //este gtupo orden no puede quedar null, para esos casos va GRUPOS_ORDEN.DEFAULT_ que es 1
            ProductoGrupoOrden gpo = null;
            if (datoGraba.GrupoOrden.Id > 1)
                gpo = this.ObtenerObjeto<ProductoGrupoOrden>(datoGraba.GrupoOrden.Id);
            else
                gpo = this.ObtenerObjeto<ProductoGrupoOrden>((int) GRUPOS_ORDEN.DEFAULT_);

            if (gpo != null) dato.GrupoOrden = gpo;
            
            dato.Stock = datoGraba.Stock;
            dato.StockPropio = true;

            repository.Actualizar(dato);
            this.ProductoStockGrabar(datoGraba, dato.Id, cambioSubcategoria);                        

            //if (!string.IsNullOrEmpty(dato.Foto) && pathOrigen != dato.Path)
            //{
            //    string pathRoot = carpetaFoto.Substring(0, carpetaFoto.Length - 1);
            //    string fileOrigen = string.Format("{0}{1}{2}", pathRoot, pathOrigen, dato.Foto);
            //    string fileDestino = string.Format("{0}{1}{2}", pathRoot, dato.Path, dato.Foto);
            //    FileHelper.CopyFile(fileOrigen.Replace(@"/", @"\"), fileDestino.Replace(@"\", @"/"), true);
            //    FileHelper.DeleteFile(fileOrigen);

            //    dato = repository.Obtener(dato.Id);
            //    dato.FotoLink = string.Format("{0}{1}{2}{3}", url_host, "assets/fotos", dato.Path, dato.Foto);
            //    repository.Actualizar(dato);
            //}

            CacheManager.RemoveToCache(gobalKeyCache);

            return this.ObtenerObjeto<Producto>(dato.Id);
        }

        public void ProductoStockGrabar(Producto datoGraba, int idProducto, bool cambioSubcategoria)
        {
            RepositoryGenerico<ProductoStock> repository = new RepositoryGenerico<ProductoStock>();

            //if (cambioSubcategoria)
            //    repository.EliminarRegistros("tp_ProductoStock", string.Format("IdProducto = {0}", idProducto));

            datoGraba.ProductoStock.ToList<ProductoStock>().ForEach(delegate(ProductoStock item)
            {
                ProductoStock dato = null;
                if (item.Id != -1)
                    dato = repository.Obtener(item.Id);
                else
                {
                    dato = new ProductoStock();
                    dato.IdProducto = item.IdProducto > 0 ? item.IdProducto : idProducto;
                    dato.Medida = item.Medida;
                }
                bool agregarMovimientoStock = (dato.Stock != item.Stock);
                dato.Stock = item.Stock;
                dato.Reservado = item.Reservado;
                
                repository.Actualizar(dato);

                if (agregarMovimientoStock)
                    this.ProductoStockMovimientoGrabar(dato, 1, "Administrador de productos");
            });
            
        }

        public void ProductoStockActualizarStock(int idProductoStock, int cantidad, bool descuenta )
        {
            RepositoryGenerico<ProductoStock> repository = new RepositoryGenerico<ProductoStock>();
            
            ProductoStock dato = repository.Obtener(idProductoStock);

            if (dato == null)
                throw new ApplicationException("No existe el producto");

            if (descuenta)
                dato.Stock = dato.Stock - cantidad;
            else
                dato.Stock = dato.Stock + cantidad;

            repository.Actualizar(dato);
        }

        public void ProductoStockMovimientoGrabar(ProductoStock ps, int idMovimiento, string observaciones)
        {
            RepositoryGenerico<ProductoStockMovimiento> repository = new RepositoryGenerico<ProductoStockMovimiento>();

            ProductoStockMovimiento dato = new ProductoStockMovimiento();
            dato.Id = -1;
            dato.IdProductoStock = ps.Id;
            dato.IdTipoMovimiento = idMovimiento;
            dato.Fecha = DateTime.Now;
            dato.Cantidad = ps.Stock;
            dato.Observaciones = observaciones;

            repository.Actualizar(dato);
        }

        public Producto ProductoEliminar(int id)
        {
            ProductoRepository repository = new ProductoRepository();
            
            Producto dato;

            dato = repository.Obtener(id);

            if (dato == null)
                throw new ApplicationException("No existe Producto");

            repository.ProductoEliminarMovimientosStock(id);
            repository.Eliminar(dato);

            CacheManager.RemoveToCache(gobalKeyCache);
            return dato;
        }
        public Producto ProductoSinStock(int idProducto)
        {
            RepositoryGenerico<ProductoStock> repository = new RepositoryGenerico<ProductoStock>();

            List<ProductoStock> prodStock = this.Listar<ProductoStock>("IdProducto", idProducto).ToList<ProductoStock>();

            if (prodStock == null)
                throw new ApplicationException("No existe Producto");

            prodStock.ForEach(delegate(ProductoStock ps) 
            {
                ps.Stock = 0;
                ps.Reservado = 0;
                repository.Actualizar(ps);
            });
            
            CacheManager.RemoveToCache(gobalKeyCache);

            return this.ObtenerObjeto<Producto>(idProducto);
        }
        
        #endregion
        
        #region ListaPrecio por Producto
        public ListaPrecio ListaPrecioGrabar(ListaPrecio datoGraba)
        {
            RepositoryGenerico<ListaPrecio> repository = new RepositoryGenerico<ListaPrecio>();
            ListaPrecio dato;

            if (datoGraba.Id == -1)
                dato = new ListaPrecio();
            else
            {
                dato = repository.Obtener(datoGraba.Id);
                if (dato == null) throw new ApplicationException("No existe Lista de Precio");
            }

            dato.Vigente = datoGraba.Vigente;
            dato.Descripcion = datoGraba.Descripcion;
            dato.Codigo = datoGraba.Codigo;
            dato.Precio = datoGraba.Precio;

            repository.Actualizar(dato);

            CacheManager.ForceRemoveToCache(gobalKeyCache, "GetClienteLista");

            return dato;
        }

        public ListaPrecio ListaPrecioEliminar(int id)
        {
            RepositoryGenerico<ListaPrecio> repository = new RepositoryGenerico<ListaPrecio>();
            ListaPrecio dato;

            dato = repository.Obtener(id);

            if (dato == null)
                throw new ApplicationException("No existe Lista de Precio");

            repository.Eliminar(dato);

            return dato;
        }
        #endregion

        #region ListaPrecio por Cliente
        public List<ListaPrecioCliente> ListaPrecioClienteObtenerVigentesCache()
        {
            ServicioGenerico servicio = new ServicioGenerico();
            List<ListaPrecioCliente> listReturn = new List<ListaPrecioCliente>();

            var tiposCache = CacheManager.GetToCache<List<ListaPrecioCliente>>(gobalKeyCache, "GetListaPrecioCliente");

            if (tiposCache == null)
            {
                listReturn = servicio.Listar<ListaPrecioCliente>().ToList<ListaPrecioCliente>();
                if (listReturn == null) listReturn = new List<ListaPrecioCliente>();
                CacheManager.AddToCache(gobalKeyCache, "GetListaPrecioCliente", listReturn);
            }
            else
            {
                listReturn = tiposCache;
            }
            //listReturn = servicio.Listar<ListaPrecioCliente>().ToList<ListaPrecioCliente>();

            return listReturn;
        }
        public ListaPrecioCliente ListaPrecioClienteGrabar(ListaPrecioCliente datoGraba)
        {
            RepositoryGenerico<ListaPrecioCliente> repository = new RepositoryGenerico<ListaPrecioCliente>();
            ListaPrecioCliente dato;

            if (datoGraba.Id == -1)
                dato = new ListaPrecioCliente();
            else
            {
                dato = repository.Obtener(datoGraba.Id);
                if (dato == null) throw new ApplicationException("No existe Lista de Precio");
            }

            dato.Vigente = datoGraba.Vigente;
            dato.Descripcion = datoGraba.Descripcion;
            dato.Codigo = datoGraba.Codigo;
            dato.Precio = datoGraba.Precio;
            dato.ListaPrecio = this.ObtenerObjeto<ListaPrecio>(datoGraba.ListaPrecio.Id);

            repository.Actualizar(dato);

            return dato;
        }

        public ListaPrecioCliente ListaPrecioClienteEliminar(int id)
        {
            RepositoryGenerico<ListaPrecioCliente> repository = new RepositoryGenerico<ListaPrecioCliente>();
            ListaPrecioCliente dato;

            dato = repository.Obtener(id);

            if (dato == null)
                throw new ApplicationException("No existe Lista de Precio");

            repository.Eliminar(dato);

            return dato;
        }
        #endregion

        #region CotizacionDolar
        public List<CotizacionDolar> CotizacionDolarObtenerCache()
        {
            List<CotizacionDolar> listReturn = new List<CotizacionDolar>();

            var dataCache = CacheManager.GetToCache<List<CotizacionDolar>>(gobalKeyCache, "GetCotizacionDolar");

            if (dataCache == null)
                listReturn = this.CotizacionDolarActualizarCache();
            else
                listReturn = dataCache;

            return listReturn;
        }
        public List<CotizacionDolar> CotizacionDolarActualizarCache()
        {
            List<CotizacionDolar> listReturn = this.Listar<CotizacionDolar>().ToList<CotizacionDolar>();
            CacheManager.AddToCache(gobalKeyCache, "GetCotizacionDolar", listReturn);
            return listReturn;
        }
        public CotizacionDolar CotizacionDolarVigente()
        {
            CotizacionDolar dato = null;

            if (this.CotizacionDolarObtenerCache().Count > 0)
                dato = this.CotizacionDolarObtenerCache()
                            .OrderByDescending(item => item.Fecha)
                            .First();

            if (dato == null)
            {
                dato = new CotizacionDolar();
                dato.Cotizacion = 1;
                dato.Fecha = DateTime.Now;
            }
            return dato;
        }
        public CotizacionDolar CotizacionDolarGrabar(CotizacionDolar datoGraba)
        {
            RepositoryGenerico<CotizacionDolar> repository = new RepositoryGenerico<CotizacionDolar>();
            CotizacionDolar dato;

            if (datoGraba.Fecha == DateTime.MinValue)
                datoGraba.Fecha = DateTime.Now;

            CotizacionDolar existe = this.Listar<CotizacionDolar>()
                                        .Find(item => item.FechaToString == datoGraba.FechaToString);

            if (existe == null)
                dato = new CotizacionDolar();
            else
                dato = repository.Obtener(existe.Id);
            
            dato.Cotizacion = datoGraba.Cotizacion;
            dato.Fecha = datoGraba.Fecha;

            repository.Actualizar(dato);
            
            return dato;
        }
        public CotizacionDolar CotizacionDolarEliminar(int id)
        {
            RepositoryGenerico<CotizacionDolar> repository = new RepositoryGenerico<CotizacionDolar>();
            CotizacionDolar dato;

            dato = repository.Obtener(id);

            if (dato == null)
                throw new ApplicationException("No existe Cotización");

            repository.Eliminar(dato);

            return dato;
        }
        #endregion


        #region Exportar
        public IDictionary ExportarListadoProductos(int idSubcategoria, int tipoListado)
        {

            ProductoList listProductos = this.ProductoListarABM(idSubcategoria, tipoListado , -1, -1);

            IDictionary datos = new Hashtable();

            datos.Add("Listado", listProductos.Productos);

            return datos;
        }
        #endregion
    }        
}
