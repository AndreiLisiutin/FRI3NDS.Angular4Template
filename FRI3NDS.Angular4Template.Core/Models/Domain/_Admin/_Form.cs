using System;
using System.Collections.Generic;
using System.Text;

namespace FRI3NDS.Angular4Template.Core.Models.Domain._Admin
{
    /// <summary>
    /// Форма для просмотра сущности, расширенная модель.
    /// </summary>
    public class _Form: _FormBase
    {
    }

    /// <summary>
    /// Форма для просмотра сущности.
    /// </summary>
    public class _FormBase
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public int _EntityId { get; set; }

    }
}
