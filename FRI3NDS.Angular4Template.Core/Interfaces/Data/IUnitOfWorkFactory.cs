using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Text;

namespace FRI3NDS.Angular4Template.Core.Interfaces.Data
{
    /// <summary>
    /// Фабрика единиц работы.
    /// </summary>
    public interface IUnitOfWorkFactory
    {
        /// <summary>
        /// Создать новую единицу работы с заданной конфигурацией.
        /// </summary>
        /// <returns>Экземпляр единицы работы.</returns>
        IUnitOfWork Create();
    }
}
