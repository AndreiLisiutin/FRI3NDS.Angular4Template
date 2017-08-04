using FRI3NDS.Angular4Template.Core.Interfaces.Services.Data;
using FRI3NDS.Angular4Template.Core.Models.Domain;
using FRI3NDS.Angular4Template.Util;
using FRI3NDS.Angular4Template.Web.Models;
using FRI3NDS.Angular4Template.Web.Models.ViewModels;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
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
    /// Контроллер для работы с аутентификацией и учетными записями пользователей.
    /// </summary>
    [Route("api/Authentication")]
    public class AuthenticationController : SecureControllerBase
    {
        /// <summary>
        /// Сервис аутентификации и работы с учетными записями пользователей.
        /// </summary>
        public IAuthenticationDataService AuthenticationDataService { get; set; }
        IAntiforgery antiforgery;
        /// <summary>
        /// Конструктор контроллера для работы с аутентификацией и учетными записями пользователей.
        /// </summary>
        /// <param name="authenticationDataService">Сервис аутентификации и работы с учетными записями пользователей.</param>
        public AuthenticationController(IAuthenticationDataService authenticationDataService, IAntiforgery antiforgery)
        {
            this.AuthenticationDataService = authenticationDataService;
            this.antiforgery = antiforgery;
        }

        /// <summary>
        /// Действие входа в приложение, получение токена доступа.
        /// </summary>
        /// <param name="user">Данные пользователя.</param>
        /// <returns>Информация о токене доступа.</returns>
        [Route("Login")]
        [HttpPost]
        public TokenInfo GetAuthToken([FromBody]UserLoginModel user)
        {
            UserBase existUser = this.AuthenticationDataService.VerifyUser(user.Login, user.Password);
            Argument.Require(existUser != null, "Введенные данные пользователя не верны.");
            TokenInfo token = this._GenerateToken(existUser);
            return token;
        }

        /// <summary>
        /// Зарегистрироваться в системе.
        /// </summary>
        /// <param name="user">Данные для создания пользователя.</param>
        /// <returns>Информация о токене доступа.</returns>
        [Route("SignUp")]
        [HttpPost]
        public TokenInfo Registrer([FromBody]UserLoginModel user)
        {
            UserBase existUser = this.AuthenticationDataService.CreateUser(user.Login, user.Password);
            TokenInfo token = this._GenerateToken(existUser);
            return token;
        }

        /// <summary>
        /// Сгенерировать токен доступа.
        /// </summary>
        /// <param name="user">Пользователь системы.</param>
        /// <returns>Информация о сгенерированном токене.</returns>
        private TokenInfo _GenerateToken(UserBase user)
        {
            var handler = new JwtSecurityTokenHandler();
            var createdOn = DateTime.Now;
            var expiresOn = createdOn + TokenAuthenticationOptions.ExpiresSpan;

            ClaimsIdentity identity = CreateClaimsIdentity(user);
            var securityToken = handler.CreateToken(new SecurityTokenDescriptor
            {
                Issuer = TokenAuthenticationOptions.Issuer,
                Audience = TokenAuthenticationOptions.Audience,
                SigningCredentials = TokenAuthenticationOptions.SigningCredentials,
                Subject = identity,
                Expires = expiresOn,
                NotBefore = DateTime.Now
            });

            var token = handler.WriteToken(securityToken);
            return new TokenInfo()
            {
                CreatedOn = createdOn,
                ExpiresOn = expiresOn,
                Token = token,
                TokenType = TokenAuthenticationOptions.TokenType
            };
        }

        /// <summary>
        /// Тестовое действие - вернуть имя пользователя.
        /// </summary>
        /// <returns>Имя пользователя.</returns>
        [Route("Test")]
        [HttpGet]
        [Authorize]
        public string GetUserInfo()
        {
            var claimsIdentity = User.Identity as ClaimsIdentity;
            return claimsIdentity.Name;
        }
    }
}
