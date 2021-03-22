using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace tiendapome.Servicios.Cache
{
    public static class CacheManager
    {
        private static Dictionary<string, Dictionary<string, CacheModel>> _itemsCache = new Dictionary<string, Dictionary<string, CacheModel>>();

        public static void AddToCache(string keyGobal, string keyItem, object value)
        {
            int milisegundos = (10 * 60 * 60 * 1000); //10 horas
            var data = new CacheModel(milisegundos) { Data = value };

            if (_itemsCache.ContainsKey(keyGobal))
            {
                _itemsCache.First(x => x.Key == keyGobal).Value.Add(keyItem, data);
            }
            else
            {
                var item = new Dictionary<string, CacheModel>();
                item.Add(keyItem, data);
                _itemsCache.Add(keyGobal, item);
            }
        }

        public static T GetToCache<T>(string keyGobal, string keyItem)
        {
            var result = (object)null;

            var existKey = _itemsCache.ContainsKey(keyGobal);
            if (existKey)
            {
                var itemCache = _itemsCache.First(x => x.Key == keyGobal);
                var existK = itemCache.Value.ContainsKey(keyItem);
                if (existK)
                {
                    DateTime fechaActual = DateTime.Now;
                    if (itemCache.Value.Any(x => x.Value._timeExpiration > fechaActual && x.Key == keyItem))
                    {
                        var item = itemCache.Value.Where(x => x.Value._timeExpiration > fechaActual && x.Key == keyItem).FirstOrDefault();
                        result = item.Value.Data;
                    }
                }
            }
            RemoveToCache(keyGobal);
            return (T)result;
        }

        public static void RemoveToCache(string keyGobal)
        {
            if (_itemsCache.ContainsKey(keyGobal))
            {
                var itemCache = _itemsCache.First(x => x.Key == keyGobal);
                var lstCache = itemCache.Value.Where(x => itemCache.Value.Values
                    .Where(q => q._timeExpiration < DateTime.Now)
                    .Any(j => j.Data == x.Value.Data)).ToList();

                foreach (var item in lstCache)
                {
                    itemCache.Value.Remove(item.Key);
                }
            }
        }

        public static void ForceRemoveToCache(string keyGobal, string keyItem)
        {
            if (_itemsCache.ContainsKey(keyGobal))
            {
                var itemCache = _itemsCache.First(x => x.Key == keyGobal);
                itemCache.Value.Remove(keyItem);
            }
        }
    }
}