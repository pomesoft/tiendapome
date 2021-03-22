using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Web;

using tiendapome.Entidades;

namespace tiendapome.Impresion
{
    public static class ProcesadorHelpers
    {
        public static string DirectorioImagenes
        {
            get
            {
                return HttpContext.Current.Server.MapPath("img");
            }
        }
        public static string UrlDirectorioImagenes
        {
            get
            {
                string port = HttpContext.Current.Request.Url.Port > 0 ? string.Format(":{0}", HttpContext.Current.Request.Url.Port) : string.Empty;

                return string.Format("http://{0}{1}/{2}", HttpContext.Current.Request.Url.Host, port, "img");
            }
        }        
        public static string DirectorioPlantillas
        {
            get
            {
                return HttpContext.Current.Server.MapPath("~/assets/plantillas/");
            }
        }
        public static string UrlDirectorioPlantillas
        {
            get
            {
                string port = HttpContext.Current.Request.Url.Port > 0 ? string.Format(":{0}", HttpContext.Current.Request.Url.Port) : string.Empty;

                return string.Format("http://{0}{1}/{2}", HttpContext.Current.Request.Url.Host, port, "Plantillas");
            }
        }
        public static string UrlDirectorioArchivos
        {
            get
            {
                string port = HttpContext.Current.Request.Url.Port > 0 ? string.Format(":{0}", HttpContext.Current.Request.Url.Port) : string.Empty;

                return string.Format("http://{0}{1}/{2}", HttpContext.Current.Request.Url.Host, port, "Archivos");
            }
        }
        
        
        public static string QuitarTagP(string texto)
        {
            string textoReturn = string.Empty;
            textoReturn = texto.StartsWith("<p>") ? texto.Substring(3) : texto;
            textoReturn = textoReturn.EndsWith("</p>") ? textoReturn.Substring(0, textoReturn.Length - 4) : textoReturn;
            return textoReturn;
        }

        
    }
}
