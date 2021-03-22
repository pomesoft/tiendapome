using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using System.Collections;
using System.IO;

using NVelocity.Context;
using NVelocity.Exception;

using tiendapome.Impresion.NVelocity;

namespace tiendapome.Impresion
{
    public class NVelocityFactory
    {
        /// <summary>
        /// Creates a new instance of NVelocityFileEngine class.
        /// </summary>
        /// <param name="templateDirectory">The template directory.</param>
        /// <param name="cacheTemplate">if set to <c>true</c> [cache template].</param>
        /// <returns></returns>
        public static INVelocity CreateNVelocityFileEngine(string templateDirectory, bool cacheTemplate)
        {
            return new NVelocityFile(templateDirectory, cacheTemplate);
        }

        /// <summary>
        /// Creates a new instance of NVelocityMemoryEngine class.
        /// </summary>
        /// <param name="cacheTemplate">if set to <c>true</c> [cache template].</param>
        /// <returns></returns>
        public static INVelocity CreateNVelocityMemoryEngine(bool cacheTemplate)
        {
            return new NVelocityMemory(cacheTemplate);
        }
    }
}
