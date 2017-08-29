using FRI3NDS.Angular4Template.Core.Models.Business._Admin;
using FRI3NDS.Angular4Template.Core.Models.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace FRI3NDS.Angular4Template.Core.Interfaces.Services.Data._Admin
{
	public interface I_GenericEntityDataService
	{
		/// <summary>
		/// Получить список экземпляров сущности.
		/// </summary>
		/// <param name="_entityId">Идентификатор сущности.</param>
		/// <param name="sort_FieldId">Идентификатор поля для сортировки.</param>
		/// <param name="sortDirection">Идентификатор направления сортировки.</param>
		/// <param name="filters">Фильтры.</param>
		/// <param name="pageSize">Размер страницы.</param>
		/// <param name="pageNumber">Номер страницы.</param>
		/// <returns>Список обобщенных сущностей.</returns>
		List<_GenericEntity> GetEntitiesList(
			int _entityId,
			int? sort_FieldId = null,
			SortDirections sortDirection = SortDirections.Ascending,
			List<_GenericEntityFieldFilter> filters = null,
			int pageSize = 1000,
			int pageNumber = 0);

		_GenericEntity GetEntityById(int entityId, int entityInstanceId);

		/// <summary>
		/// Получить количество экземпляров сущности.
		/// </summary>
		/// <param name="_entityId">Идентификатор сущности.</param>
		/// <returns>Количество обобщенных сущностей.</returns>
		int GetEntitiesCount(
			int _entityId);

		int SaveEntity(_GenericEntity genericEntity, int userId);

	}
}
