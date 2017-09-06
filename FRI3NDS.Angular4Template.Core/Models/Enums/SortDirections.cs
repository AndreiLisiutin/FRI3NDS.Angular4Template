using FRI3NDS.Angular4Template.Util.Attributes;
using System;
using System.Collections.Generic;
using System.Text;

namespace FRI3NDS.Angular4Template.Core.Models.Enums
{
	/// <summary>
	/// Направления сортировки.
	/// </summary>
	public enum SortDirections
	{
		/// <summary>
		/// По возрастаню.
		/// </summary>
		[Description("ASC")]
		Ascending = 1,

		/// <summary>
		/// По убыванию.
		/// </summary>
		[Description("DESC")]
		Descending = -1
	}
}
