using FRI3NDS.Angular4Template.Core.Models.Domain;
using System;
using System.Collections.Generic;
using System.Text;

namespace FRI3NDS.Angular4Template.Core.Interfaces.Data.Repositories._Admin
{
    public interface I_FieldTypeRepository
    {
        _FieldType GetById(int id);

        List<_FieldType> Query(
            int? id = null,
            string name = null,
            int pageSize = 1000,
            int pageNumber = 0);

        _FieldTypeBase Save(_FieldTypeBase item);

        int Delete(int id);
    }
}
