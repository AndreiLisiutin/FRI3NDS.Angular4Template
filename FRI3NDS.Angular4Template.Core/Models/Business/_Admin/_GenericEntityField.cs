using System;
using System.Collections.Generic;
using System.Text;

namespace FRI3NDS.Angular4Template.Core.Models.Business._Admin
{
    /// <summary>
    /// Обобщенное поле - идентификатор поля и значение.
    /// </summary>
    public class _GenericEntityField
    {
        /// <summary>
        /// Идентификатор поля.
        /// </summary>
        public int FieldId { get; set; }

        /// <summary>
        /// Идентификатор типа поля.
        /// </summary>
        public int _FieldTypeId { get; set; }

        /// <summary>
        /// Сериализованное значение поля.
        /// </summary>
        public string Value { get; set; }
    }
}
