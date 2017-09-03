﻿using Dapper;
using Dapper.Contrib.Extensions;
using FRI3NDS.Angular4Template.Data.UnitOfWork;
using Npgsql;
using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;
using System.Text;

namespace FRI3NDS.Angular4Template.Data.Repositories
{
	/// <summary>
	/// Базовый репозиторий.
	/// </summary>
	/// <typeparam name="TBase">Базовая модель сущности.</typeparam>
	public class RepositoryBase<TBase> : UnsafeRepositoryBase
		where TBase : class
	{
		/// <summary>
		/// Конструктор репозитория.
		/// </summary>
		/// <param name="dataContext">Контекст данных (подключение к базе и транзакция).</param>
		public RepositoryBase(DataContext dataContext)
			: base(dataContext)
		{
		}

		/// <summary>
		/// Вставить новый экземпляр сущности.
		/// </summary>
		/// <param name="item">Модель нового экземпляра сущности.</param>
		/// <returns>Идентификатор нового экземпляра сущности.</returns>
		public virtual int Insert(TBase item)
		{
			return (int)_dataContext.Connection.Insert<TBase>(item, this._dataContext.Transaction);
		}

		/// <summary>
		/// Обновить существующий экземпляр сущности.
		/// </summary>
		/// <param name="item">Модель экземпляра сущности.</param>
		public virtual void Update(TBase item)
		{
			_dataContext.Connection.Update<TBase>(item, this._dataContext.Transaction);
		}

		/// <summary>
		/// Удалить существующий экземпляр сущности.
		/// </summary>
		/// <param name="item">Модель экземпляра сущности.</param>
		public virtual void Delete(TBase item)
		{
			_dataContext.Connection.Delete<TBase>(item, this._dataContext.Transaction);
		}

		/// <summary>
		/// Получить список всех экземпляров сущности.
		/// </summary>
		/// <returns>Список всех экземпляров сущности.</returns>
		public virtual List<TBase> GetAllBase()
		{
			return _dataContext.Connection.GetAll<TBase>().ToList();
		}

		/// <summary>
		/// Получить экземпляр сущности по его идентификатору.
		/// </summary>
		/// <param name="id">Идентификатор экземпляра сущности.</param>
		/// <returns>Найденный экземпляр сущности.</returns>
		public virtual TBase GetByIDBase(int id)
		{
			return _dataContext.Connection.Get<TBase>(id);
		}
	}

	/// <summary>
	/// Еще более базовый репозиторий. Но небезопасный.
	/// </summary>
	public class UnsafeRepositoryBase
	{
		/// <summary>
		/// Контекст подключения к базе данных.
		/// </summary>
		protected DataContext _dataContext;

		/// <summary>
		/// Конструктор репозитория.
		/// </summary>
		/// <param name="dataContext">Контекст данных (подключение к базе и транзакция).</param>
		public UnsafeRepositoryBase(DataContext dataContext)
		{
			this._dataContext = dataContext;
		}

		/// <summary>
		/// Сделать что-то страшное. Не использовать, не понимая, зачем это.
		/// </summary>
		/// <param name="query">Страшное.</param>
		/// <param name="parameters">Параметры страшного.</param>
		/// <returns>Зло.</returns>
		protected List<IDictionary<string, object>> _ExecuteQuery(string query, object parameters = null)
		{
			return _dataContext.Connection.Query(query, parameters, _dataContext.Transaction)
				.Select(e => (IDictionary<string, object>)e)
				.ToList();
		}
	}
}
