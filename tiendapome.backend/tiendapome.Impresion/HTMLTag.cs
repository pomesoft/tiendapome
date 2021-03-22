using System;
using System.Collections.Generic;
using System.Data;
using System.Configuration;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;

namespace tiendapome.Impresion
{
    public class HtmlTag
    {
        /// <summary>
        /// Name of this tag
        /// </summary>
        private string _name;
        public string Name { get { return _name; } set { _name = value; } }

        /// <summary>
        /// Collection of attribute names and values for this tag
        /// </summary>
        private Dictionary<string, string> _attributes;
        public Dictionary<string, string> Attributes { get { return _attributes; } set { _attributes = value; } }

        /// <summary>
        /// True if this tag contained a trailing forward slash
        /// </summary>
        private bool _trailingSlash;
        public bool TrailingSlash { get { return _trailingSlash; } set { _trailingSlash = value; } }

        private string _content;
        public string Content { get { return _content; } set { _content = value; } }

        private int _posStart;
        public int PostStart { get { return _posStart; } set { _posStart = value; } }
        private int _posEnd;
        public int PostEnd { get { return _posEnd; } set { _posEnd = value; } }

    }
}
