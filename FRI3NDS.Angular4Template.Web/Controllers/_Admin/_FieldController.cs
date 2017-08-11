using FRI3NDS.Angular4Template.Core.Models.Domain;
using FRI3NDS.Angular4Template.Web.Models.ViewModels;
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
    public class _FieldController: SecureControllerBase
    {
        public _FieldController()
        {
        }

        static List<_FieldType> _fieldTypes = new List<_FieldType>()
        {
            new _FieldType()
            {
                Id = 1,
                Name = "Integer"
            },
            new _FieldType()
            {
                Id = 2,
                Name = "String"
            },
            new _FieldType()
            {
                Id = 3,
                Name = "Date"
            },
            new _FieldType()
            {
                Id = 4,
                Name = "Anything else"
            },
        };

        static List<_Field> _fields = new List<_Field>()
        {
            new _Field()
            {
                Id = 1,
                _EntityId = 1,
                _FieldTypeId = 1,
                Name = "_test_entity_id",
                DatabaseName = "_test_entity_id"
            },
            new _Field()
            {
                Id = 2,
                _EntityId = 1,
                _FieldTypeId = 2,
                Name = "name",
                DatabaseName = "name"
            },
            new _Field()
            {
                Id = 3,
                _EntityId = 1,
                _FieldTypeId = 3,
                Name = "date",
                DatabaseName = "date"
            },
            new _Field()
            {
                Id = 4,
                _EntityId = 2,
                _FieldTypeId = 2,
                Name = "name",
                DatabaseName = "name"
            },
            new _Field()
            {
                Id = 5,
                _EntityId = 2,
                _FieldTypeId = 1,
                Name = "_test_entity_id",
                DatabaseName = "_test_entity_id"
            },
            new _Field()
            {
                Id = 6,
                _EntityId = 2,
                _FieldTypeId = 1,
                Name = "_test_subentity_id",
                DatabaseName = "_test_subentity_id"
            },
        };

        [Route("")]
        [HttpGet]
        public List<_Field> GetFields([FromQuery]_FieldFilter filter)
        {
            return _fields
                .Where(e => filter?._EntityId == null || e._EntityId == filter._EntityId)
                .ToList();
        }

        [Route("GetFieldTypes")]
        [HttpGet]
        public List<_FieldType> GetFieldTypes()
        {
            return _fieldTypes;
        }

        [Route("{id}")]
        [HttpGet]
        public _Field GetFieldById(int id)
        {
            return _fields.FirstOrDefault(e => e.Id == id);
        }

        [Route("")]
        [HttpPost]
        public _Field Save([FromBody]_FieldBase field)
        {
            if (field.Id == 0)
            {
                field.Id = _fields.Select(e => e.Id).Max() + 1;
            }
            _fields = _fields.Where(e => e.Id != field.Id).ToList();
            var newField = new _Field()
            {
                Id = field.Id,
                DatabaseName = field.DatabaseName,
                _EntityId = field._EntityId,
                _FieldTypeId = field._FieldTypeId,
                Name = field.Name
            };
            _fields.Add(newField);
            return newField;
        }

        [Route("{id}")]
        [HttpDelete]
        public _Field Delete(int id)
        {
            var oldField = _fields.Where(e => e.Id == id).FirstOrDefault();
            _fields.Remove(oldField);
            return oldField;
        }
    }
}
