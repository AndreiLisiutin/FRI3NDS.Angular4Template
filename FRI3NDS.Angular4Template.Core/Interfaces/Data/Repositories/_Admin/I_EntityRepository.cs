using FRI3NDS.Angular4Template.Core.Models.Domain;
using FRI3NDS.Angular4Template.Core.Models.Domain._Admin;
using FRI3NDS.Angular4Template.Core.Models.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace FRI3NDS.Angular4Template.Core.Interfaces.Data.Repositories._Admin
{
	public interface I_EntityRepository
	{
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

		_EntityBase Save(_EntityBase item);

		int Delete(int id);
	}
}
