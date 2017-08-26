using FRI3NDS.Angular4Template.Core.Interfaces.Services.Data._Admin;
using FRI3NDS.Angular4Template.Core.Models.Domain;
using FRI3NDS.Angular4Template.Core.Models.Domain._Admin;
using FRI3NDS.Angular4Template.Core.Models.Enums;
using FRI3NDS.Angular4Template.Core.Services.Data._Admin;
using FRI3NDS.Angular4Template.Web.Models.ViewModels;
using FRI3NDS.Angular4Template.Web.Models.ViewModels._Admin;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FRI3NDS.Angular4Template.Web.Controllers._Admin
{
	[Route("api/Admin/_Field")]
	[Authorize]
	public class _FieldController : SecureControllerBase
	{
		public I_FieldService FieldService { get; set; }
		public _FieldController(I_FieldService fieldService)
		{
			this.FieldService = fieldService;
		}

		[Route("")]
		[HttpGet]
		public List<_Field> GetFields([FromQuery]_FieldFilter filter)
		{
			filter = filter ?? new _FieldFilter();
			return FieldService.Query(
				id: filter.Id,
				name: filter.Name,
				databaseName: filter.DatabaseName,
				entityId: filter._EntityId,
				sortField: filter.SortField,
				sortDirection: (SortDirections?)filter.SortDirection,
				pageSize: filter.PageSize,
				pageNumber: filter.PageNumber);
		}

		[Route("Count")]
		[HttpGet]
		public int CountFields([FromQuery]_FieldFilter filter)
		{
			filter = filter ?? new _FieldFilter();
			return FieldService.Count(
				name: filter.Name,
				databaseName: filter.DatabaseName,
				entityId: filter._EntityId);
		}

		[Route("GetFieldTypes")]
		[HttpGet]
		public List<_FieldType> GetFieldTypes()
		{
			return FieldService.QueryFieldTypes();
		}

		[Route("{id}")]
		[HttpGet]
		public _Field GetFieldById(int id)
		{
			return FieldService.GetById(id);
		}

		[Route("")]
		[HttpPost]
		public _FieldBase Save([FromBody]_FieldBase field)
		{
			int userId = GetCurrentUserId();
			return FieldService.Save(field, userId);
		}

		[Route("{id}")]
		[HttpDelete]
		public int Delete(int id)
		{
			return FieldService.Delete(id);
		}
	}
}
