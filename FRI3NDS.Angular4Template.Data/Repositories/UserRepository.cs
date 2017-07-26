using Dapper;
using FRI3NDS.Angular4Template.Core.Interfaces.Data.Repositories;
using FRI3NDS.Angular4Template.Core.Models.Domain;
using FRI3NDS.Angular4Template.Data.UnitOfWork;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;

namespace FRI3NDS.Angular4Template.Data.Repositories
{
    /// <summary>
	/// Репозиторий пользователей.
	/// </summary>
	internal class UserRepository : RepositoryBase<UserBase>, IUserRepository
    {
        /// <summary>
        /// Конструктор репозитория пользователей.
        /// </summary>
        /// <param name="dataContext">Контекст данных (подключение к базе и транзакция).</param>
        public UserRepository(DataContext dataContext)
            : base(dataContext)
        {
        }

        /// <summary>
        /// Получить пользователя по его идентификатору.
        /// </summary>
        /// <param name="id">Идентификатор пользователя.</param>
        /// <returns>Найденный пользователь.</returns>
        public User GetById(int id)
        {
            return this.Query(id: id, page_size: 1)
                .FirstOrDefault();
        }
        
        /// <summary>
        /// Получить список пользователей по фильтру.
        /// </summary>
        /// <param name="id">Идентификатор пользователя.</param>
        /// <param name="login">Логин.</param>
        /// <param name="page_size">Количество возвращаемых поьзователей.</param>
        /// <param name="page_number">Страница возвращаемых пользователей, начиная с 1.</param>
        /// <returns>Список отфильтрованных пользователей.</returns>
        public List<User> Query(
            int? id = null,
            string login = null,
            int page_size = 1000,
            int page_number = 1)
        {
            DynamicParameters @params = new DynamicParameters();
            @params.Add("_id", id, DbType.Int32);
            @params.Add("_login", login, DbType.String);
            @params.Add("_page_size", page_size, DbType.Int32);
            @params.Add("_page_number", page_number, DbType.Int32);

            return this._dataContext.Connection.Query<User>("User$Query", @params, this._dataContext.Transaction, commandType: CommandType.StoredProcedure)
                .ToList();
        }

        /// <summary>
        /// Сохранить пользователя.
        /// </summary>
        /// <param name="item">Модель пользователя.</param>
        /// <returns>Обновленная модель пользователя с идентификатором.</returns>
        public UserBase Save(UserBase item)
        {
            DynamicParameters @params = new DynamicParameters();
            @params.Add("_id", item.Id, DbType.Int32);
            @params.Add("_name", item.Name, DbType.String);
            @params.Add("_surname", item.Surname, DbType.String);
            @params.Add("_patronymic", item.Patronymic, DbType.String);
            @params.Add("_login", item.Login, DbType.String);
            @params.Add("_email", item.Email, DbType.String);
            @params.Add("_password_hash", item.PasswordHash, DbType.String);
            @params.Add("_created_on", item.CreatedOn, DbType.DateTime);
            @params.Add("_phone", item.Phone, DbType.String);

            item.Id = this._dataContext.Connection.ExecuteScalar<int>("User$Save", @params, this._dataContext.Transaction, commandType: CommandType.StoredProcedure);
            return item;
        }

        /// <summary>
        /// Удалить пользователя.
        /// </summary>
        /// <param name="id">Идентификатор пользователя.</param>
        /// <returns>Идентификатор пользователя.</returns>
        public int Delete(int id)
        {
            DynamicParameters @params = new DynamicParameters();
            @params.Add("_id", id, DbType.Int32);

            var result = this._dataContext.Connection.ExecuteScalar<int>("User$Delete", @params, this._dataContext.Transaction, commandType: CommandType.StoredProcedure);
            return result;
        }
    }
}
