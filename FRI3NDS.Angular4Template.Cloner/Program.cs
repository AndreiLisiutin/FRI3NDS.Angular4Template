using FRI3NDS.Angular4Template.Cloner.Cloner;
using FRI3NDS.Angular4Template.Cloner.Infrastructure;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;

namespace FRI3NDS.Angular4Template.Cloner
{
	class Program
	{
		static void Main(string[] args)
		{
			IConfigurationRoot configuration = LoadConfiguration();
			IServiceProvider provider = ServiceConfiguration.CreateServiceProvider(configuration);

			ICloner cloner = provider.GetService<ICloner>();
			cloner.CloneSolution();
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