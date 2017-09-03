using FRI3NDS.Angular4Template.Core.Models.Domain._Admin;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace FRI3NDS.Angular4Template.Migrator.Migrator
{
	/// <summary>
	/// Компаратор версий БД.
	/// </summary>
	public class VersionNumberComparer : IVersionComparer
	{
		public int Compare(_Version x, _Version y)
		{
			return CompareMigrationNumbers(x?.Name, y?.Name);
		}

		/// <summary>
		/// Запарсить номер версии БД.
		/// </summary>
		/// <param name="version">Номер версии в формате ##.##.####.</param>
		/// <param name="separator">Разделитель чисел.</param>
		/// <returns>Массив чисел.</returns>
		public int[] ParseVersionNumber(string version, char separator = '.')
		{
			return (version ?? "")
				.Trim(separator)
				.Split(separator)
				.Select(e =>
				{
					if (Int32.TryParse(e, out int i))
					{
						return i;
					}
					return 0;
				}).ToArray();
		}

		/// <summary>
		/// Сериализовать номер версии.
		/// </summary>
		/// <param name="version">Номер версии в массиве.</param>
		/// <param name="separator">Разделитель чисел.</param>
		/// <returns>Номер версии для текста.</returns>
		public string SerializeVersionNumber(int[] version, char separator = '.')
		{
			return string.Join(separator.ToString(), version);
		}

		/// <summary>
		/// Сравнить номера версий в формате #.##.###
		/// </summary>
		/// <param name="first">Первый номер.</param>
		/// <param name="second">Второй номер.</param>
		/// <returns>
		/// Если first > second, положительное число; 
		/// Если second > first, отрицательное число; 
		/// Иначе 0.
		/// </returns>
		private int CompareMigrationNumbers(string first, string second)
		{
			if (first == null && second == null)
			{
				return 0;
			}
			if (first == null)
			{
				return -1;
			}
			if (second == null)
			{
				return 1;
			}

			int[] firstNumbers = ParseVersionNumber(first, '.');
			int[] secondNumbers = ParseVersionNumber(second, '.');

			for (int i = 0; i < firstNumbers.Length; i++)
			{
				if (secondNumbers.Length == i)
				{
					//first > second
					return 1;
				}
				int firstNumber = firstNumbers[i];
				int secondNumber = secondNumbers[i];

				if (firstNumber != secondNumber)
				{
					return firstNumber - secondNumber;
				}
			}
			if (firstNumbers.Length < secondNumbers.Length)
			{
				//first < second
				return -1;
			}
			return 0;
		}
	}
}
