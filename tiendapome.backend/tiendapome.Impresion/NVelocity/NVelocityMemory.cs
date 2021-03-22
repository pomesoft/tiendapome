using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Collections;
using System.IO;

using NVelocity.Context;
using NVelocity.Exception;

namespace tiendapome.Impresion.NVelocity
{
    public sealed class NVelocityMemory : NVelocityBase, INVelocity
    {
        internal NVelocityMemory(bool cacheTamplate)
            : base(cacheTamplate)
        {
            this.Init();
        }

        public string Process(IDictionary context, string template)
        {
            StringWriter writer = new StringWriter();

            try
            {
                this.Evaluate(CreateContext(context), writer, "mystring", template);
            }
            catch (ParseErrorException pe)
            {
                return pe.Message;
            }
            catch (MethodInvocationException mi)
            {
                return mi.Message;
            }

            return writer.ToString();
        }

        public void Process(IDictionary context, TextWriter writer, string template)
        {
            try
            {
                this.Evaluate(CreateContext(context), writer, "mystring", template);
            }
            catch (ParseErrorException pe)
            {
                writer.Write(pe.Message);
            }
            catch (MethodInvocationException mi)
            {
                writer.Write(mi.Message);
            }
        }
    }
}
