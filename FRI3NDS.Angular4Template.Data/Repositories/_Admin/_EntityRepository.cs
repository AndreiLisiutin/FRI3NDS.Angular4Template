using Dapper;
using FRI3NDS.Angular4Template.Core.Interfaces.Data.Repositories;
using FRI3NDS.Angular4Template.Core.Interfaces.Data.Repositories._Admin;
using FRI3NDS.Angular4Template.Core.Models.Domain;
using FRI3NDS.Angular4Template.Data.UnitOfWork;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;

namespace FRI3NDS.Angular4Template.Data.Repositories
{
	internal class _EntityRepository : RepositoryBase<_Entity>, I_EntityRepository
    {
        public _EntityRepository(DataContext dataContext)
            : base(dataContext)
        {
        }
        
        public _Entity GetById(int id)
        {
            return this.Query(id: id, pageSize: 1)
                .FirstOrDefault();
        }
        
        public List<_Entity> Query(
            int? id = null,
            string name = null,
            string databaseName = null,
            int pageSize = 1000,
            int pageNumber = 0)
        {
            DynamicParameters @params = new DynamicParameters();
            @params.Add("_id", id, DbType.Int32);
            @params.Add("_name", name, DbType.String);
            @params.Add("_db_name", databaseName, DbType.String);
            @params.Add("_page_size", pageSize, DbType.Int32);
            @params.Add("_page_number", pageNumber, DbType.Int32);

            return this._dataContext.Connection.Query<_Entity>("_Entity$Query", @params, this._dataContext.Transaction, commandType: CommandType.StoredProcedure)
                .ToList();
        }
        
        public _EntityBase Save(_EntityBase item)
        {
            DynamicParameters @params = new DynamicParameters();
            @params.Add("_id", item.Id, DbType.Int32);
            @params.Add("_name", item.Name, DbType.String);
            @params.Add("_db_name", item.DatabaseName, DbType.String);
            @params.Add("_db_scheme", item.DatabaseScheme, DbType.String);

            item.Id = this._dataContext.Connection.ExecuteScalar<int>("_Entity$Save", @params, this._dataContext.Transaction, commandType: CommandType.StoredProcedure);
            return item;
        }

        public int Delete(int id)
        {
            DynamicParameters @params = new DynamicParameters();
            @params.Add("_id", id, DbType.Int32);

            var result = this._dataContext.Connection.ExecuteScalar<int>("_Entity$Delete", @params, this._dataContext.Transaction, commandType: CommandType.StoredProcedure);
            return result;
        }
    }
}
