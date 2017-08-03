using FRI3NDS.Angular4Template.Core.Interfaces.Services.Data;
using FRI3NDS.Angular4Template.Core.Models.Domain;
using FRI3NDS.Angular4Template.Util;
using FRI3NDS.Angular4Template.Web.Models;
using FRI3NDS.Angular4Template.Web.Models.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Principal;
using System.Threading.Tasks;

namespace FRI3NDS.Angular4Template.Web.Controllers
{
    /// <summary>
    /// Базовый контроллер.
    /// </summary>
    public class ControllerBase : Controller
    {
        /// <summary>
        /// Создать слепок данных о пользователе для его токена.
        /// </summary>
        /// <param name="user">Модель пользователя.</param>
        /// <returns>Модель пользователя для токена.</returns>
        protected ClaimsIdentity CreateClaimsIdentity(UserBase user)
        {
            return new ClaimsIdentity(
                new GenericIdentity(user.Login, "TokenAuth"),
                new List<Claim>()
                {
                    new Claim("Id", user.Id.ToString()),
                    new Claim("Name", user.Name)
                }
            );
        }

        /// <summary>
        /// Получить идентификатор пользователя, вошедшего в систему.
        /// </summary>
        protected int GetCurrentUserId()
        {
            if (User.Identity.IsAuthenticated)
            {
                ClaimsIdentity identity = User.Identity as ClaimsIdentity;
                int id;
                if (Int32.TryParse(identity.FindFirst("Id").Value, out id))
                {
                    return id;
                }
            }
            throw new InvalidOperationException("Unable to get logged user.");
        }
    }
    
    /// <summary>
    /// Базовый контроллер c поддержкой защиты от XSRF.
    /// </summary>
    [AutoValidateAntiforgeryToken]
    public class SecureControllerBase : ControllerBase
    {

    }
}
