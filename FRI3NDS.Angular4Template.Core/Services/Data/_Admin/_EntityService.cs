using FRI3NDS.Angular4Template.Core.Interfaces.Services.Data._Admin;
using System;
using System.Collections.Generic;
using System.Text;
using FRI3NDS.Angular4Template.Core.Interfaces.Data;
using FRI3NDS.Angular4Template.Core.Models.Domain;
using FRI3NDS.Angular4Template.Util;

namespace FRI3NDS.Angular4Template.Core.Services.Data._Admin
{
    public class _EntityService : DataServiceBase, I_EntityService
    {
        public _EntityService(IUnitOfWorkFactory unitOfWorkFactory)
            : base(unitOfWorkFactory)
        {
        }

        /// <summary>
        /// Получить сущность по ее идентификатору.
        /// </summary>
        /// <param name="id">Идентификатор сущности.</param>
        /// <returns>Пользователь.</returns>
        public _Entity GetById(int id)
        {
            using (var uow = this.CreateAdminUnitOfWork())
            {
                return uow._EntityRepository.GetById(id);
            }
        }


        public List<_Entity> Query(
            int? id = null,
            string name = null,
            string databaseName = null,
            int pageSize = 1000,
            int pageNumber = 0)
        {
            using (var uow = this.CreateAdminUnitOfWork())
            {
                List<_Entity> list = uow._EntityRepository.Query(
                    id: id,
                    name: name,
                    databaseName: databaseName,
                    pageSize: pageSize,
                    pageNumber: pageNumber);
                return list;
            }
        }

        /// <summary>
        /// Сохранить сущность.
        /// </summary>
        /// <param name="user">сущность.</param>
        /// <param name="currentUserId">Идентификатор текущего пользователя.</param>
        /// <returns>Сущность.</returns>
        public _EntityBase Save(_EntityBase entity, int currentUserId)
        {
            Argument.Require(currentUserId != 0, "Текущий пользователь не определен.");
            using (var uow = this.CreateAdminUnitOfWork())
            {
                var savedEntity = uow._EntityRepository.Save(entity);
                return savedEntity;
            }
        }

        /// <summary>
        /// Удалить сущность.
        /// </summary>
        /// <param name="id">Идентификатор сущности.</param>
        /// <returns>Идентификатор сущности.</returns>
        public int Delete(int id)
        {
            using (var uow = this.CreateAdminUnitOfWork())
            {
                return uow._EntityRepository.Delete(id);
            }
        }
    }
}
