using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace tiendapome.Servicios.Cache
{
    public class CacheModel
    {
        internal readonly DateTime _timeExpiration;
        public CacheModel(int minuteExperition)
        {
            _timeExpiration = DateTime.Now.AddMilliseconds(minuteExperition);
        }

        internal object Data { get; set; }
    }
}