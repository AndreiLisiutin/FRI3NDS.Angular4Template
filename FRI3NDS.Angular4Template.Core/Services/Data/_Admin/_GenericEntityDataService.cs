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
		private readonly string SQL_DATE_TIME_FORMAT = "DD.MM.YYYY HH24:MI:SS";
		private readonly string DOT_NET_DATE_TIME_FORMAT = "dd.MM.yyyy HH:mm:ss";

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
		/// <param name="filters">Фильтры.</param>
		/// <param name="pageSize">Размер страницы.</param>
		/// <param name="pageNumber">Номер страницы.</param>
		/// <returns>Список обобщенных сущностей.</returns>
		public List<_GenericEntity> GetEntitiesList(
			int _entityId,
			int? sort_FieldId = null,
			SortDirections sortDirection = SortDirections.Ascending,
			List<_GenericEntityFieldFilter> filters = null,
			int pageSize = 1000,
			int pageNumber = 0)
		{
			using (var uow = this.CreateAdminUnitOfWork())
			{
				_Entity entity = uow._EntityRepository.GetById(_entityId);
				List<_Field> fields = uow._FieldRepository.Query(entityId: _entityId);
				_Field sortField = fields.FirstOrDefault(f => f.Id == sort_FieldId) ?? fields.First();

				IEnumerable<string> selectList = fields.Select(f =>
				{
					switch (f._FieldTypeId)
					{
						case (int)_FieldTypes.Integer:
						case (int)_FieldTypes.Decimal:
							return $"CAST({f.DatabaseName} AS TEXT) AS f_{f.Id}";
						case (int)_FieldTypes.DateTime:
							return $"TO_CHAR({f.DatabaseName}, '{SQL_DATE_TIME_FORMAT}') AS f_{f.Id}";
						default:
							return $"{f.DatabaseName} AS f_{f.Id}";
					}
				});

				filters = filters ?? new List<_GenericEntityFieldFilter>();
				IEnumerable<string> filterList = filters.Select(f =>
				{
					var field = fields.FirstOrDefault(x => x.Id == f._FieldId);
					Argument.Require(field != null, "Не найдено поле сущности для фильтра.");
					object deserializedValue = _DeserializeField(f.Value, field._FieldTypeId);
					string sqlValue = _ToSqlField(deserializedValue, field._FieldTypeId);
					return $"{field.DatabaseName} = {sqlValue}";
				});


				string query =
					$"SELECT " +
					$"{Environment.NewLine}{string.Join($"{Environment.NewLine}, ", selectList)} " +
					$"{Environment.NewLine}FROM {entity.DatabaseScheme}.\"{entity.DatabaseName}\" " +
					(!filterList.Any() ? "" : $"{Environment.NewLine}WHERE {string.Join($"{Environment.NewLine} AND ", filterList)} ") +
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

		public _GenericEntity GetEntityById(int entityId, int entityInstanceId)
		{
			Argument.Require(entityId > 0, "Идентификатор сущности пустой.");
			Argument.Require(entityInstanceId > 0, "Идентификатор экземпляра сущности пустой.");

			using (var uow = this.CreateAdminUnitOfWork())
			{
				List<_Field> fields = uow._FieldRepository.Query(entityId: entityId);
				_Field identityField = fields.FirstOrDefault(f => f.IsIdentity);
				Argument.Require(identityField != null, "В сущности не найдено поле-идентификатор.");

				return this.GetEntitiesList(
					_entityId: entityId,
					pageSize: 1,
					filters: new List<_GenericEntityFieldFilter>()
					{
						new _GenericEntityFieldFilter() { _FieldId = identityField.Id, Value = entityInstanceId.ToString() }
					})
					.FirstOrDefault();
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

				var identityFieldWithValue = genericEntity.Fields.FirstOrDefault(e => e.FieldId == identityField.Id);
				Argument.Require(identityFieldWithValue != null, "Не найдено значение поля-идентификатора в сохраняемых данных.");
				bool isEdit = string.IsNullOrWhiteSpace(identityFieldWithValue.Value)
					|| Int32.TryParse(identityFieldWithValue.Value, out int id) && id == 0;

				if (isEdit)
				{
					_GenericEntity existingEntityInstance = this.GetEntitiesList(
					_entityId: entity.Id,
					filters: new List<_GenericEntityFieldFilter>() { new _GenericEntityFieldFilter() { _FieldId = identityField.Id, Value = identityFieldWithValue.Value } },
					pageSize: 1).FirstOrDefault();
					Argument.Require(existingEntityInstance != null, "Обновляемая сущность не найдена.");
				}

				Dictionary<int, string> fieldSqlValues = new Dictionary<int, string>();
				foreach (var field in fields)
				{
					_GenericEntityField fieldWithValue = genericEntity.Fields.FirstOrDefault(x => x.FieldId == field.Id);
					object deserializedValue = _DeserializeField(fieldWithValue?.Value, field._FieldTypeId);
					string sqlValue = _ToSqlField(deserializedValue, field._FieldTypeId);
					fieldSqlValues[field.Id] = sqlValue;
				}

				string fieldNames = string.Join($"{Environment.NewLine}, ", fields.Where(f => !f.IsIdentity).Select(f => f.DatabaseName));
				string fieldValues = string.Join($"{Environment.NewLine}, ", fields.Where(f => !f.IsIdentity).Select(f => fieldSqlValues[f.Id]));

				string upsertQuery = null;
				if (isEdit)
				{
					upsertQuery =
					$"UPDATE  {entity.DatabaseScheme}.\"{entity.DatabaseName}\" " +
					"SET (" +
					$"{Environment.NewLine}{fieldNames}" +
					")" +
					$"{Environment.NewLine}= ({fieldValues})" +
					$"{Environment.NewLine}WHERE {identityField.DatabaseName} = {fieldSqlValues[identityField.Id]};";
				}
				else
				{
					upsertQuery =
						$"INSERT INTO  {entity.DatabaseScheme}.\"{entity.DatabaseName}\" " +
						$"{Environment.NewLine}(" +
						$"{Environment.NewLine}{fieldNames}" +
						$"{Environment.NewLine}) VALUES (" +
						$"{Environment.NewLine}{fieldValues}" +
						$"{Environment.NewLine}) " +
						$"{Environment.NewLine}RETURNING {identityField.DatabaseName};";
				}
				var result = uow._DynamicRepository.Sql(upsertQuery);
				return 1;
			}
		}

		private string _ToSqlField(object fieldValue, int fieldTypeId)
		{
			if (string.IsNullOrEmpty(fieldValue?.ToString()))
			{
				return "NULL";
			}
			string sqlValue = null;
			switch (fieldTypeId)
			{
				case (int)_FieldTypes.Integer:
					sqlValue = ((int)fieldValue).ToString();
					break;
				case (int)_FieldTypes.Decimal:
					sqlValue = ((decimal)fieldValue).ToString().Replace(",", ".");
					break;
				case (int)_FieldTypes.DateTime:
					sqlValue = $"to_timestamp('{((DateTime)fieldValue).ToString(DOT_NET_DATE_TIME_FORMAT)}', '{SQL_DATE_TIME_FORMAT}')";
					break;
				default:
					sqlValue = $"'{fieldValue}'";
					break;
			}
			return sqlValue;
		}

		private object _DeserializeField(string fieldSerializedValue, int fieldTypeId)
		{
			if (string.IsNullOrEmpty(fieldSerializedValue))
			{
				return null;
			}
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
					if (DateTime.TryParseExact(fieldSerializedValue, DOT_NET_DATE_TIME_FORMAT,
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
