using FRI3NDS.Angular4Template.Core.Interfaces.Services.Data._Admin;
using FRI3NDS.Angular4Template.Core.Models.Business._Admin;
using FRI3NDS.Angular4Template.Core.Models.Enums;
using FRI3NDS.Angular4Template.Web.Models.ViewModels._Admin;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FRI3NDS.Angular4Template.Web.Controllers._Admin
{
	[Route("api/Admin/_GenericEntity")]
	[Authorize]
	public class _GenericEntityController : SecureControllerBase
	{
		public I_GenericEntityDataService GenericEntityDataService { get; set; }

		public _GenericEntityController(I_GenericEntityDataService genericEntityDataService)
		{
			this.GenericEntityDataService = genericEntityDataService;
		}

		[Route("GetEntitiesList")]
		[HttpGet]
		public List<_GenericEntity> GetEntitiesList([FromQuery]_GenericEntityFilter filter)
		{
			return GenericEntityDataService.GetEntitiesList(
				_entityId: filter._EntityId,
				sort_FieldId: filter.Sort_FieldId,
				sortDirection: (SortDirections)filter.SortDirection,
				pageSize: filter.PageSize,
				pageNumber: filter.PageNumber
			);
		}

		[Route("GetEntitiesCount")]
		[HttpGet]
		public int GetEntitiesCount([FromQuery]_GenericEntityFilter filter)
		{
			return GenericEntityDataService.GetEntitiesCount(
				_entityId: filter._EntityId
			);
		}

		[Route("GetEntityById/{entityId}/{entityInstanceId}")]
		[HttpGet]
		public _GenericEntity GetEntityById(int entityId, int entityInstanceId)
		{
			return GenericEntityDataService.GetEntityById(entityId, entityInstanceId);
		}

		[Route("SaveEntity")]
		[HttpPost]
		public int SaveEntity([FromBody]_GenericEntity entity)
		{
			var userId = this.GetCurrentUserId();
			return GenericEntityDataService.SaveEntity(entity, userId);
		}
	}
}
