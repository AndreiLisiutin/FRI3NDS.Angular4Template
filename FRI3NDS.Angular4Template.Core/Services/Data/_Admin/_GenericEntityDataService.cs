using FRI3NDS.Angular4Template.Core.Interfaces.Data;
using FRI3NDS.Angular4Template.Core.Interfaces.Services.Data._Admin;
using FRI3NDS.Angular4Template.Core.Models.Business._Admin;
using FRI3NDS.Angular4Template.Core.Models.Domain;
using FRI3NDS.Angular4Template.Core.Models.Domain._Admin;
using FRI3NDS.Angular4Template.Core.Models.Enums;
using FRI3NDS.Angular4Template.Core.Models.Enums._Admin;
using FRI3NDS.Angular4Template.Util;
using FRI3NDS.Angular4Template.Util.Extensions;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;

namespace FRI3NDS.Angular4Template.Core.Services.Data._Admin
{
	/// <summary>
	/// Сервис, работающий с метаданными сущностей и делающий по метаданным выборки для админки.
	/// </summary>
	public class _GenericEntityDataService : DataServiceBase, I_GenericEntityDataService
	{
		/// <summary>
		/// Конструктор сервиса, работающего с метаданными сущностей и делающего по метаданным выборки для админки.
		/// </summary>
		/// <param name="unitOfWorkFactory">Фабрика единиц работы.</param>
		public _GenericEntityDataService(IUnitOfWorkFactory unitOfWorkFactory)
			: base(unitOfWorkFactory)
		{
		}

		/// <summary>
		/// Получить список экземпляров сущности.
		/// </summary>
		/// <param name="_entityId">Идентификатор сущности.</param>
		/// <param name="sort_FieldId">Идентификатор поля для сортировки.</param>
		/// <param name="sortDirection">Идентификатор направления сортировки.</param>
		/// <param name="pageSize">Размер страницы.</param>
		/// <param name="pageNumber">Номер страницы.</param>
		/// <returns>Список обобщенных сущностей.</returns>
		public List<_GenericEntity> GetEntitiesList(
			int _entityId,
			int? sort_FieldId,
			SortDirections sortDirection,
			int pageSize = 1000,
			int pageNumber = 0)
		{
			using (var uow = this.CreateAdminUnitOfWork())
			{
				_Entity entity = uow._EntityRepository.GetById(_entityId);
				List<_Field> fields = uow._FieldRepository.Query(entityId: _entityId);
				_Field sortField = fields.FirstOrDefault(f => f.Id == sort_FieldId) ?? fields.First();

				IEnumerable<string> selectString = fields.Select(f =>
				{
					switch (f._FieldTypeId)
					{
						case (int)_FieldTypes.Integer:
						case (int)_FieldTypes.Decimal:
							return $"CAST({f.DatabaseName} AS TEXT) AS f_{f.Id}";
						case (int)_FieldTypes.DateTime:
							return $"TO_CHAR({f.DatabaseName}, 'DD.MM.YYYY HH24:MI:SS') AS f_{f.Id}";
						default:
							return $"{f.DatabaseName} AS f_{f.Id}";
					}
				});


				string query =
					$"SELECT " +
					$"{Environment.NewLine}{string.Join($"{Environment.NewLine}, ", selectString)} " +
					$"{Environment.NewLine}FROM {entity.DatabaseScheme}.\"{entity.DatabaseName}\" " +
					$"{Environment.NewLine}ORDER BY {sortField.DatabaseName} {sortDirection.GetDescription()} " +
					$"{Environment.NewLine}OFFSET {pageNumber} * {pageSize} LIMIT {pageSize};";

				List<_GenericEntity> result = uow._DynamicRepository.Sql(query)
					.Select(e =>
					{
						var ent = new _GenericEntity()
						{
							EntityId = _entityId
						};
						ent.Fields = e
						.Select(f =>
						{
							var fieldId = Int32.Parse(f.Key.Replace("f_", ""));
							var field = fields.FirstOrDefault(x => x.Id == fieldId);

							return new _GenericEntityField()
							{
								FieldId = fieldId,
								_FieldTypeId = field._FieldTypeId,
								Value = f.Value as string
							};
						})
						.ToList();
						return ent;
					})
					.ToList();
				return result;
			}
		}

		public int SaveEntity(_GenericEntity genericEntity, int userId)
		{
			Argument.Require(genericEntity != null, "Сущность пустая.");
			Argument.Require(userId > 0, "Идентификатор пользователя пустой.");
			Argument.Require(genericEntity.EntityId > 0, "Идентификатор сущности пустой.");

			using (var uow = this.CreateAdminUnitOfWork())
			{
				_Entity entity = uow._EntityRepository.GetById(genericEntity.EntityId);
				Argument.Require(entity != null, "Сущность не найдена.");

				List<_Field> fields = uow._FieldRepository.Query(entityId: entity.Id);

				_Field identityField = fields.FirstOrDefault(f => f.IsIdentity);
				Argument.Require(identityField != null, "В сущности не найдено поле-идентификатор.");

				//string query =
				//	$"INSERT INTO  {entity.DatabaseScheme}.\"{entity.DatabaseName}\" " +
				//	"(" +
				//	$"{Environment.NewLine}{string.Join($"{Environment.NewLine}, ", fields.Where(f => !f.IsIdentity).Select(f => f.DatabaseName))}" +
				//	")" +
				//	$"{Environment.NewLine}VALUES ({string.Join($"{Environment.NewLine}, ", fields.Where(f => !f.IsIdentity).Select(f => "@" + f.DatabaseName))});";
				string updateQuery =
					$"UPDATE  {entity.DatabaseScheme}.\"{entity.DatabaseName}\" " +
					"SET (" +
					$"{Environment.NewLine}{string.Join($"{Environment.NewLine}, ", fields.Where(f => !f.IsIdentity).Select(f => f.DatabaseName))}" +
					")" +
					$"{Environment.NewLine}= ({string.Join($"{Environment.NewLine}, ", fields.Where(f => !f.IsIdentity).Select(f => ":" + f.DatabaseName))})" +
					$"{Environment.NewLine}WHERE {identityField.DatabaseName} = :{identityField.DatabaseName};";

				Dictionary<string, object> parameters = new Dictionary<string, object>();
				foreach (var field in fields.Where(f => !f.IsIdentity))
				{
					_GenericEntityField fieldWithValue = genericEntity.Fields.FirstOrDefault(f => f.FieldId == field.Id);
					parameters[":" + field.DatabaseName] = _DeserializeField(fieldWithValue?.Value, field._FieldTypeId);
				}
				_GenericEntityField identityFieldWithValue = genericEntity.Fields.FirstOrDefault(f => f.FieldId == identityField.Id);
				parameters[":" + identityField.DatabaseName] = _DeserializeField(identityFieldWithValue?.Value, identityFieldWithValue._FieldTypeId);
				var result = uow._DynamicRepository.Sql(updateQuery, parameters);
				return 1;
			}
		}

		private object _DeserializeField(string fieldSerializedValue, int fieldTypeId)
		{
			object fieldValue = null;
			switch (fieldTypeId)
			{
				case (int)_FieldTypes.Integer:
					if (Int32.TryParse(fieldSerializedValue, out int fieldIntValue))
					{
						fieldValue = fieldIntValue;
					}
					break;
				case (int)_FieldTypes.Decimal:
					if (Decimal.TryParse(fieldSerializedValue, out decimal fieldDecValue))
					{
						fieldValue = fieldDecValue;
					}
					break;
				case (int)_FieldTypes.DateTime:
					if (DateTime.TryParseExact(fieldSerializedValue, "dd.MM.yyyy HH:mm:ss",
						CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime fieldDateValue))
					{
						fieldValue = fieldDateValue;
					}
					break;
				default:
					fieldValue = fieldSerializedValue;
					break;
			}
			return fieldValue;
		}

		/// <summary>
		/// Получить количество экземпляров сущности.
		/// </summary>
		/// <param name="_entityId">Идентификатор сущности.</param>
		/// <returns>Количество обобщенных сущностей.</returns>
		public int GetEntitiesCount(
			int _entityId)
		{
			using (var uow = this.CreateAdminUnitOfWork())
			{
				_Entity entity = uow._EntityRepository.GetById(_entityId);

				string query =
					$"SELECT COUNT(*) " +
					$"{Environment.NewLine}FROM {entity.DatabaseScheme}.\"{entity.DatabaseName}\";";

				int result = uow._DynamicRepository.Sql(query)
					.Select(e =>
					{
						return Int32.TryParse(e.FirstOrDefault().Value?.ToString(), out int count) ? count : 0;
					})
					.FirstOrDefault();
				return result;

			}
		}

	}
}
