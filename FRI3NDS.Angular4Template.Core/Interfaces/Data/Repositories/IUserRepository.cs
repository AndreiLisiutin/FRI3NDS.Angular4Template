using FRI3NDS.Angular4Template.Core.Models.Domain;
using System;
using System.Collections.Generic;
using System.Text;

namespace FRI3NDS.Angular4Template.Core.Interfaces.Data.Repositories
{
    /// <summary>
    /// Репозиторий пользователей.
    /// </summary>
    public interface IUserRepository : IRepositoryBase<UserBase>
    {
        /// <summary>
        /// Получить список пользователей по фильтру.
        /// </summary>
        /// <param name="id">Идентификатор пользователя.</param>
        /// <param name="login">Логин.</param>
        /// <param name="pageSize">Количество возвращаемых поьзователей.</param>
        /// <param name="pageNumber">Страница возвращаемых пользователей, начиная с 1.</param>
        /// <returns>Список отфильтрованных пользователей.</returns>
        List<User> Query(
            int? id = null,
            string login = null,
            int pageSize = 1000,
            int pageNumber = 0);

        /// <summary>
        /// Сохранить пользователя.
        /// </summary>
        /// <param name="item">Модель пользователя.</param>
        /// <returns>Обновленная модель пользователя с идентификатором.</returns>
        UserBase Save(UserBase item);

        /// <summary>
        /// Получить пользователя по его идентификатору.
        /// </summary>
        /// <param name="id">Идентификатор пользователя.</param>
        /// <returns>Найденный пользователь.</returns>
        User GetById(int id);

        /// <summary>
        /// Удалить пользователя.
        /// </summary>
        /// <param name="id">Идентификатор пользователя.</param>
        /// <returns>Идентификатор пользователя.</returns>
        int Delete(int id);
    }
}
