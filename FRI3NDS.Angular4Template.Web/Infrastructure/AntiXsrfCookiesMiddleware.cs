using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace FRI3NDS.Angular4Template.Web.Infrastructure
{
    /// <summary>
    /// Обработчик потока выполнения ASP.
    /// </summary>
    public class AntiXsrfCookiesMiddleware
    {
        /// <summary>
        /// Следующее действие в потоке выполнения.
        /// </summary>
        private RequestDelegate _next;

        /// <summary>
        /// Сервис работы с XSRF-атаками.
        /// </summary>
        private IAntiforgery _antiforgery;

        /// <summary>
        /// Контроллер обработчик потока выполнения ASP.
        /// </summary>
        /// <param name="next">Следующее действие в потоке выполнения.</param>
        /// <param name="antiforgery">Сервис работы с XSRF-атаками.</param>
        public AntiXsrfCookiesMiddleware(RequestDelegate next, IAntiforgery antiforgery)
        {
            _next = next;
            _antiforgery = antiforgery;
        }

        /// <summary>
        /// Действия по обработке запроса ASP.NET.
        /// </summary>
        /// <param name="context">Контекст запроса ASP.NET.</param>
        /// <returns>Задача на обработку запроса ASP.NET.</returns>
        public async Task Invoke(HttpContext context)
        {
            string path = context.Request.Path.Value;
            if (path == "/" || path == "/api/Authentication/Login")
            {
                context.Response.OnStarting((state) =>
                {
                    if (context.Response.StatusCode == (int)HttpStatusCode.OK)
                    {
                        var token = _antiforgery.GetAndStoreTokens(context).RequestToken;
                        context.Response.Cookies.Append("X_XSRF_TOKEN", token, new CookieOptions { HttpOnly = false/*, Secure = true */});
                    }
                    return Task.FromResult(0);
                }, null);
            }
            await _next.Invoke(context);
        }
    }
}
