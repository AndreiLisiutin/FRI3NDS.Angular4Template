using FRI3NDS.Angular4Template.Core.Interfaces.Data;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Text;

namespace FRI3NDS.Angular4Template.Data.UnitOfWork
{
    /// <summary>
    /// Фабрика единиц работы.
    /// </summary>
    public class UnitOfWorkFactory : IUnitOfWorkFactory
    {
        private IConfiguration _configuration;

        /// <summary>
        /// Конструктор фабрики единиц работы.
        /// </summary>
        /// <param name="configuration">Конфигурация приложения.</param>
        public UnitOfWorkFactory(IConfiguration configuration)
        {
            this._configuration = configuration;
        }

        /// <summary>
        /// Создать новую единицу работы с заданной конфигурацией.
        /// </summary>
        /// <returns>Экземпляр единицы работы.</returns>
        public IUnitOfWork Create()
        {
            return new UnitOfWork(this._configuration);
        }
    }
}
