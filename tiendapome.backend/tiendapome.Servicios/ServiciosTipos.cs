using System;
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
    public class ServiciosTipos: AbstractService
    {
        const string gobalKeyCache = "TiendaPome";

        public ServiciosTipos() { }


        #region ABM Tipos
        public List<Tipo> TipoObtenerVigentesCache()
        {
            ServicioGenerico servicio = new ServicioGenerico();
            List<Tipo> listReturn = new List<Tipo>();

            var tiposCache = CacheManager.GetToCache<List<Tipo>>(gobalKeyCache, "GetTipos");

            if (tiposCache == null)
            {

                listReturn.AddRange(servicio.Listar<Tipo>("Visible", true).ToList<Tipo>());

                //junto los tipos del mayorista con los del propio carrito
                //SIEMPRE SE DEBEN LISTAR LOS TIPOS DEL MAYORISTA ANTES DE LOS TIPOS DEL MINORISTAS PARA QUE FUNCIONE BIEN LA COMPAGINACION POR DESCRIPCION.
                List<Tipo> tiposMayorista = this.TipoObtenerDelMayorista();

                //si tiene parametrizada fotos distintas a las del mayorista, se reemplazan a las que devuelve el servicio del mayorista
                List<TipoPortada> listPortada = this.Listar<TipoPortada>();
                if (tiposMayorista.Count > 0 && listPortada.Count > 0)
                {
                    tiposMayorista.ForEach(delegate(Tipo tipo)
                    {
                        TipoPortada tPortada = listPortada.Find(item => item.IdTipo == tipo.Id);
                        if (tPortada != null && tPortada.Visible)
                        {
                            tipo.Descripcion = tPortada.Descripcion;
                            tipo.Foto = tPortada.Foto;
                            tipo.Visible = true;
                            listReturn.Add(tipo);
                        }
                    });
                }

                if (listReturn == null) listReturn = new List<Tipo>();
                CacheManager.AddToCache(gobalKeyCache, "GetTipos", listReturn);
            }
            else
            {
                listReturn = tiposCache;
            }
            //.OrderBy(item => item.Descripcion)
            return listReturn.ToList<Tipo>();
        }
        private List<Tipo> TipoObtenerDelMayorista()
        {
            ServicioGenerico servicio = new ServicioGenerico();
            List<Tipo> listReturn = new List<Tipo>();
            string urlMayorista = servicio.ParametroObtenerValor("URL_MAYORISTA");
            if (!string.IsNullOrEmpty(urlMayorista))
            {
                urlMayorista += "api/tipo";
                using (WebClient webClient = new WebClient())
                {
                    var json = webClient.DownloadString(urlMayorista);
                    listReturn = JsonConvert.DeserializeObject<List<Tipo>>(json);
                }

            }
            return listReturn;
        }
        //el TipoListar para el ABM lo pase al ServicioCatalogos
        public List<Tipo> TipoListar(bool listarABM)
        {
            List<Tipo> listTipos = null;
            if (listarABM)
                listTipos = this.ListarVigentes<Tipo>();
            else
                listTipos = this.TipoObtenerVigentesCache().ToList<Tipo>();
            //.OrderBy(item => item.Descripcion)

            listTipos
                .ForEach(delegate(Tipo tipo)
                {
                    tipo.CantidadProductos = 0;
                    tipo.Categorias.ToList<Categoria>().ForEach(delegate(Categoria categoria)
                    {
                        categoria.CantidadProductos = 0;
                        categoria.Subcategorias.ToList<Subcategoria>().ForEach(delegate(Subcategoria subcategoria)
                        {
                            subcategoria.CantidadProductos = subcategoria.CantidadProductos;
                            categoria.CantidadProductos += subcategoria.CantidadProductos;
                        });
                        tipo.CantidadProductos += categoria.CantidadProductos;
                    });
                });

            List<Tipo> listReturn = new List<Tipo>();
            //si es para el carrito, compagino tipos y categorias
            //si es para el abm no se compagina nada
            if (listarABM)
                listReturn = listTipos;
            else
                listTipos
                    .OrderBy(item => item.Orden).ToList<Tipo>()
                    .ForEach(delegate(Tipo tipo)
                    {
                        //compagino tipos, categorias y subcategorias
                        Tipo tmerge = listReturn.Find(item => item.Descripcion == tipo.Descripcion);
                        if (tmerge == null)
                            listReturn.Add(tipo);
                        else
                        {
                            tipo.Categorias.ToList<Categoria>().ForEach(delegate(Categoria cate)
                            {
                                Categoria cmerge = tmerge.Categorias.ToList<Categoria>().Find(item => item.Descripcion == cate.Descripcion);
                                if (cmerge == null)
                                    tmerge.Categorias.Add(cate);
                                else
                                    cate.Subcategorias.ToList<Subcategoria>().ForEach(delegate(Subcategoria subcate)
                                    {
                                        if (cmerge.Subcategorias.ToList<Subcategoria>().Find(item => item.Descripcion == subcate.Descripcion) == null)
                                            cmerge.Subcategorias.Add(subcate);
                                    });

                            });

                        }
                    });

            return listReturn;
        }

        public List<Tipo> TipoListarABM()
        {
            List<Tipo> listTipos = this.ListarVigentes<Tipo>();
            List<SubcategoriaMedida> listMedidas = this.Listar<SubcategoriaMedida>();
            
            listTipos.ForEach(delegate(Tipo tipo)
            {
                tipo.CantidadProductos = 0;
                tipo.Categorias.ToList<Categoria>().ForEach(delegate(Categoria categoria)
                {
                    categoria.CantidadProductos = 0;
                    categoria.Subcategorias.ToList<Subcategoria>().ForEach(delegate(Subcategoria subcategoria)
                    {
                        subcategoria.CantidadProductos = subcategoria.CantidadProductos;
                        categoria.CantidadProductos += subcategoria.CantidadProductos;

                        subcategoria.Medidas = listMedidas.FindAll(item => item.IdSubcategoria == subcategoria.Id);
                    });
                    tipo.CantidadProductos += categoria.CantidadProductos;
                });
            });

            return listTipos;
        }

        public Tipo TipoObtener(int id)
        {
            Tipo Tipo = this.ObtenerObjeto<Tipo>(id);
            return Tipo;
        }

        public Tipo TipoGrabar(Tipo datoGraba)
        {
            RepositoryGenerico<Tipo> repository = new RepositoryGenerico<Tipo>();
            Tipo dato = null;

            if (datoGraba.Id == -1)
            {
                dato = new Tipo();
                datoGraba.Vigente = true;
            }
            else
            {
                dato = repository.Obtener(datoGraba.Id);
                if (dato == null)
                    throw new ApplicationException("No existe el Tipo");
            }

            dato.Descripcion = datoGraba.Descripcion;
            dato.Vigente = datoGraba.Vigente;
            dato.Foto = datoGraba.Foto;
            dato.Carpeta = datoGraba.Carpeta;
            dato.Visible = datoGraba.Visible;
            dato.Orden = datoGraba.Orden;

            dato.Validar();

            repository.Actualizar(dato);
            CacheManager.RemoveToCache(gobalKeyCache);

            return dato;
        }
        public Tipo TipoEliminar(int id)
        {
            RepositoryGenerico<Tipo> repository = new RepositoryGenerico<Tipo>();
            Tipo dato;
            
            dato = repository.Obtener(id);

            if (dato == null)
                throw new ApplicationException("No existe Tipo");
            if (dato.Categorias.Count > 0)
                throw new ApplicationException("No se puede eliminar el tipo, tiene Categorías asignadas.");

            repository.Eliminar(dato);

            return dato;
        }
        #endregion

        #region ABM Categorias 
        public Categoria CategoriaObtener(int id)
        {
            Categoria Categoria = this.ObtenerObjeto<Categoria>(id);
            return Categoria;
        }

        public void CategoriaGrabar(Categoria datoGraba)
        {
            RepositoryGenerico<Categoria> repository = new RepositoryGenerico<Categoria>();
            Categoria dato = null;

            Tipo tipo = this.ObtenerObjeto<Tipo>(datoGraba.IdTipo);
            
            if (datoGraba.Id == -1)
            {
                dato = new Categoria();
                datoGraba.Vigente = true;

                if (tipo != null 
                    && tipo.Categorias.ToList<Categoria>().Find(item => item.Descripcion == datoGraba.Descripcion) != null)
                        throw new ApplicationException(string.Format("La Categoría ya existe para el Tipo: {0}", tipo.Descripcion));
                
            }
            else
            {
                dato = repository.Obtener(datoGraba.Id);
                if (dato == null)
                    throw new ApplicationException("No existe el Categoria");
            }

            dato.Descripcion = datoGraba.Descripcion;
            dato.Vigente = datoGraba.Vigente;
            dato.Foto = datoGraba.Foto;
            dato.Carpeta = datoGraba.Carpeta;
            dato.Orden = datoGraba.Orden;
            dato.Visible = datoGraba.Visible;
            dato.Tipo = tipo;

            dato.Validar();

            repository.Actualizar(dato);
            CacheManager.RemoveToCache(gobalKeyCache);
        }
        public Categoria CategoriaEliminar(int id)
        {
            RepositoryGenerico<Categoria> repository = new RepositoryGenerico<Categoria>();
            Categoria dato;

            dato = repository.Obtener(id);

            if (dato == null)
                throw new ApplicationException("No existe Categoria");

            repository.Eliminar(dato);

            return dato;
        }
        #endregion

        #region ABM Subcategorias
        public Subcategoria SubcategoriaObtenerCache(int id)
        {
            Subcategoria subcateReturn = null;
            this.TipoObtenerVigentesCache().ForEach(delegate(Tipo tipo)
            {
                tipo.Categorias.ToList<Categoria>().ForEach(delegate(Categoria catego)
                {
                    catego.Subcategorias.ToList<Subcategoria>().ForEach(delegate(Subcategoria subcate)
                    {
                        if (subcate.Id == id)
                        {
                            subcateReturn = subcate;
                            return;
                        }
                    });
                });
            });
            return subcateReturn;
        }
        public Subcategoria SubcategoriaObtener(int id)
        {
            Subcategoria Subcategoria = this.ObtenerObjeto<Subcategoria>(id);
            return Subcategoria;
        }

        public void SubcategoriaGrabar(Subcategoria datoGraba)
        {
            RepositoryGenerico<Subcategoria> repository = new RepositoryGenerico<Subcategoria>();
            Subcategoria dato = null;

            Categoria categoria = this.ObtenerObjeto<Categoria>(datoGraba.IdCategoria);

            if (datoGraba.Id == -1)
            {
                dato = new Subcategoria();
                datoGraba.Vigente = true;
                if (categoria != null
                    && categoria.Subcategorias.ToList<Subcategoria>().Find(item => item.Descripcion == datoGraba.Descripcion) != null)
                    throw new ApplicationException(string.Format("La Subcategoría ya existe para la Categoría: {0}", categoria.Descripcion));
            }
            else
            {
                dato = repository.Obtener(datoGraba.Id);
                if (dato == null)
                    throw new ApplicationException("No existe el Subcategoria");
            }

            dato.Descripcion = datoGraba.Descripcion;
            dato.Vigente = datoGraba.Vigente;
            dato.Carpeta = datoGraba.Carpeta;
            dato.Orden = datoGraba.Orden;
            dato.Visible = datoGraba.Visible;
            dato.Categoria = categoria;
                       
            dato.Validar();

            repository.Actualizar(dato);

            if (datoGraba.Medidas != null)
            {
                dato.Medidas.Clear();
                datoGraba.Medidas.ToList<SubcategoriaMedida>()
                    .ForEach(delegate(SubcategoriaMedida item)
                    {
                        dato.Medidas.Add(item);
                    });
            }
            this.SubcategoriaMedidaGrabar(dato);
            CacheManager.RemoveToCache(gobalKeyCache);
        }

        public void SubcategoriaMedidaGrabar(Subcategoria datoGraba)
        {
            RepositoryGenerico<SubcategoriaMedida> repository = new RepositoryGenerico<SubcategoriaMedida>();

            repository.EliminarRegistros("tp_SubcategoriaMedidas", string.Format("IdSubcategoria = {0}", datoGraba.Id));

            datoGraba.Medidas.ToList<SubcategoriaMedida>()
                .ForEach(delegate(SubcategoriaMedida item)
                {
                    item.IdSubcategoria = datoGraba.Id;
                    repository.Actualizar(item);
                });
        }

        public Subcategoria SubcategoriaEliminar(int id)
        {
            RepositoryGenerico<Subcategoria> repository = new RepositoryGenerico<Subcategoria>();
            Subcategoria dato;

            dato = repository.Obtener(id);

            if (dato == null)
                throw new ApplicationException("No existe Subcategoria");

            this.SubcategoriaMedidaEliminar(id);
            repository.Eliminar(dato);

            return dato;
        }
        public void SubcategoriaMedidaEliminar(int id)
        {
            RepositoryGenerico<SubcategoriaMedida> repository = new RepositoryGenerico<SubcategoriaMedida>();
            SubcategoriaMedida dato;

            dato = repository.Obtener("IdSubcategoria", id);

            repository.Eliminar(dato);
        }
        #endregion
        
    }
}
