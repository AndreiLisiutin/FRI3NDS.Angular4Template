﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using FRI3NDS.Angular4Template.Web.Infrastructure;
using NLog.Extensions.Logging;
using NLog.Web;
using Microsoft.IdentityModel.Tokens;
using FRI3NDS.Angular4Template.Web.Models;
using Microsoft.AspNetCore.Antiforgery;

namespace FRI3NDS.Angular4Template.Web
{
    public class Startup
    {
        public Startup(IHostingEnvironment env)
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
                .AddEnvironmentVariables();
            Configuration = builder.Build();
        }

        public IConfigurationRoot Configuration { get; }

        /// <summary>
        /// Регистрация сервисов.
        /// </summary>
        /// <param name="services">Сервисы.</param>
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>(); //для NLog Web
            services.AddAuthorization(auth =>
            {
                auth.AddPolicy("Bearer", new AuthorizationPolicyBuilder()
                    .AddAuthenticationSchemes(JwtBearerDefaults.AuthenticationScheme)
                    .RequireAuthenticatedUser()
                    .Build());
            });


            services.AddAntiforgery(options => { options.HeaderName = "X_XSRF_TOKEN"; });
            services.AddMvc();
            ServiceConfiguration.ConfigureServices(services, this.Configuration);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory, IAntiforgery antiforgery)
        {
            loggerFactory.AddConsole(Configuration.GetSection("Logging"));
            loggerFactory.AddDebug();

            loggerFactory.AddNLog();
            app.AddNLogWeb();
            env.ConfigureNLog("NLog.config");

            //if (env.IsDevelopment())
            //{
            //    app.UseDeveloperExceptionPage();
            //    app.UseBrowserLink();
            //}
            //else
            //{
            //    app.UseExceptionHandler("/Home/Error");
            //}

            app.UseDefaultFiles();
            app.UseStaticFiles();
            
            app.UseMiddleware<ExceptionHandlingMiddleware>();

            #region UseJwtBearerAuthentication
            app.UseJwtBearerAuthentication(new JwtBearerOptions()
            {
                AutomaticAuthenticate = true,
                AutomaticChallenge = true,
                TokenValidationParameters = new TokenValidationParameters()
                {
                    IssuerSigningKey = TokenAuthenticationOptions.Key,
                    ValidAudience = TokenAuthenticationOptions.Audience,
                    ValidIssuer = TokenAuthenticationOptions.Issuer,
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateIssuerSigningKey = true,
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.FromMinutes(0)
                }
            });
            #endregion

            app.Use(next => context =>
            {
                string path = context.Request.Path.Value;
                if (path == "/")
                {
                    var token = antiforgery.GetAndStoreTokens(context).RequestToken;
                    context.Response.Cookies.Append("X_XSRF_TOKEN", token, new CookieOptions { HttpOnly = false/*, Secure = true */});
                }
                return next(context);
            });

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");
            });
        }
    }

    public class CookiesHandlingMiddleware
    {
        private RequestDelegate _next;
        private IAntiforgery _antiforgery;
        public CookiesHandlingMiddleware(RequestDelegate next, IAntiforgery antiforgery)
        {
            _next = next;
            _antiforgery = antiforgery;
        }
        public async Task Invoke(HttpContext context)
        {
            await _next.Invoke(context);
            string path = context.Request.Path.Value;
            if (path == "/" || path == "/api/Authentication/Login")
            {
                var token = _antiforgery.GetAndStoreTokens(context).RequestToken;
                context.Response.Cookies.Append("X_XSRF_TOKEN", token, new CookieOptions { HttpOnly = false/*, Secure = true */});
            }
        }
    }
}
