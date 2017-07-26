using FRI3NDS.Angular4Template.Core.Interfaces.Data.Repositories;
using FRI3NDS.Angular4Template.Core.Models.Domain;
using FRI3NDS.Angular4Template.Data.UnitOfWork;
using System;
using System.Collections.Generic;
using System.Text;

namespace FRI3NDS.Angular4Template.Data.Repositories
{
    /// <summary>
    /// Репозиторий тестовых сущностей.
    /// </summary>
    internal class _TestEntityRepository : RepositoryBase<_TestEntityBase>, I_TestEntityRepository
    {
        /// <summary>
        /// Конструктор репозитория тестовых сущностей.
        /// </summary>
        /// <param name="dataContext">Контекст данных (подключение к базе и транзакция).</param>
        public _TestEntityRepository(DataContext dataContext)
            : base(dataContext)
        {
        }
    }
}
