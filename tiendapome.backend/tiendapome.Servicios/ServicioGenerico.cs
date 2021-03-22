using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using tiendapome.Entidades;
using tiendapome.Repository;
using tiendapome.Servicios.Cache;
using tiendapome.Impresion;

namespace tiendapome.Servicios
{
    public class ServicioGenerico : AbstractService
    {
        const string gobalKeyCache = "TiendaPome";

        public ServicioGenerico() { }

        #region Impresion

        public string ImprimirPlantilla(string plantilla)
        {
            ProcesadorPlantilla procesador = new ProcesadorPlantilla();
            procesador.NombrePlantilla = plantilla;
            procesador.DiccionarioDatos = new Hashtable();
            procesador.ProcesarPlantilla();
            return procesador.HTMLProcesado;
        }

        #endregion

        #region Parametro
        public List<Parametro> ParametroObtenerVigentesCache()
        {
            List<Parametro> listReturn = new List<Parametro>();

            var dataCache = CacheManager.GetToCache<List<Parametro>>(gobalKeyCache, "GetParametros");

            if (dataCache == null)
            {
                listReturn = this.Listar<Parametro>().ToList<Parametro>();
                if (listReturn == null) listReturn = new List<Parametro>();
                CacheManager.AddToCache(gobalKeyCache, "GetParametros", listReturn);
            }
            else
            {
                listReturn = dataCache;
            }

            return listReturn;
        }
        public string ParametroObtenerValor(string clave)
        {
            string valor = string.Empty;
            Parametro parametro = this.ParametroObtenerVigentesCache().Find(item => item.Clave == clave);
            if (parametro != null)
                valor = parametro.Valor;
            return valor;
        }
        public Parametro ParametroObtener(string clave)
        {
            Parametro parametro = this.ParametroObtenerVigentesCache().Find(item => item.Clave == clave);
            return parametro;
        }

        public Parametro ParametroObtener(int id)
        {
            return this.ObtenerObjeto<Parametro>(id);
        }

        public List<Parametro> ParametroListar()
        {
            return this.Listar<Parametro>().ToList<Parametro>()
                                            .Where(item => item.Editable && item.Vigente)
                                            .ToList<Parametro>();
        }
        //public List<Parametro> ParametroListarCache()
        //{
        //    List<Parametro> listReturn = new List<Parametro>();

        //    var dataCache = CacheManager.GetToCache<List<Parametro>>(gobalKeyCache, "GetParametros");

        //    if (dataCache == null)
        //    {
        //        listReturn = this.ParametroListar();
        //        CacheManager.AddToCache(gobalKeyCache, "GetParametros", listReturn);
        //    }
        //    else
        //    {
        //        listReturn = dataCache;
        //    }
        //    return listReturn;
        //}

        public Parametro ParametroGrabar(Parametro datosGraba)
        {
            RepositoryGenerico<Parametro> repository = new RepositoryGenerico<Parametro>();
            Parametro dato;

            int _id = datosGraba.Id;
                        
            if (_id == -1)
                dato = new Parametro();
            else
                dato = repository.Obtener(_id);

            dato.Descripcion = datosGraba.Descripcion;
            if (_id == -1) //solo para los nuevos parametros actualizamos la clave
                dato.Clave = datosGraba.Clave;
            dato.Valor = datosGraba.Valor;
            dato.Editable = true;
            dato.Vigente = true;

            dato.Validar();
            repository.Actualizar(dato);

            return dato;
        }

        #endregion
        

    }
}
