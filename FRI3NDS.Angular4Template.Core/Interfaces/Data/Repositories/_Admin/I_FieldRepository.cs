using FRI3NDS.Angular4Template.Core.Models.Domain;
using System;
using System.Collections.Generic;
using System.Text;

namespace FRI3NDS.Angular4Template.Core.Interfaces.Data.Repositories._Admin
{
    public interface I_FieldRepository
    {
        _Field GetById(int id);

        List<_Field> Query(
            int? id = null,
            string name = null,
            string databaseName = null,
            int? entityId = null,
            int pageSize = 1000,
            int pageNumber = 0);

        _FieldBase Save(_FieldBase item);

        int Delete(int id);
    }
}
