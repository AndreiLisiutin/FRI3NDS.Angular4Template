using FRI3NDS.Angular4Template.Core.Models.Domain._Admin;
using FRI3NDS.Angular4Template.Web.Models.ViewModels._Admin;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FRI3NDS.Angular4Template.Web.Controllers._Admin
{
	[Route("api/Admin/_FormField")]
	[Authorize]
	public class _FormFieldController : SecureControllerBase
	{
		public _FormFieldController()
		{
		}

		static List<_FormField> list = new List<_FormField>()
		{
			new _FormField()
			{
				Id = 1,
				Label = "Test entity ID",
				Column = 0,
				Row = 0,
				Length = 5,
				_FieldId = 1,
				_FormId = 1,
				_FieldTypeId = 1
			},
			new _FormField()
			{
				Id = 2,
				Label = "Test entity name",
				Column = 5,
				Row = 0,
				Length = 5,
				_FieldId = 2,
				_FormId = 1,
				_FieldTypeId = 3
			},
			new _FormField()
			{
				Id = 3,
				Label = "Test entity date",
				Column = 0,
				Row = 1,
				Length = 5,
				_FieldId = 3,
				_FormId = 1,
				_FieldTypeId = 4
			},
		};

		[Route("")]
		[HttpGet]
		public List<_FormField> GetFormFields(_FormFieldFilter filter)
		{
			return list
				.Where(e => !filter._FormId.HasValue || e._FormId == filter._FormId)
				.ToList();
		}
	}
}
