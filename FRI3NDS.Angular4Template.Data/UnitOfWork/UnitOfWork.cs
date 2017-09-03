using FRI3NDS.Angular4Template.Core.Interfaces.Data;
using FRI3NDS.Angular4Template.Core.Interfaces.Data.Repositories;
using FRI3NDS.Angular4Template.Core.Interfaces.Data.Repositories._Admin;
using FRI3NDS.Angular4Template.Data.Repositories;
using FRI3NDS.Angular4Template.Data.Repositories._Admin;
using Microsoft.Extensions.Configuration;
using Npgsql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;

namespace FRI3NDS.Angular4Template.Data.UnitOfWork
{
    /// <summary>
    /// Единица работы (Паттерн Unit of Work).
    /// </summary>
    public class UnitOfWork : IUnitOfWork
    {
        /// <summary>
        /// Имя узла конфигурации, хранящее значение строки подключения к БД.
        /// </summary>
        private const string _CONNECTION_STRING_NAME = "Data:Angular4Template:ConnectionString";
        protected Lazy<DataContext> _dataContext;

        #region Repositories

        /// <summary>
        /// Репозиторий тестовых сущностей.
        /// </summary>
        public I_TestEntityRepository _TestEntityRepository => new _TestEntityRepository(this._dataContext.Value);

        /// <summary>
        /// Репозиторий пользователей.
        /// </summary>
        public IUserRepository UserRepository => new UserRepository(this._dataContext.Value);

        #endregion

        /// <summary>
        /// Конструктор единицы работы.
        /// </summary>
        /// <param name="configuration">Конфигурация запускаемого проекта. 
        /// Должен быть заполнен узел для строки подключения к базе данных (<see cref="_CONNECTION_STRING_NAME"/>).</param>
        public UnitOfWork(IConfiguration configuration)
        {
            this._dataContext = new Lazy<DataContext>(() => this._CreateDataContext(configuration), true);
        }

        /// <summary>
        /// Установка соединения с базой данных.
        /// </summary>
        /// <param name="configuration">Конфигурация запускаемого проекта.</param>
        /// <returns>Контекст данных.</returns>
        private DataContext _CreateDataContext(IConfiguration configuration)
        {
            string connectionString = configuration[_CONNECTION_STRING_NAME];
            IDbConnection connection = new NpgsqlConnection(connectionString);
            connection.Open();
            return new DataContext(connection, null);
        }

        /// <summary>
        /// Открыть транзакцию.
        /// </summary>
        public void BeginTransaction()
        {
            this._dataContext.Value.Transaction = this._dataContext.Value.Connection.BeginTransaction();
        }

        /// <summary>
        /// Подтвердить транзакцию, если она открыта.
        /// </summary>
        public void CommitTransaction()
        {
            if (this._dataContext.Value.Transaction != null)
            {
                this._dataContext.Value.Transaction.Commit();
                this._dataContext.Value.Transaction.Dispose();
                this._dataContext.Value.Transaction = null;
            }
        }

        /// <summary>
        /// Откатить транзакцию, если она открыта.
        /// </summary>
        public void RollbackTransaction()
        {
            if (this._dataContext.Value.Transaction != null)
            {
                this._dataContext.Value.Transaction.Rollback();
                this._dataContext.Value.Transaction.Dispose();
                this._dataContext.Value.Transaction = null;
            }
        }

        /// <summary>
        /// Освободить неуправляемые ресурсы единицы работы такие, как подключение к базе данных и транзакция.
        /// Если транзакция не закрыта, она откатывается.
        /// </summary>
        public void Dispose()
        {
            if (this._dataContext.IsValueCreated)
            {
                this.RollbackTransaction();
                if (this._dataContext.Value.Connection != null)
                {
                    this._dataContext.Value.Connection.Dispose();
                    this._dataContext.Value.Connection = null;
                }
            }
        }
    }
    
    /// <summary>
    /// Админская едница работы. Чтоб не засорять основной сайт.
    /// </summary>
    public class AdminUnitOfWork : UnitOfWork, IAdminUnitOfWork
    {
        /// <summary>
        /// Конструктор единицы работы.
        /// </summary>
        /// <param name="configuration">Конфигурация запускаемого проекта. 
        /// Должен быть заполнен узел для строки подключения к базе данных (<see cref="_CONNECTION_STRING_NAME"/>).</param>
        public AdminUnitOfWork(IConfiguration configuration) 
            : base(configuration)
        {
		}

		#region Repositories

		/// <summary>
		/// Репозиторий сущностей.
		/// </summary>
		public I_EntityRepository _EntityRepository => new _EntityRepository(this._dataContext.Value);

        /// <summary>
        /// Репозиторий типов полей сущностей.
        /// </summary>
        public I_FieldTypeRepository _FieldTypeRepository => new _FieldTypeRepository(this._dataContext.Value);

        /// <summary>
        /// Репозиторий полей сущностей.
        /// </summary>
        public I_FieldRepository _FieldRepository => new _FieldRepository(this._dataContext.Value);

        /// <summary>
        /// Репозиторий динамический, страшный.
        /// </summary>
        public I_DynamicRepository _DynamicRepository => new _DynamicRepository(this._dataContext.Value);

        /// <summary>
        /// Репозиторий версий базы данных.
        /// </summary>
        public I_VersionRepository _VersionRepository => new _VersionRepository(this._dataContext.Value);

        #endregion
    }
}
