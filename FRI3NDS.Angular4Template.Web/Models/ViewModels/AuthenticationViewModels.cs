﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FRI3NDS.Angular4Template.Web.Models.ViewModels
{
    /// <summary>
    /// Инфа про токен доступа.
    /// </summary>
    public class TokenInfo
    {
        /// <summary>
        /// Текст токена.
        /// </summary>
        public string Token { get; set; }

        /// <summary>
        /// Токен для обновления токена.
        /// </summary>
        public string RefreshToken { get; set; }

        /// <summary>
        /// Время создания токена.
        /// </summary>
        public DateTime CreatedOn { get; set; }

        /// <summary>
        /// Время деактивации токена.
        /// </summary>
        public DateTime ExpiresOn { get; set; }

        /// <summary>
        /// Тип токена.
        /// </summary>
        public string TokenType { get; set; }
    }

    /// <summary>
    /// Модель для аутентификации и регистрации пользователя.
    /// </summary>
    public class UserLoginModel
    {
        /// <summary>
        /// Тип запроса токена - "password" - аутентификация, "refresh_token" - обновление токена.
        /// </summary>
        public string GrantType { get; set; }

        /// <summary>
        /// Логин.
        /// </summary>
        public string Login { get; set; }

        /// <summary>
        /// Пароль.
        /// </summary>
        public string Password { get; set; }

        /// <summary>
        /// Мыло.
        /// </summary>
        public string Email { get; set; }
    }
}
