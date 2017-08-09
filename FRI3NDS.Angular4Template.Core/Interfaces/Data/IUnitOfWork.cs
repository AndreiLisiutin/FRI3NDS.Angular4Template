using FRI3NDS.Angular4Template.Core.Interfaces.Data.Repositories;
using FRI3NDS.Angular4Template.Core.Interfaces.Data.Repositories._Admin;
using System;
using System.Collections.Generic;
using System.Text;

namespace FRI3NDS.Angular4Template.Core.Interfaces.Data
{
    /// <summary>
    /// Единица работы (Паттерн Unit of Work).
    /// </summary>
    public interface IUnitOfWork : IDisposable
    {
        #region Repositories

        /// <summary>
        /// Репозиторий тестовых сущностей.
        /// </summary>
        I_TestEntityRepository _TestEntityRepository { get; }

        /// <summary>
        /// Репозиторий пользователей.
        /// </summary>
        IUserRepository UserRepository { get; }

        #endregion

        /// <summary>
        /// Открыть транзакцию.
        /// </summary>
        void BeginTransaction();

        /// <summary>
        /// Подтвердить транзакцию, если она открыта.
        /// </summary>
        void CommitTransaction();

        /// <summary>
        /// Откатить транзакцию, если она открыта.
        /// </summary>
        void RollbackTransaction();
    }

    public interface IAdminUnitOfWork : IUnitOfWork
    {
        #region Repositories
        
        I_EntityRepository _EntityRepository { get; }

        #endregion
    }

}
