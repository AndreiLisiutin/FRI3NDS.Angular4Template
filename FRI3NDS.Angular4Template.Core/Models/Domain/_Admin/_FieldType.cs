using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace FRI3NDS.Angular4Template.Core.Models.Domain._Admin
{
    /// <summary>
    /// Расширенная модель типа поля сущности БД.
    /// </summary>
    public class _FieldType : _FieldTypeBase
    {
    }

    /// <summary>
    /// Доменная модель типа поля сущности БД.
    /// </summary>
    public class _FieldTypeBase
    {
        /// <summary>
        /// Идентификатор типа поля сущности БД.
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// Название.
        /// </summary>
        public string Name { get; set; }
    }
}
