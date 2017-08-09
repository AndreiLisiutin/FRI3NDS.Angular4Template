using FRI3NDS.Angular4Template.Core.Models.Domain;
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
        public _EntityController()
        {
        }

        static List<_Entity> _entities = new List<_Entity>()
        {
            new _Entity()
            {
                Id = 1,
                Name = "Test entity",
                DatabaseName = "_test_entity",
                DatabaseScheme = "public"
            },
            new _Entity()
            {
                Id = 2,
                Name = "Test subentity",
                DatabaseName = "_test_subentity",
                DatabaseScheme = "public"
            }
        };

        [Route("")]
        [HttpGet]
        public List<_Entity> GetEntities()
        {
            return _entities;
        }

        [Route("{id}")]
        [HttpGet]
        public _Entity GetEntityById(int id)
        {
            return _entities.FirstOrDefault(e => e.Id == id);
        }

        [Route("")]
        [HttpPost]
        public _Entity Save([FromBody]_EntityBase entity)
        {
            if (entity.Id == 0)
            {
                entity.Id = _entities.Select(e => e.Id).Max() + 1;
            }
            _entities = _entities.Where(e => e.Id != entity.Id).ToList();
            var newEntity = new _Entity()
            {
                Id = entity.Id,
                DatabaseName = entity.DatabaseName,
                DatabaseScheme = entity.DatabaseScheme,
                Name = entity.Name
            };
            _entities.Add(newEntity);
            return newEntity;
        }

        [Route("{id}")]
        [HttpDelete]
        public _Entity Delete(int id)
        {
            var oldEntity = _entities.Where(e => e.Id == id).FirstOrDefault();
            _entities.Remove(oldEntity);
            return oldEntity;
        }
    }
}
