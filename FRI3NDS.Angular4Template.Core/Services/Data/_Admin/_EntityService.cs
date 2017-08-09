using FRI3NDS.Angular4Template.Core.Interfaces.Services.Data._Admin;
using System;
using System.Collections.Generic;
using System.Text;
using FRI3NDS.Angular4Template.Core.Interfaces.Data;
using FRI3NDS.Angular4Template.Core.Models.Domain;

namespace FRI3NDS.Angular4Template.Core.Services.Data._Admin
{
    public class _EntityService : DataServiceBase, I_EntityService
    {
        public _EntityService(IUnitOfWorkFactory unitOfWorkFactory) 
            : base(unitOfWorkFactory)
        {
        }
        
    }
}
