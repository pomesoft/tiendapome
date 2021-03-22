using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Collections;
using System.IO;

using NVelocity;
using NVelocity.Exception;
using NVelocity.Runtime;

namespace tiendapome.Impresion.NVelocity
{

    public sealed class NVelocityFile : NVelocityBase, INVelocity
    {
        
        internal NVelocityFile(string templateDirectory, bool cacheTemplate)
            : base(cacheTemplate)
        {
            this.SetProperty(RuntimeConstants.RESOURCE_LOADER, "file");
            this.SetProperty(RuntimeConstants.FILE_RESOURCE_LOADER_PATH, templateDirectory);
            this.Init();
        }

        public string Process(IDictionary context, string templateName)
        {
            StringWriter writer = new StringWriter();

            try
            {
                Template template = this.GetTemplate(templateName);
                template.Merge(CreateContext(context), writer);
            }
            catch (ResourceNotFoundException rnf)
            {
                return rnf.Message;
            }
            catch (ParseErrorException pe)
            {
                return pe.Message;
            }

            return writer.ToString();
        }

        public void Process(IDictionary context, TextWriter writer, string templateName)
        {
            try
            {
                Template template = this.GetTemplate(templateName);
                template.Merge(CreateContext(context), writer);
            }
            catch (ResourceNotFoundException rnf)
            {
                writer.Write(rnf.Message);
            }
            catch (ParseErrorException pe)
            {
                writer.Write(pe.Message);
            }
        }
    }
}