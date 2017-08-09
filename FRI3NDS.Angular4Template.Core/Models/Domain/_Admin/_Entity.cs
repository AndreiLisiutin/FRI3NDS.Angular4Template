using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace FRI3NDS.Angular4Template.Core.Models.Domain
{
    /// <summary>
    /// Расширенная модель сущности БД.
    /// </summary>
    public class _Entity : _EntityBase
    {
    }

    /// <summary>
    /// Доменная модель сущности БД.
    /// </summary>
    public class _EntityBase
    {
        /// <summary>
        /// Идентификатор сущности БД.
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// Название.
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// Название отношения в базе данных.
        /// </summary>
        public string DatabaseName { get; set; }

        /// <summary>
        /// Название схемы в базе данных.
        /// </summary>
        public string DatabaseScheme { get; set; }
    }
}
