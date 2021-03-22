using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using NVelocity;
using NVelocity.App;
using NVelocity.Context;


namespace tiendapome.Impresion.NVelocity
{
    public abstract class NVelocityBase : VelocityEngine
    {

        protected NVelocityBase(bool cacheTemplate)
            : base()
        {
            this.SetProperty("assembly.resource.loader.cache", cacheTemplate.ToString().ToLower());
        }

	  protected static IContext CreateContext(IDictionary context)
        {
            return new VelocityContext(new Hashtable(context));
        }
    }
}
