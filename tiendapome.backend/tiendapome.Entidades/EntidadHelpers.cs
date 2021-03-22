using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace tiendapome.Entidades
{
    public static class EntidadHelpers
    {

        public static string ConvertirString(this object valor)
        {
            return valor == null ? string.Empty : valor.ToString();
        }


        public static int ConvertirInt(this object valor)
        {
            int _valor = -1;
            if (valor != null && !int.TryParse(valor.ToString(), out _valor))
                _valor = -1;
            return _valor;
        }
        public static int? ConvertirIntNulleable(this object valor)
        {
            int? _valorReturn = null;
            int _valor = -1;
            if (valor != null && int.TryParse(valor.ToString(), out _valor))
                _valorReturn = _valor;
            return _valorReturn;
        }

        public static long ConvertirLong(this object valor)
        {
            long _valor = -1;
            if (valor != null && !long.TryParse(valor.ToString(), out _valor))
                _valor = -1;
            return _valor;
        }

        public static decimal ConvertirDecimal(this object valor)
        {
            decimal _valor = -1;
            if (valor != null && !decimal.TryParse(valor.ToString(), out _valor))
                _valor = -1;
            return _valor;
        }

        public static float ConvertirFloat(this object valor)
        {
            float _valor = -1;
            if (valor != null && !float.TryParse(valor.ToString(), out _valor))
                _valor = -1;
            return _valor;
        }

        public static bool ConvertirBool(this object valor)
        {
            bool _valor = false;
            if (valor != null && !bool.TryParse(valor.ToString(), out _valor))
                _valor = false;
            return _valor;
        }

        public static bool? ConvertirBoolNulleable(this object valor)
        {
            bool? _valorReturn = null;
            bool _valor = false;
            if (valor != null && bool.TryParse(valor.ToString(), out _valor))
                _valorReturn = _valor;
            return _valorReturn;
        }

        public static DateTime ConvertirDateTime(this object valor)
        {
            DateTime _valor = DateTime.MinValue;
            if (valor != null && !DateTime.TryParse(valor.ToString(), out _valor))
                _valor = DateTime.MinValue;
            return _valor;
        }

        public static DateTime? ConvertirDateTimeNulleable(this object valor)
        {
            DateTime? _valorReturn = null;
            DateTime _valor = DateTime.MinValue;
            if (valor != null && DateTime.TryParse(valor.ToString(), out _valor))
                _valorReturn = _valor;
            return _valorReturn;
        }

        
    }
}
