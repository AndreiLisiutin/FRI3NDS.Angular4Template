using FRI3NDS.Angular4Template.Core.Models.Domain;
using FRI3NDS.Angular4Template.Core.Models.Domain._Admin;
using System;
using System.Collections.Generic;
using System.Text;

namespace FRI3NDS.Angular4Template.Core.Interfaces.Services.Data._Admin
{
    public interface I_FieldService
    {
        /// <summary>
        /// Получить поле по ее идентификатору.
        /// </summary>
        /// <param name="id">Идентификатор поля.</param>
        /// <returns>Пользователь.</returns>
        _Field GetById(int id);

        List<_Field> Query(
            int? id = null,
            string name = null,
            string databaseName = null,
            int? entityId = null,
            int pageSize = 1000,
            int pageNumber = 0);

        /// <summary>
        /// Получить список типов полей.
        /// </summary>
        /// <returns>Типы полей.</returns>
        List<_FieldType> QueryFieldTypes();

        /// <summary>
        /// Сохранить поле.
        /// </summary>
        /// <param name="field">Поле.</param>
        /// <param name="currentUserId">Идентификатор текущего пользователя.</param>
        /// <returns>Поле.</returns>
        _FieldBase Save(_FieldBase field, int currentUserId);

        /// <summary>
        /// Удалить поле.
        /// </summary>
        /// <param name="id">Идентификатор поля.</param>
        /// <returns>Идентификатор поля.</returns>
        int Delete(int id);
    }
}
