using FRI3NDS.Angular4Template.Core.Interfaces.Data;
using FRI3NDS.Angular4Template.Core.Interfaces.Data.Repositories;
using FRI3NDS.Angular4Template.Core.Interfaces.Services.Data;
using FRI3NDS.Angular4Template.Core.Models.Domain;
using FRI3NDS.Angular4Template.Util;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Text;

namespace FRI3NDS.Angular4Template.Core.Services.Data
{
    /// <summary>
    /// Сервис для работы с пользователями.
    /// </summary>
    public class UserDataService : DataServiceBase, IUserDataService
    {
        /// <summary>
        /// Конструктор сервиса для работы с пользователями.
        /// <param name="unitOfWorkFactory">Фабрика единиц работы.</param>
        /// </summary>
        public UserDataService(IUnitOfWorkFactory unitOfWorkFactory)
            : base(unitOfWorkFactory)
        {
        }

        /// <summary>
        /// Получить пользователя по его идентификатору.
        /// </summary>
        /// <param name="id">Идентификатор пользователя.</param>
        /// <returns>Пользователь.</returns>
        public User GetById(int id)
        {
            using (var uow = this.CreateUnitOfWork())
            {
                return uow.UserRepository.GetById(id);
            }
        }

        /// <summary>
        /// Сохранить пользователя.
        /// </summary>
        /// <param name="user">Пользователь.</param>
        /// <param name="currentUserId">Идентификатор текущего пользователя.</param>
        /// <returns>Пользователь.</returns>
        public UserBase Save(UserBase user, int currentUserId)
        {
            Argument.Require(currentUserId != 0, "Текущий пользователь не определен.");
            Argument.Require(user.Id == currentUserId, "Нельзя редактировать чужой профиль.");
            using (var uow = this.CreateUnitOfWork())
            {
                var userOld = uow.UserRepository.GetById(user.Id);
                user.CreatedOn = userOld.CreatedOn;
                user.PasswordHash = userOld.PasswordHash;

                return uow.UserRepository.Save(user);
            }
        }
    }
}
