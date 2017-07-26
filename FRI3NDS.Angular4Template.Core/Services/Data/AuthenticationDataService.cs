using FRI3NDS.Angular4Template.Core.Infrastructure;
using FRI3NDS.Angular4Template.Core.Interfaces.Data;
using FRI3NDS.Angular4Template.Core.Interfaces.Services.Data;
using FRI3NDS.Angular4Template.Core.Models.Domain;
using FRI3NDS.Angular4Template.Util;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace FRI3NDS.Angular4Template.Core.Services.Data
{
    /// <summary>
	/// Сервис для работы с аутентификацией.
	/// </summary>
	public class AuthenticationDataService : DataServiceBase, IAuthenticationDataService
    {
        /// <summary>
        /// Конструктор сервиса для работы с аутентификацией.
        /// </summary>
        /// <param name="unitOfWorkFactory">Фабрика единиц работы.</param>
        public AuthenticationDataService(IUnitOfWorkFactory unitOfWorkFactory)
            :base (unitOfWorkFactory)
        {
        }

        public UserBase CreateUser(string login, string password)
        {
            Argument.Require(!string.IsNullOrWhiteSpace(login), "Логин пользователя не задан.");
            Argument.Require(!string.IsNullOrWhiteSpace(password), "Пароль пользователя не задан.");

            UserBase user = new UserBase()
            {
                Id = 0,
                Login = login,
                Name = "--",
                Surname = login,
                CreatedOn = DateTime.Now,
                PasswordHash = this._HashPassword(password)
            };
            using (var unitOfWork = this.CreateUnitOfWork())
            {
                UserBase existingUser = unitOfWork.UserRepository.Query(login: login)
                    .FirstOrDefault();
                Argument.Require(existingUser == null, "Пользователь с выбранным логином уже существует.");

                user = unitOfWork.UserRepository.Save(user);
            }
            return user;
        }

        public UserBase VerifyUser(string login, string password)
        {
            Argument.Require(!string.IsNullOrWhiteSpace(login), "Логин пользователя не задан.");
            Argument.Require(!string.IsNullOrWhiteSpace(password), "Пароль пользователя не задан.");

            using (var unitOfWork = this.CreateUnitOfWork())
            {
                UserBase user = unitOfWork.UserRepository.Query(login: login)
                    .FirstOrDefault();
                if (user == null)
                {
                    return null;
                }

                bool isUserExists = this._VerifyPassword(password, user.PasswordHash);
                return isUserExists ? user : null;
            }
        }

        private string _HashPassword(string password)
        {
            return SecurePasswordHasher.Hash(password);
        }
        private bool _VerifyPassword(string password, string hash)
        {
            return SecurePasswordHasher.Verify(password, hash);
        }
    }
}
