using Dapper;
using FRI3NDS.Angular4Template.Core.Interfaces.Data.Repositories;
using FRI3NDS.Angular4Template.Core.Interfaces.Data.Repositories._Admin;
using FRI3NDS.Angular4Template.Core.Models.Domain;
using FRI3NDS.Angular4Template.Core.Models.Domain._Admin;
using FRI3NDS.Angular4Template.Core.Models.Enums;
using FRI3NDS.Angular4Template.Data.UnitOfWork;
using FRI3NDS.Angular4Template.Util.Extensions;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;

namespace FRI3NDS.Angular4Template.Data.Repositories._Admin
{
	internal class _FieldRepository : RepositoryBase<_Field>, I_FieldRepository
	{
		public _FieldRepository(DataContext dataContext)
			: base(dataContext)
		{
		}

		public _Field GetById(int id)
		{
			return this.Query(id: id, pageSize: 1)
				.FirstOrDefault();
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
			DynamicParameters @params = new DynamicParameters();
			@params.Add("_id", id, DbType.Int32);
			@params.Add("_name", name, DbType.String);
			@params.Add("_db_name", databaseName, DbType.String);
			@params.Add("__entity_id", entityId, DbType.Int32);
			@params.Add("_page_size", pageSize, DbType.Int32);
			@params.Add("_page_number", pageNumber, DbType.Int32);
			@params.Add("_sort_field", sortField, DbType.String);
			@params.Add("_sort_direction", sortDirection.GetDescription(), DbType.String);

			return this._dataContext.Connection.Query<_Field>("_Field$Query", @params, this._dataContext.Transaction, commandType: CommandType.StoredProcedure)
				.ToList();
		}

		public int Count(
			string name = null,
			string databaseName = null,
			int? entityId = null)
		{
			DynamicParameters @params = new DynamicParameters();
			@params.Add("_name", name, DbType.String);
			@params.Add("_db_name", databaseName, DbType.String);
			@params.Add("__entity_id", entityId, DbType.Int32);

			return this._dataContext.Connection.Query<int>("_Field$Count", @params, this._dataContext.Transaction, commandType: CommandType.StoredProcedure)
				.FirstOrDefault();
		}

		public _FieldBase Save(_FieldBase item)
		{
			DynamicParameters @params = new DynamicParameters();
			@params.Add("_id", item.Id, DbType.Int32);
			@params.Add("__field_type_id", item._FieldTypeId, DbType.Int32);
			@params.Add("_name", item.Name, DbType.String);
			@params.Add("_db_name", item.DatabaseName, DbType.String);
			@params.Add("__entity_id", item._EntityId, DbType.Int32);

			item.Id = this._dataContext.Connection.ExecuteScalar<int>("_Field$Save", @params, this._dataContext.Transaction, commandType: CommandType.StoredProcedure);
			return item;
		}

		public int Delete(int id)
		{
			DynamicParameters @params = new DynamicParameters();
			@params.Add("_id", id, DbType.Int32);

			var result = this._dataContext.Connection.ExecuteScalar<int>("_Field$Delete", @params, this._dataContext.Transaction, commandType: CommandType.StoredProcedure);
			return result;
		}
	}
}
