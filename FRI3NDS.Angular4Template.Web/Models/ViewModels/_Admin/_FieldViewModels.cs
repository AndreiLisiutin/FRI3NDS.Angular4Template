﻿using FRI3NDS.Angular4Template.Core.Models.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FRI3NDS.Angular4Template.Web.Models.ViewModels._Admin
{

	public class _FieldFilter
	{
		public _FieldFilter()
		{
			this.PageSize = 1000;
			this.PageNumber = 0;
			this.SortDirection = (int)SortDirections.Ascending;
		}

		public int? Id { get; set; }
		public string Name { get; set; }
		public string DatabaseName { get; set; }
		public int? _EntityId { get; set; }
		public int PageSize { get; set; }
		public int PageNumber { get; set; }

		public string SortField { get; set; }
		public int SortDirection { get; set; }
	}
}
