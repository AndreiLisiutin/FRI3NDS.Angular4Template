using FRI3NDS.Angular4Template.Core.Models.Domain;
using System;
using System.Collections.Generic;
using System.Text;

namespace FRI3NDS.Angular4Template.Core.Interfaces.Services.Data
{
    /// <summary>
    /// Сервис работы с пользователями.
    /// </summary>
    public interface IUserDataService
    {
        /// <summary>
        /// Получить пользователя по его идентификатору.
        /// </summary>
        /// <param name="id">Идентификатор пользователя.</param>
        /// <returns>Пользователь.</returns>
        User GetById(int id);
    }
}
