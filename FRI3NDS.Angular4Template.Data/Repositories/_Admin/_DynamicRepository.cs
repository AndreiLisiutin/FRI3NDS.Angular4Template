using FRI3NDS.Angular4Template.Core.Interfaces.Data.Repositories._Admin;
using FRI3NDS.Angular4Template.Data.UnitOfWork;
using System;
using System.Collections.Generic;
using System.Text;

namespace FRI3NDS.Angular4Template.Data.Repositories._Admin
{
    public class _DynamicRepository : UnsafeRepositoryBase, I_DynamicRepository
    {
        /// <summary>
        /// Конструктор репозитория.
        /// </summary>
        /// <param name="dataContext">Контекст данных (подключение к базе и транзакция).</param>
        public _DynamicRepository(DataContext dataContext)
            : base(dataContext)
        {
        }

        /// <summary>
        /// Сделать что-то страшное.
        /// </summary>
        /// <param name="query"></param>
        /// <returns></returns>
        public List<IDictionary<string, object>> Sql(string query)
        {
            return this._ExecuteQuery(query);
        }
    }
}
