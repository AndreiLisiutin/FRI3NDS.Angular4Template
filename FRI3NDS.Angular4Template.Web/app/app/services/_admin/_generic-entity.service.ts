﻿import { Injectable } from '@angular/core';
import { DataAdapter } from "app/services/data.adapter";
import { Observable } from "rxjs/Observable";
import { _Entity, _EntityBase } from "app/models/domain/_Entity";
import { _GenericEntity } from "app/models/business/_GenericEntity";
import { _GenericEntityFilter } from "app/models/viewModels/_GenericEntityViewModels";

@Injectable()
export class _GenericEntityService {
	constructor(private dataAdapter: DataAdapter) { }

	getEntitiesList(filter: _GenericEntityFilter): Observable<_GenericEntity[]> {
		return this.dataAdapter.get(`/api/Admin/_GenericEntity/GetEntitiesList`, filter)
			.map(response => response.json() as _GenericEntity[])
			.catch(error => {
				this.handleError(error);
				return Observable.throw(error);
			});
	}

	getEntitiesCount(filter: _GenericEntityFilter): Observable<number> {
		return this.dataAdapter.get(`/api/Admin/_GenericEntity/GetEntitiesCount`, filter)
			.map(response => response.json() as number)
			.catch(error => {
				this.handleError(error);
				return Observable.throw(error);
			});
	}

	getEntitiyInstance(entityId: number, entityInstanceId: number): Observable<_GenericEntity> {
		return this.dataAdapter.get(`/api/Admin/_GenericEntity/GetEntityById/${entityId}/${entityInstanceId}`)
			.map(response => response.json() as _GenericEntity)
			.catch(error => {
				this.handleError(error);
				return Observable.throw(error);
			});
	}

	saveEntitiyInstance(entity: _GenericEntity): Observable<number> {
		return this.dataAdapter.post(`/api/Admin/_GenericEntity/SaveEntity`, entity)
			.map(response => response.json() as number)
			.catch(error => {
				this.handleError(error);
				return Observable.throw(error);
			});
	}

	private handleError(error: any) {
	}
}