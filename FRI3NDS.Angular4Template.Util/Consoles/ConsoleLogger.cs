using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Text;

namespace FRI3NDS.Angular4Template.Util.Consoles
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
			System.Console.OutputEncoding = System.Console.OutputEncoding;
			switch (logLevel)
			{

				case LogLevel.Critical:
					System.Console.ForegroundColor = ConsoleColor.Red;
					break;
				case LogLevel.Error:
					System.Console.ForegroundColor = ConsoleColor.DarkRed;
					break;
				case LogLevel.Warning:
					System.Console.ForegroundColor = ConsoleColor.DarkGray;
					break;
				case LogLevel.Information:
					System.Console.ForegroundColor = ConsoleColor.Green;
					break;
				case LogLevel.None:
				case LogLevel.Debug:
				case LogLevel.Trace:
					System.Console.ForegroundColor = ConsoleColor.White;
					break;
			}

			System.Console.WriteLine(formatter(state, exception));
			System.Console.ResetColor();
		}
	}
}
