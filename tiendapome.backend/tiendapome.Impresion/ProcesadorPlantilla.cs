using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;

using tiendapome.Entidades;
using tiendapome.Impresion.NVelocity;

namespace tiendapome.Impresion
{
    public class ProcesadorPlantilla
    {
        public string NombrePlantilla { get; set; }
        public IDictionary DiccionarioDatos { get; set; }
        public string HTMLProcesado { get; set; }

        public ProcesadorPlantilla() 
        {
            HTMLProcesado = string.Empty;
        }

        public ProcesadorPlantilla(string nombrePlantilla)
        {
            HTMLProcesado = string.Empty;
            NombrePlantilla = nombrePlantilla;
        }

        public void ProcesarPlantilla()
        {
            INVelocity fileEngine = NVelocityFactory.CreateNVelocityFileEngine(ProcesadorHelpers.DirectorioPlantillas, true);
            HTMLProcesado += fileEngine.Process(DiccionarioDatos, string.Format("{0}.html", NombrePlantilla));
        }

    }
}
