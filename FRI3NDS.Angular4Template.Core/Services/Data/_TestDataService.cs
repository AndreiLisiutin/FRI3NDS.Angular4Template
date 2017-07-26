using FRI3NDS.Angular4Template.Core.Interfaces.Data;
using FRI3NDS.Angular4Template.Core.Interfaces.Data.Repositories;
using FRI3NDS.Angular4Template.Core.Interfaces.Services.Data;
using FRI3NDS.Angular4Template.Core.Models.Domain;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Text;

namespace FRI3NDS.Angular4Template.Core.Services.Data
{
    /// <summary>
    /// Тестовый сервис для работы с данными.
    /// </summary>
    public class _TestDataService : DataServiceBase, I_TestDataService
    {
        /// <summary>
        /// Конструктор тестового сервиса для работы с данными.
        /// <param name="unitOfWorkFactory">Фабрика единиц работы.</param>
        /// </summary>
        public _TestDataService(IUnitOfWorkFactory unitOfWorkFactory)
            : base(unitOfWorkFactory)
        {
        }

        /// <summary>
        /// Получить список тестовых сущностей.
        /// </summary>
        /// <returns></returns>
        public List<_TestEntityBase> GetTestEntities()
        {
            using (var uow = this.CreateUnitOfWork())
            {
                return uow._TestEntityRepository.GetAllBase();
            }
        }
    }
}
