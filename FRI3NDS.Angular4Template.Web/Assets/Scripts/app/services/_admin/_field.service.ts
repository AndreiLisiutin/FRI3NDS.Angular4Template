import { Injectable } from '@angular/core';
import { DataAdapter } from "services/data.adapter";
import { Observable } from "rxjs/Observable";
import { _Field, _FieldBase } from "models/domain/_Field";
import { _FieldFilter } from "models/viewModels/_FieldViewModels";

@Injectable()
export class _FieldService {
    constructor(private dataAdapter: DataAdapter) { }

    private _defaultFilter: _FieldFilter = new _FieldFilter();
    query(filter: _FieldFilter = null): Observable<_Field[]> {
        return this.dataAdapter.get("/api/Admin/_Field", filter || this._defaultFilter)
            .map(response => response.json() as _Field[])
            .catch(error => {
                this.handleError(error);
                return Observable.throw(error);
            });
    }
    
    getById(id: number): Observable<_Field> {
        return this.dataAdapter.get(`/api/Admin/_Field/${id}`)
            .map(response => response.json() as _Field)
            .catch(error => {
                this.handleError(error);
                return Observable.throw(error);
            });
    }
    
    save(entity: _FieldBase): Observable<_FieldBase> {
        return this.dataAdapter.post("/api/Admin/_Field", entity)
            .map(response => response.json() as _FieldBase)
            .catch(error => {
                this.handleError(error);
                return Observable.throw(error);
            });
    }

    delete(id: number): Observable<_FieldBase> {
        return this.dataAdapter.delete(`/api/Admin/_Field/${id}`)
            .map(response => response.json() as _FieldBase)
            .catch(error => {
                this.handleError(error);
                return Observable.throw(error);
            });
    }

    private handleError(error: any) {
    }
}