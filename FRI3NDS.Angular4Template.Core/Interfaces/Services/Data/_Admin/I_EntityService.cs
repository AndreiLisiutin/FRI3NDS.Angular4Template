using FRI3NDS.Angular4Template.Core.Models.Domain;
using FRI3NDS.Angular4Template.Core.Models.Domain._Admin;
using FRI3NDS.Angular4Template.Core.Models.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace FRI3NDS.Angular4Template.Core.Interfaces.Services.Data._Admin
{
	public interface I_EntityService
	{
		/// <summary>
		/// Получить сущность по ее идентификатору.
		/// </summary>
		/// <param name="id">Идентификатор сущности.</param>
		/// <returns>Пользователь.</returns>
		_Entity GetById(int id);

		List<_Entity> Query(
			int? id = null,
			string name = null,
			string databaseName = null,
			string sortField = null,
			SortDirections? sortDirection = null,
			int pageSize = 1000,
			int pageNumber = 0);

		int Count(
			string name = null,
			string databaseName = null);

		/// <summary>
		/// Сохранить сущность.
		/// </summary>
		/// <param name="entity">сущность.</param>
		/// <param name="currentUserId">Идентификатор текущего пользователя.</param>
		/// <returns>Сущность.</returns>
		_EntityBase Save(_EntityBase entity, int currentUserId);

		/// <summary>
		/// Удалить сущность.
		/// </summary>
		/// <param name="id">Идентификатор сущности.</param>
		/// <returns>Идентификатор сущности.</returns>
		int Delete(int id);
	}
}
