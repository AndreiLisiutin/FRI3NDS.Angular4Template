using FRI3NDS.Angular4Template.Core.Interfaces.Services.Data;
using FRI3NDS.Angular4Template.Core.Models.Domain;
using FRI3NDS.Angular4Template.Util;
using FRI3NDS.Angular4Template.Web.Infrastructure;
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

        /// <summary>
        /// Хранилище токенов для обновления токенов.
        /// </summary>
        public ITokensStorage TokensStorage { get; set; }

		/// <summary>
		/// Конструктор контроллера для работы с аутентификацией и учетными записями пользователей.
		/// </summary>
		/// <param name="authenticationDataService">Сервис аутентификации и работы с учетными записями пользователей.</param>
		/// <param name="tokensStorage">Хранилище токенов для обновления токенов.</param>
		public AuthenticationController(IAuthenticationDataService authenticationDataService, ITokensStorage tokensStorage)
		{
			this.AuthenticationDataService = authenticationDataService;
			this.TokensStorage = tokensStorage;
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
			this.TokensStorage.Store(existUser.Id, token.RefreshToken);
			return token;
		}

        /// <summary>
        /// Обновление токена доступа.
        /// </summary>
        /// <param name="refreshTokenRequest">Данные о токене обновления токенов.</param>
        /// <returns>Информация о новом токене доступа.</returns>
        [Route("RefreshToken")]
		[HttpPost]
		public TokenInfo RefreshToken([FromBody]RefreshTokenModel refreshTokenRequest)
		{
			Argument.Require(refreshTokenRequest?.RefreshToken != null, "Некорректный запрос, пустой токен обновления токенов.");
            var splittedData = refreshTokenRequest.RefreshToken.Split('.');
            Argument.Require(splittedData.Length == 2, "Некорректный формат токена для обновления токенов.");
            Argument.Require(Int32.TryParse(splittedData[1], out int userId), "Некорректный формат идентификатора пользователя в токене для обновления токенов.");
            var tokenId = splittedData[0];
			Argument.Require(this.TokensStorage.Get(userId) == refreshTokenRequest.RefreshToken, "Некорректный токен обновления токенов.");

			UserBase existUser = this.AuthenticationDataService.GetUserById(userId);
            Argument.Require(existUser != null, "Не найден пользователь-владелец токена.");
            TokenInfo token = this._GenerateToken(existUser);
			this.TokensStorage.Store(existUser.Id, token.RefreshToken);
			return token;
		}

		/// <summary>
		/// Выход из приложение, очистка токена.
		/// </summary>
		/// <returns>Ничего интересного.</returns>
		[Route("Logout")]
		[HttpPost]
		public StatusCodeResult ClearAuthToken()
		{
			//необходимо для обновления Anti-XSRF-cookie в классе AntiXsrfCookiesMiddleware
			HttpContext.User = new ClaimsPrincipal(new ClaimsIdentity());
			return Ok();
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
			this.TokensStorage.Store(existUser.Id, token.RefreshToken);
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
				IssuedAt = createdOn,
				NotBefore = DateTime.Now
			});

			//необходимо для обновления Anti-XSRF-cookie в классе AntiXsrfCookiesMiddleware
			HttpContext.User = new ClaimsPrincipal(identity);

			var token = handler.WriteToken(securityToken);
			var refreshToken = $"{Guid.NewGuid()}.{user.Id}";
			return new TokenInfo()
			{
				CreatedOn = createdOn,
				ExpiresOn = expiresOn,
				Token = token,
				RefreshToken = refreshToken,
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
