using System;
using System.Collections.Generic;
using System.Text;

namespace FRI3NDS.Angular4Template.Core.Models.Business._Admin
{
    /// <summary>
    /// Обобщенная сущность - набор полей со значениями.
    /// </summary>
    public class _GenericEntity
    {
        /// <summary>
        /// Идентификатор сущности.
        /// </summary>
        public int EntityId { get; set; }

        /// <summary>
        /// Набор обобщенных полей со значениями.
        /// </summary>
        public List<_GenericEntityField> Fields { get; set; }
    }
}
