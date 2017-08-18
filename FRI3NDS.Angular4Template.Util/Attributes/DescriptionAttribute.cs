using System;
using System.Collections.Generic;
using System.Text;

namespace FRI3NDS.Angular4Template.Util.Attributes
{
    /// <summary>
    /// Строковое описание чего-нибудь.
    /// </summary>
    public class DescriptionAttribute : Attribute
    {
        /// <summary>
        /// Конструктор строкового описания чего-нибудь.
        /// </summary>
        /// <param name="description"></param>
        public DescriptionAttribute(string description)
        {
            this.Description = description;
        }

        /// <summary>
        /// Строковое описание.
        /// </summary>
        public string Description { get; set; }
    }
}
