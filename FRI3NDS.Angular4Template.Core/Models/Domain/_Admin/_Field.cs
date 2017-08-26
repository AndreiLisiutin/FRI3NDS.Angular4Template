using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace FRI3NDS.Angular4Template.Core.Models.Domain._Admin
{
    /// <summary>
    /// Расширенная модель поля сущности БД.
    /// </summary>
    public class _Field : _FieldBase
    {
        /// <summary>
        /// Название сущности, к которой относится поле.
        /// </summary>
        public string _EntityName { get; set; }

        /// <summary>
        /// Название типа значения поля.
        /// </summary>
        public string _FieldTypeName { get; set; }
    }

    /// <summary>
    /// Доменная модель поля сущности БД.
    /// </summary>
    public class _FieldBase
    {
        /// <summary>
        /// Идентификатор поля сущности БД.
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// Идентификатор типа поля сущности БД.
        /// </summary>
        public int _FieldTypeId { get; set; }

        /// <summary>
        /// Идентификатор сущности БД.
        /// </summary>
        public int _EntityId { get; set; }

        /// <summary>
        /// Название.
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// Название поля в базе данных.
        /// </summary>
        public string DatabaseName { get; set; }

        /// <summary>
        /// Является ли поле идентификатором.
        /// </summary>
        public bool IsIdentity { get; set; }
    }
}
