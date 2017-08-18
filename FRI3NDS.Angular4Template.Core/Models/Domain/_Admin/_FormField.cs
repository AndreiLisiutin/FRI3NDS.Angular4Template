using System;
using System.Collections.Generic;
using System.Text;

namespace FRI3NDS.Angular4Template.Core.Models.Domain._Admin
{
    /// <summary>
    /// Контрол формы для просмотра сущности, расширенная модель.
    /// </summary>
    public class _FormField: _FormFieldBase
    {
		public int _FieldTypeId { get; set; }
	}

    /// <summary>
    /// Контрол формы для просмотра сущности.
    /// </summary>
    public class _FormFieldBase
    {
        public int Id { get; set; }

        public string Label { get; set; }

        public int _FormId { get; set; }

        public int _FieldId { get; set; }

        public int Column { get; set; }

        public int Length { get; set; }

        public int Row { get; set; }
    }
}
