using FRI3NDS.Angular4Template.Util.Attributes;
using System;
using System.Collections.Generic;
using System.Reflection;
using System.Text;

namespace FRI3NDS.Angular4Template.Util.Extensions
{
    /// <summary>
    /// Расширения перечислений.
    /// </summary>
    public static class EnumExtensions
    {
        /// <summary>
        /// Полчучить строковое описание перечисления.
        /// </summary>
        /// <param name="value">Зис. Текущее значение перечисления.</param>
        /// <returns>Строковое описание или NULL, если не задано.</returns>
        public static string GetDescription(this Enum value)
        {
            Type type = value.GetType();
            string name = Enum.GetName(type, value);
            if (name != null)
            {
                FieldInfo field = type.GetField(name);
                if (field != null)
                {
                    var attr = field.GetCustomAttribute<DescriptionAttribute>(true);
                    return attr?.Description;
                }
            }
            return null;
        }
    }
}
