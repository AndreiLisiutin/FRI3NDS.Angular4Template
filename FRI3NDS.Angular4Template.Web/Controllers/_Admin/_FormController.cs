using FRI3NDS.Angular4Template.Core.Models.Domain._Admin;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FRI3NDS.Angular4Template.Web.Controllers._Admin
{
    [Route("api/Admin/_Form")]
    [Authorize]
    public class _FormController : SecureControllerBase
    {
        public _FormController()
        {
        }

        static List<_Form> list = new List<_Form>()
        {
            new _Form()
            {
                Id = 1,
                Name = "Test entity ID",
                _EntityId = 1
            }
        };

        [Route("")]
        [HttpGet]
        public List<_Form> GetForms()
        {
            return list;
        }

        [Route("{id}")]
        [HttpGet]
        public _Form GetFormById(int id)
        {
            return list.FirstOrDefault(e => e.Id == id);
        }
    }
}
