using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;

namespace tiendapome.Impresion.NVelocity
{
    public interface INVelocity
    {
        string Process(IDictionary context, string template);
        void Process(IDictionary context, TextWriter writer, string template);
    }
}
