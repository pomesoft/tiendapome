using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Web;

using log4net;

namespace tiendapome.API.Helpers
{    
    public static class LoggerHelper
    {

        //private static readonly ILog logger = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
        private static readonly ILog logger = LogManager.GetLogger("TiendaPome_Logger");

        private static string GetMethod(MethodBase method)
        {
            //MethodBase method = System.Reflection.MethodBase.GetCurrentMethod();
            string methodName = method.Name;
            string className = method.ReflectedType.Name;

            return string.Format("[{0}.{1}]", className, methodName);
        }

        public static void LogError(MethodBase method, Exception ex)
        {
            logger.ErrorFormat("{0} - {1} - {2} \n\t- Error Original: {3} \n\t- StackTrace: {4}", DateTime.Now.ToString("yyyy-MM-dd hh:mm:ss"), GetMethod(method), ex.Message, ex.GetExceptionOriginal().Message, ex.StackTrace);
        }

        public static void LogError(Exception ex)
        {
            logger.ErrorFormat("{0} - {1} \n\t- Error Original: {2} \n\t- StackTrace: {3}", DateTime.Now.ToString("yyyy-MM-dd hh:mm:ss"), ex.Message, ex.GetExceptionOriginal().Message, ex.StackTrace);
        }

        public static void LogError(MethodBase method, string MensajeInfo)
        {
            logger.ErrorFormat("{0} - {1} {2}", DateTime.Now.ToString("yyyy-MM-dd hh:mm:ss"), GetMethod(method), MensajeInfo);
        }
        public static void LogInfo(MethodBase method, string MensajeInfo)
        {
            logger.InfoFormat("{0} - {1} {2}", DateTime.Now.ToString("yyyy-MM-dd hh:mm:ss"), GetMethod(method), MensajeInfo);
        }

        public static Exception GetExceptionOriginal(this Exception ex)
        {
            if (ex.InnerException == null) return ex;

            return ex.InnerException.GetExceptionOriginal();
        }
    }
}