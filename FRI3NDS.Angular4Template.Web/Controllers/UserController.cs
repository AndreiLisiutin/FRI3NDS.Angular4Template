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
    /// Контроллер для работы с пользователями.
    /// </summary>
    [Route("api/User")]
    public class UserController : SecureControllerBase
    {
        /// <summary>
        /// Сервис аутентификации и работы с учетными записями пользователей.
        /// </summary>
        public IUserDataService UserDataService { get; set; }

        /// <summary>
        /// Конструктор контроллера для работы с пользователями.
        /// </summary>
        /// <param name="userDataService">Сервис работы с пользователями.</param>
        public UserController(IUserDataService userDataService)
        {
            this.UserDataService = userDataService;
        }

        /// <summary>
        /// Получить текущего пользователя.
        /// </summary>
        /// <returns>Пользователь.</returns>
        [Route("GetCurrentUser")]
        [HttpGet]
        [Authorize]
        public User GetCurrentUser()
        {
            var id = this.GetCurrentUserId();
            User user = this.UserDataService.GetById(id);
            return user;
        }
    }
}
