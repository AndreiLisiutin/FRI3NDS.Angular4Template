using FRI3NDS.Angular4Template.Core.Interfaces.Services.Data._Admin;
using FRI3NDS.Angular4Template.Core.Models.Domain;
using FRI3NDS.Angular4Template.Core.Services.Data._Admin;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FRI3NDS.Angular4Template.Web.Controllers._Admin
{
    [Route("api/Admin/_Entity")]
    [Authorize]
    public class _EntityController : SecureControllerBase
    {
        public I_EntityService EntityService { get; set; }

        public _EntityController(I_EntityService entityService)
        {
            this.EntityService = entityService;
        }
        
        [Route("")]
        [HttpGet]
        public List<_Entity> GetEntities()
        {
            return EntityService.Query();
        }

        [Route("{id}")]
        [HttpGet]
        public _Entity GetEntityById(int id)
        {
            return EntityService.GetById(id);
        }

        [Route("")]
        [HttpPost]
        public _EntityBase Save([FromBody]_EntityBase entity)
        {
            int userId = this.GetCurrentUserId();
            return EntityService.Save(entity, userId);
        }

        [Route("{id}")]
        [HttpDelete]
        public int Delete(int id)
        {
            return EntityService.Delete(id);
        }
    }
}
