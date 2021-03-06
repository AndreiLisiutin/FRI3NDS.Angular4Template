﻿using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Threading.Tasks;

namespace FRI3NDS.Angular4Template.Web.Models
{
    /// <summary>
	/// Опции аутентификации по токену.
	/// </summary>
    public class TokenAuthenticationOptions
    {
        public static string Audience { get; } = "ExampleAudience";
        public static string Issuer { get; } = "ExampleIssuer";
        public static RsaSecurityKey Key { get; } = new RsaSecurityKey(GenerateKey());
        public static SigningCredentials SigningCredentials { get; } = new SigningCredentials(Key, SecurityAlgorithms.RsaSha256Signature);

        public static TimeSpan ExpiresSpan { get; } = TimeSpan.FromMinutes(1);
        public static string TokenType { get; } = "Bearer";

        /// <summary>
        /// Заголовок, в который пишется XSRF токен при запросе на сервер.
        /// </summary>
        public static string AntiforgeryHeaderName { get; } = "X_XSRF_TOKEN";

        public static RSAParameters GenerateKey()
        {
            using (var key = new RSACryptoServiceProvider(2048))
            {
                return key.ExportParameters(true);
            }
        }
    }
}
