using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Text;

namespace FRI3NDS.Angular4Template.Migrator.Infrastructure
{
	/// <summary>
	/// Логер.
	/// </summary>
	public class ConsoleLogger : ILogger
	{
		public IDisposable BeginScope<TState>(TState state)
		{
			return null;
		}

		public bool IsEnabled(LogLevel logLevel)
		{
			return true;
		}

		/// <summary>
		/// Залогировать.
		/// </summary>
		/// <typeparam name="TState"></typeparam>
		/// <param name="logLevel"></param>
		/// <param name="eventId"></param>
		/// <param name="state"></param>
		/// <param name="exception"></param>
		/// <param name="formatter"></param>
		public void Log<TState>(LogLevel logLevel, EventId eventId, TState state, Exception exception, Func<TState, Exception, string> formatter)
		{
			Console.OutputEncoding = Console.OutputEncoding;
			switch (logLevel)
			{

				case LogLevel.Critical:
					Console.ForegroundColor = ConsoleColor.Red;
					break;
				case LogLevel.Error:
					Console.ForegroundColor = ConsoleColor.DarkRed;
					break;
				case LogLevel.Warning:
					Console.ForegroundColor = ConsoleColor.DarkGray;
					break;
				case LogLevel.Information:
					Console.ForegroundColor = ConsoleColor.Green;
					break;
				case LogLevel.None:
				case LogLevel.Debug:
				case LogLevel.Trace:
					Console.ForegroundColor = ConsoleColor.White;
					break;
			}

			Console.WriteLine(formatter(state, exception));
			Console.ForegroundColor = ConsoleColor.White;
		}
	}

	/// <summary>
	/// Провайдер для логера.
	/// </summary>
	public class ConsoleLoggerProvider : ILoggerProvider
	{
		/// <summary>
		/// Создать логер.
		/// </summary>
		/// <param name="categoryName"></param>
		/// <returns></returns>
		public ILogger CreateLogger(string categoryName)
		{
			return new ConsoleLogger();
		}

		public void Dispose()
		{
		}
	}
}
