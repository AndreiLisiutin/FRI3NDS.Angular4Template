using FRI3NDS.Angular4Template.Core.Interfaces.Data;
using FRI3NDS.Angular4Template.Core.Models.Domain._Admin;
using FRI3NDS.Angular4Template.Util;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;

namespace FRI3NDS.Angular4Template.Migrator.Migrator
{
	/// <summary>
	/// Мигратор.
	/// </summary>
	public class Migrator : IMigrator
	{
		private IUnitOfWorkFactory unitOfWorkFactory;
		private IConfiguration configuration;
		private ILogger logger;
		private IVersionComparer versionNumberComparer;

		/// <summary>
		/// Путь к скриптам миграций в конфиге.
		/// </summary>
		private const string _MIGRATION_MIGRATIONS_NAME = "Data:Migrations:Migrations";
		/// <summary>
		/// Путь к скриптам хранимых процедур в конфиге.
		/// </summary>
		private const string _MIGRATION_STORED_PROCEDURES_NAME = "Data:Migrations:StoredProcedures";
		/// <summary>
		/// Путь к сервисным скриптам в конфиге.
		/// </summary>
		private const string _MIGRATION_SERVICE_NAME = "Data:Migrations:Service";

		/// <summary>
		/// Мигратор.
		/// </summary>
		/// <param name="configuration">Конфигурация проекта.</param>
		/// <param name="unitOfWorkFactory">Фабрика единиц работы.</param>
		/// <param name="loggerFactory">Фабрика логеров.</param>
		/// <param name="versionNumberComparer">Компаратор версий БД.</param>
		public Migrator(IConfiguration configuration, IUnitOfWorkFactory unitOfWorkFactory, ILoggerFactory loggerFactory, IVersionComparer versionNumberComparer)
		{
			this.unitOfWorkFactory = unitOfWorkFactory;
			this.configuration = configuration;
			this.logger = loggerFactory.CreateLogger(string.Empty);
			this.versionNumberComparer = versionNumberComparer;
		}

		/// <summary>
		/// Мигрировать.
		/// </summary>
		public void Migrate()
		{
			string migrationsPrefix = this.configuration[_MIGRATION_MIGRATIONS_NAME];
			string storedProceduresPrefix = this.configuration[_MIGRATION_STORED_PROCEDURES_NAME];
			string servicesPrefix = this.configuration[_MIGRATION_SERVICE_NAME];

			using (var uow = this.unitOfWorkFactory.CreateAdmin())
			{
				uow.BeginTransaction();
				try
				{
					logger.LogInformation("Миграция сервисных функций...");
					RunScripts(servicesPrefix, uow);

					logger.LogInformation("Миграция миграций...");
					RunMigrationScripts(migrationsPrefix, uow);

					logger.LogInformation("Миграция хранимых процедур...");
					RunScripts(storedProceduresPrefix, uow);

					uow.CommitTransaction();
					logger.LogInformation("Миграция успешна.");
				}
				catch (OperationCanceledException ex)
				{
					logger.LogInformation(ex.Message);
					uow.RollbackTransaction();
				}
				catch (Exception ex)
				{
					logger.LogError(ex.ToString());
					uow.RollbackTransaction();
				}
			}
		}

		/// <summary>
		/// Просто выполнить скрипты, найденные по префиксу.
		/// </summary>
		/// <param name="scriptsPrefix">Префикс скрипта.</param>
		/// <param name="unitOfWork">Единица работы.</param>
		private void RunScripts(string scriptsPrefix, IAdminUnitOfWork unitOfWork)
		{
			Dictionary<string, string> scripts = FindScripts(scriptsPrefix);

			foreach (var scriptName in scripts.Keys.OrderBy(e => e))
			{
				var scriptBody = scripts[scriptName];
				logger.LogDebug($"{scriptName} выполняется...");

				unitOfWork._DynamicRepository.Sql(scriptBody);
			}
		}

		/// <summary>
		/// Выполнить мигрционные скрипты.
		/// </summary>
		/// <param name="scriptsPrefix">Префикс скрипта.</param>
		/// <param name="unitOfWork">Единица работы.</param>
		private void RunMigrationScripts(string scriptsPrefix, IAdminUnitOfWork unitOfWork)
		{
			List<_Version> versions = unitOfWork._VersionRepository.Query(pageSize: int.MaxValue);

			List<_Version> migrations = FindMigrations(scriptsPrefix);

			bool isWarningExists = false;
			List<_Version> versionsToDelete = new List<_Version>();
			List<_Version> versionsToUpdate = new List<_Version>();
			foreach (var version in versions)
			{
				var migration = migrations.FirstOrDefault(e => this.versionNumberComparer.Compare(e, version) == 0);
				if (migration == null)
				{
					logger.LogError($"Выполненная миграция #{version.Name} не найдена в коде.");
					var migrationRenamed = migrations.FirstOrDefault(e => this.versionNumberComparer.Compare(e, version) != 0 && e.ScriptHash == version.ScriptHash);
					if (migrationRenamed != null)
					{
						//выполненная миграция с таким же хэшем, но другим именем. Типа выполенную миграцию переименовали. Обновить хэш версии.
						logger.LogError($"Выполненная миграция #{migrationRenamed.Name} была переименована. Ее хэш выполнен под номером {version.Name}.");
						version.Name = migrationRenamed.Name;
						versionsToUpdate.Add(version);
					}
					else
					{
						//просто не найденная миграция в коде. Удалить миграцию.
						versionsToDelete.Add(version);
					}
					isWarningExists = true;
					continue;
				}

				migration.Id = version.Id;
				if (migration.ScriptHash != version.ScriptHash)
				{
					//версия найдена в коде, но текст ее изменен. Обновить хэш версии.
					logger.LogError($"Выполненная миграция #{version.Name} изменена в коде. Изменен ее хэш.");
					version.ScriptHash = migration.ScriptHash;
					versionsToUpdate.Add(version);
					isWarningExists = true;
				}
			}

			var currentversion = versions.OrderBy(e => e, this.versionNumberComparer).LastOrDefault();
			var lastMigration = migrations.OrderBy(e => e, this.versionNumberComparer).LastOrDefault();
			if (this.versionNumberComparer.Compare(currentversion, lastMigration) != 0)
			{
				logger.LogInformation($"Текущая версия базы данных {currentversion?.Name ?? "--"}. Будет изменена до {lastMigration?.Name ?? "--"}.");
			}
			else
			{
				logger.LogInformation($"Текущая версия базы данных {currentversion?.Name ?? "--"}. Изменений не найдено.");
			}
			if (isWarningExists)
			{
				logger.LogCritical($"Обнаружены предупреждения. Нажмите Y для продолжения или любую клавишу для отмены.");
				if ((Console.ReadLine() ?? "").Trim().ToLower() != "y")
				{
					throw new OperationCanceledException("Миграция отменена.");
				}
			}

			//мигрировать на новую версию.
			foreach (var migration in migrations.OrderBy(e => e, this.versionNumberComparer))
			{
				var version = versions.FirstOrDefault(e => e.Name == migration.Name);
				if (version != null || this.versionNumberComparer.Compare(migration, currentversion) <= 0)
				{
					continue;
				}
				logger.LogDebug($"{migration.Description} выполняется...");
				unitOfWork._DynamicRepository.Sql(migration.ScriptBody);
				unitOfWork._VersionRepository.Save(migration);
			}

			//обновить записи с ошибками.
			foreach (var version in versionsToDelete)
			{
				unitOfWork._VersionRepository.Delete(version.Id);
			}
			foreach (var version in versionsToUpdate)
			{
				unitOfWork._VersionRepository.Save(version);
			}
		}

		/// <summary>
		/// Получить версию скрипта из названия скрипта.
		/// </summary>
		/// <param name="scriptBody">Название скрипта.</param>
		/// <returns>Версия скрипта.</returns>
		private int[] GetVersionFromScriptName(string scriptName)
		{
			scriptName = scriptName.Trim();
			Regex versionedScriptNameRegex = new Regex(@"^([\d,_]+)_.*$"); //1_0_453_Migration name.sql
			bool isScriptVersioned = versionedScriptNameRegex.IsMatch(scriptName);
			if (!isScriptVersioned)
			{
				return null;
			}
			var versionMatches = versionedScriptNameRegex.Matches(scriptName);
			if (versionMatches.Count != 1)
			{
				return null;
			}
			var matchGroups = versionMatches[0].Groups;
			if (matchGroups.Count != 2)
			{
				return null;
			}
			string matchValue = matchGroups[1].Value ?? "";
			int[] result = versionNumberComparer.ParseVersionNumber(matchValue, '_');
			return result;
		}

		/// <summary>
		/// Получить версию скрипта из тела скрипта.
		/// </summary>
		/// <param name="scriptBody">Тело скрипта.</param>
		/// <returns>Версия скрипта.</returns>
		private int[] GetVersionFromScriptBody(string scriptBody)
		{
			Regex versionedScriptLineRegex = new Regex(@"^--\s*version\s*=\s*([\d,\.]+)$", RegexOptions.IgnoreCase); //--version = 1.0.453
			var versionLine = scriptBody
				.Split(new string[] { "\r\n", "\n" }, StringSplitOptions.None)
				.Where(e => versionedScriptLineRegex.IsMatch(e.Trim()))
				.SingleOrDefault();

			if (versionLine == null)
			{
				return null;
			}
			var versionMatches = versionedScriptLineRegex.Matches(versionLine.Trim());
			if (versionMatches.Count != 1)
			{
				return null;
			}
			var matchGroups = versionMatches[0].Groups;
			if (matchGroups.Count != 2)
			{
				return null;
			}
			string matchValue = matchGroups[1].Value ?? "";

			int[] result = versionNumberComparer.ParseVersionNumber(matchValue, '.');
			return result;
		}

		/// <summary>
		/// Найти миграции.
		/// </summary>
		/// <param name="scriptsPrefix">префикс скриптов миграции.</param>
		/// <returns>Список миграций.</returns>
		private List<_Version> FindMigrations(string scriptsPrefix)
		{
			Dictionary<string, string> scripts = FindScripts(scriptsPrefix);
			List<_Version> migrations = new List<_Version>();
			foreach (var scriptName in scripts.Keys)
			{
				var scriptBody = scripts[scriptName];
				string scriptHash = CreateMD5(scriptBody);
				var versionFromName = GetVersionFromScriptName(scriptName);
				var versionFromBody = GetVersionFromScriptBody(scriptBody);
				if ((versionFromName ?? versionFromBody) == null)
				{
					logger.LogError($"Не задана версия базы данных для скрипта {scriptName}. Задается либо в названии файла типа 1_0_453_Migration name.sql, " +
					$"либо комментарием внутри скрипта типа --version = 1.0.453.");
				}

				_Version mig = new _Version()
				{
					Id = 0,
					Name = versionNumberComparer.SerializeVersionNumber(versionFromName ?? versionFromBody, '.'),
					ScriptBody = scriptBody,
					ScriptHash = scriptHash,
					Description = scriptName,
					AppliedOn = DateTime.Now
				};
				migrations.Add(mig);
			}
			return migrations;
		}

		/// <summary>
		/// Найти скрипты в сборках, на которые ссылается мигратор, по префиксу.
		/// </summary>
		/// <param name="scriptsPrefix"></param>
		/// <returns></returns>
		private Dictionary<string, string> FindScripts(string scriptsPrefix)
		{
			Dictionary<string, string> scripts = new Dictionary<string, string>();

			foreach (var assemblyName in Assembly.GetEntryAssembly().GetReferencedAssemblies())
			{
				Assembly assembly = Assembly.Load(assemblyName);
				List<string> scriptNames = assembly.GetManifestResourceNames().Where(e => e.StartsWith(scriptsPrefix)).ToList();

				foreach (var name in scriptNames)
				{
					var nameSplitted = name.Split('.');
					var scriptName = nameSplitted[nameSplitted.Length - 2];

					using (Stream stream = assembly.GetManifestResourceStream(name))
					using (StreamReader reader = new StreamReader(stream))
					{
						var scriptBody = reader.ReadToEnd();
						scripts[scriptName] = scriptBody;
					}
				}
			}
			return scripts;
		}

		/// <summary>
		/// Посчитать MD5 скрипта.
		/// </summary>
		/// <param name="input">Скрипт.</param>
		/// <returns>MD5 скрипта.</returns>
		private string CreateMD5(string input)
		{
			using (MD5 md5 = MD5.Create())
			{
				byte[] inputBytes = Encoding.ASCII.GetBytes(input);
				byte[] hashBytes = md5.ComputeHash(inputBytes);

				StringBuilder sb = new StringBuilder();
				for (int i = 0; i < hashBytes.Length; i++)
				{
					sb.Append(hashBytes[i].ToString("X2"));
				}
				return sb.ToString();
			}
		}
	}
}
