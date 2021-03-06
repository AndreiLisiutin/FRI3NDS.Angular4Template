﻿using FRI3NDS.Angular4Template.Core.Interfaces.Services.Data._Admin;
using System;
using System.Collections.Generic;
using System.Text;
using FRI3NDS.Angular4Template.Core.Interfaces.Data;
using FRI3NDS.Angular4Template.Core.Models.Domain;
using FRI3NDS.Angular4Template.Util;
using FRI3NDS.Angular4Template.Core.Models.Domain._Admin;
using FRI3NDS.Angular4Template.Core.Models.Enums;
using System.Linq;

namespace FRI3NDS.Angular4Template.Core.Services.Data._Admin
{
	public class _FieldService : DataServiceBase, I_FieldService
	{
		public _FieldService(IUnitOfWorkFactory unitOfWorkFactory)
			: base(unitOfWorkFactory)
		{
		}

		/// <summary>
		/// Получить поле по ее идентификатору.
		/// </summary>
		/// <param name="id">Идентификатор поля.</param>
		/// <returns>Пользователь.</returns>
		public _Field GetById(int id)
		{
			using (var uow = this.CreateAdminUnitOfWork())
			{
				return uow._FieldRepository.GetById(id);
			}
		}

		public List<_Field> Query(
			int? id = null,
			string name = null,
			string databaseName = null,
			int? entityId = null,
			string sortField = null,
			SortDirections? sortDirection = null,
			int pageSize = 1000,
			int pageNumber = 0)
		{
			using (var uow = this.CreateAdminUnitOfWork())
			{
				return uow._FieldRepository.Query(
					id: id,
					name: name,
					databaseName: databaseName,
					entityId: entityId,
					sortField: sortField,
					sortDirection: sortDirection,
					pageSize: pageSize,
					pageNumber: pageNumber);
			}
		}

		public int Count(
			string name = null,
			string databaseName = null,
			int? entityId = null)
		{
			using (var uow = this.CreateAdminUnitOfWork())
			{
				return uow._FieldRepository.Count(
					name: name,
					databaseName: databaseName,
					entityId: entityId);
			}
		}

		/// <summary>
		/// Получить список типов полей.
		/// </summary>
		/// <returns>Типы полей.</returns>
		public List<_FieldType> QueryFieldTypes()
		{
			using (var uow = this.CreateAdminUnitOfWork())
			{
				return uow._FieldTypeRepository.Query();
			}
		}

		/// <summary>
		/// Сохранить поле.
		/// </summary>
		/// <param name="field">Поле.</param>
		/// <param name="currentUserId">Идентификатор текущего пользователя.</param>
		/// <returns>Поле.</returns>
		public _FieldBase Save(_FieldBase field, int currentUserId)
		{
			{
				Argument.Require(currentUserId != 0, "Текущий пользователь не определен.");
				Argument.Require(field != null, "Поле пустое.");
				Argument.Require(field._EntityId > 0, "Идентификатор сущности пустой.");
				using (var uow = this.CreateAdminUnitOfWork())
				{
					if (field.IsIdentity)
					{
						List<_Field> entityFields = uow._FieldRepository.Query(entityId: field._EntityId);
						_Field identity = entityFields.FirstOrDefault(f => f.IsIdentity);
						Argument.Require(identity == null || identity.Id == field.Id, 
							$"У сущности должно быть единственное поле-идентификатор. " +
							$"В сущности \"{identity._EntityName}\" поле-идентификатор \"{identity.Name}\".");
					}
					return uow._FieldRepository.Save(field);
				}
			}
		}

		/// <summary>
		/// Удалить поле.
		/// </summary>
		/// <param name="id">Идентификатор поля.</param>
		/// <returns>Идентификатор поля.</returns>
		public int Delete(int id)
		{
			using (var uow = this.CreateAdminUnitOfWork())
			{
				return uow._FieldRepository.Delete(id);
			}
		}
	}
}
