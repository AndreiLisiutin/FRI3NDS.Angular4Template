using FRI3NDS.Angular4Template.Core.Models.Domain;
using System;
using System.Collections.Generic;
using System.Text;

namespace FRI3NDS.Angular4Template.Core.Interfaces.Services.Data
{
    /// <summary>
    /// Тестовый сервис для работы с данными.
    /// </summary>
    public interface I_TestDataService
    {
        /// <summary>
        /// Получить список тестовых сущностей.
        /// </summary>
        /// <returns></returns>
        List<_TestEntityBase> GetTestEntities();
    }
}
