using Dapper;
using FRI3NDS.Angular4Template.Core.Interfaces.Data.Repositories._Admin;
using FRI3NDS.Angular4Template.Core.Models.Domain._Admin;
using FRI3NDS.Angular4Template.Data.UnitOfWork;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;

namespace FRI3NDS.Angular4Template.Data.Repositories._Admin
{

	internal class _VersionRepository : RepositoryBase<_VersionBase>, I_VersionRepository
	{
		public _VersionRepository(DataContext dataContext)
			: base(dataContext)
		{
		}

		public _Version GetById(int id)
		{
			return this.Query(id: id, pageSize: 1)
				.FirstOrDefault();
		}

		public List<_Version> Query(
			int? id = null,
			string name = null,
			string scriptHash = null,
			int pageSize = 1000,
			int pageNumber = 0)
		{
			DynamicParameters @params = new DynamicParameters();
			@params.Add("_id", id, DbType.Int32);
			@params.Add("_name", name, DbType.String);
			@params.Add("_script_hash", scriptHash, DbType.String);
			@params.Add("_page_size", pageSize, DbType.Int32);
			@params.Add("_page_number", pageNumber, DbType.Int32);

			return this._dataContext.Connection.Query<_Version>("_Version$Query", @params, this._dataContext.Transaction, commandType: CommandType.StoredProcedure)
				.ToList();
		}

		public _VersionBase Save(_VersionBase item)
		{
			DynamicParameters @params = new DynamicParameters();
			@params.Add("_id", item.Id, DbType.Int32);
			@params.Add("_name", item.Name, DbType.String);
			@params.Add("_script_hash", item.ScriptHash, DbType.String);
			@params.Add("_description", item.Description, DbType.String);
			@params.Add("_applied_on", item.AppliedOn, DbType.Date);

			item.Id = this._dataContext.Connection.ExecuteScalar<int>("_Version$Save", @params, this._dataContext.Transaction, commandType: CommandType.StoredProcedure);
			return item;
		}

		public int Delete(int id)
		{
			DynamicParameters @params = new DynamicParameters();
			@params.Add("_id", id, DbType.Int32);

			var result = this._dataContext.Connection.ExecuteScalar<int>("_Version$Delete", @params, this._dataContext.Transaction, commandType: CommandType.StoredProcedure);
			return result;
		}
	}
}
