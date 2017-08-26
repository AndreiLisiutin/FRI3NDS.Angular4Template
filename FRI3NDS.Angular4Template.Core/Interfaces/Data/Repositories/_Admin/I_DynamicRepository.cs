using System;
using System.Collections.Generic;
using System.Text;

namespace FRI3NDS.Angular4Template.Core.Interfaces.Data.Repositories._Admin
{
	public interface I_DynamicRepository
	{
		/// <summary>
		/// Сделать что-то страшное.
		/// </summary>
		/// <param name="query"></param>
		/// <param name="parameters"></param>
		/// <returns></returns>
		List<IDictionary<string, object>> Sql(string query, object parameters = null);
	}
}
