using System;
using System.Collections.Generic;
using System.Text;

namespace FRI3NDS.Angular4Template.Core.Models.Domain
{
    /// <summary>
    /// Тестовая сущность.
    /// </summary>
    public class _TestEntity : _TestEntityBase
    {

    }

    /// <summary>
    /// Тестовая сущность.
    /// </summary>
    public class _TestEntityBase
    {
        public _TestEntityBase()
        {
        }

        /// <summary>
        /// Идентификатор сущности.
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// Название.
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// Дата.
        /// </summary>
        public DateTime Date { get; set; }
    }
}
