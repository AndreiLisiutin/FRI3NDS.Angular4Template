import { Injectable } from '@angular/core';
import { DataAdapter } from "services/data.adapter";
import { Observable } from "rxjs/Observable";
import { _Entity, _EntityBase } from "models/domain/_Entity";
import { _GenericEntity } from "models/business/_GenericEntity";
import { _GenericEntityFilter } from "models/viewModels/_GenericEntityViewModels";

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

	private handleError(error: any) {
	}
}