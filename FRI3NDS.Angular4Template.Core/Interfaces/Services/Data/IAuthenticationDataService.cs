using FRI3NDS.Angular4Template.Core.Models.Domain;
using System;
using System.Collections.Generic;
using System.Text;

namespace FRI3NDS.Angular4Template.Core.Interfaces.Services.Data
{
    /// <summary>
    /// Сервис аутентификации и работы с учетными записями пользователей.
    /// </summary>
    public interface IAuthenticationDataService
    {
        UserBase CreateUser(string login, string password);
        UserBase VerifyUser(string login, string password);
        UserBase GetUserById(int userId);
    }
}
