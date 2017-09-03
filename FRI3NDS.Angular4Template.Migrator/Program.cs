using FRI3NDS.Angular4Template.Core.Interfaces.Data;
using FRI3NDS.Angular4Template.Data.UnitOfWork;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System;
using System.Linq;
using System.Collections.Generic;
using System.IO;
using System.Reflection;
using FRI3NDS.Angular4Template.Core.Models.Domain._Admin;
using System.Text.RegularExpressions;
using FRI3NDS.Angular4Template.Util;
using System.Security.Cryptography;
using System.Text;
using FRI3NDS.Angular4Template.Migrator.Infrastructure;
using FRI3NDS.Angular4Template.Migrator.Migrator;

namespace FRI3NDS.Angular4Template.Migrator
{
	class Program
	{
		static void Main(string[] args)
		{
			IConfigurationRoot configuration = LoadConfiguration();
			IServiceProvider provider = ServiceConfiguration.CreateServiceProvider(configuration);

			IMigrator migrator = provider.GetService<IMigrator>();
			migrator.Migrate();
			Console.ReadKey();
		}

		/// <summary>
		/// Загрузить конфигурацию проекта.
		/// </summary>
		/// <returns>Конфигурация проекта.</returns>
		private static IConfigurationRoot LoadConfiguration()
		{
			string environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");

			var builder = new ConfigurationBuilder()
			   .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
			   .AddJsonFile($"appsettings.{environment}.json", optional: true)
			   .AddEnvironmentVariables();
			return builder.Build();
		}
	}
}