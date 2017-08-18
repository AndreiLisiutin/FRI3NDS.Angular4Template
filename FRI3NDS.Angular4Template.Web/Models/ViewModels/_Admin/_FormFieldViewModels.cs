using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FRI3NDS.Angular4Template.Web.Models.ViewModels._Admin
{
    public class _FormFieldFilter
    {
        public _FormFieldFilter()
        {
            this.PageSize = 1000;
            this.PageNumber = 0;
        }

        public int? Id { get; set; }
        public int? _FormId { get; set; }
        public int? _FieldId { get; set; }
        public int PageSize { get; set; }
        public int PageNumber { get; set; }
    }
}
