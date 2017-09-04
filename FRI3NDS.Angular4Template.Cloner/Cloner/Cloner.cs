using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;

namespace FRI3NDS.Angular4Template.Cloner.Cloner
{
	/// <summary>
	/// Утилитка для клонирования решений.
	/// </summary>
	public class Cloner : ICloner
	{
		private IConfiguration configuration;
		private ILogger logger;
		private Dictionary<string, string> renamePairs;

		/// <summary>
		/// Строки для замены при клонировании в конфиге.
		/// </summary>
		private const string _REPLACE_VALUES_NAME = "Data:ReplaceValues";
		/// <summary>
		/// Путь к папке с исходниками в конфиге.
		/// </summary>
		private const string _SOURCE_DIRECTORY_NAME = "Data:SourceDirectory";
		/// <summary>
		/// Путь к папке-результату в конфиге.
		/// </summary>
		private const string _DESTINATION_DIRECTORY_NAME = "Data:DestinationDirectory";

		/// <summary>
		/// Утилитка для клонирования решений.
		/// </summary>
		/// <param name="configuration">Конфигурация проекта.</param>
		/// <param name="loggerFactory">Фабрика логгеров.</param>
		public Cloner(IConfiguration configuration, ILoggerFactory loggerFactory)
		{
			this.configuration = configuration;
			this.logger = loggerFactory.CreateLogger(string.Empty);
		}

		/// <summary>
		/// Клонировать решение.
		/// </summary>
		public void CloneSolution()
		{
			string src = this.configuration[_SOURCE_DIRECTORY_NAME];
			string dest = this.configuration[_DESTINATION_DIRECTORY_NAME];
			renamePairs = this.configuration.GetSection("Data:ReplaceValues").GetChildren()
				.Select(item => new KeyValuePair<string, string>(item.Key, item.Value))
				.ToDictionary(x => x.Key, x => x.Value);

			try
			{
				logger.LogInformation($"Клонирование проекта из {src} в {dest}.");
				CloneDirectoryRecursively(src, dest);
				logger.LogInformation("Клонирование проекта успешно.");
			}
			catch (Exception ex)
			{
				logger.LogError(ex.ToString());
			}
		}

		/// <summary>
		/// Клонировать рекурсивно папку решения.
		/// </summary>
		/// <param name="src"></param>
		/// <param name="dest"></param>
		private void CloneDirectoryRecursively(string src, string dest)
		{
			DirectoryInfo souecrDirectory = new DirectoryInfo(src);
			DirectoryInfo destDirectory = new DirectoryInfo(dest);
			if (!destDirectory.Exists)
			{
				destDirectory.Create();
			}
			foreach (FileInfo sourceFile in souecrDirectory.GetFiles())
			{
				var newName = Rename(sourceFile.Name);
				string text = Rename(File.ReadAllText(sourceFile.FullName));
				File.WriteAllText(Path.Combine(dest, newName), text);
			}

			foreach (DirectoryInfo subDirectory in souecrDirectory.GetDirectories())
			{
				var subDirectoryName = Rename(subDirectory.Name);
				string destPath = Path.Combine(dest, subDirectoryName);
				Directory.CreateDirectory(destPath);
				CloneDirectoryRecursively(subDirectory.FullName, destPath);
			}
		}

		/// <summary>
		/// Заменить все вхождения старых имен на новые.
		/// </summary>
		/// <param name="src"></param>
		/// <returns></returns>
		private string Rename(string src)
		{
			foreach (var key in renamePairs.Keys)
			{
				src = src?.Replace(key, renamePairs[key]);
			}
			return src;
		}
	}
}
