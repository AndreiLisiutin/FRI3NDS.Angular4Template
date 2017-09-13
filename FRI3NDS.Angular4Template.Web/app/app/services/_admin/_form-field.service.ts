import { Injectable } from '@angular/core';
import { DataAdapter } from "app/services/data.adapter";
import { Observable } from "rxjs/Observable";
import { _FormField, _FormFieldBase } from "app/models/domain/_FormField";
import { _FormFieldFilter } from "app/models/viewModels/_FormFieldViewModels";

@Injectable()
export class _FormFieldService {
    constructor(private dataAdapter: DataAdapter) { }
    
    query(filter: _FormFieldFilter): Observable<_FormField[]> {
        return this.dataAdapter.get("/api/Admin/_FormField", filter || new _FormFieldFilter())
            .map(response => response.json() as _FormField[])
            .catch(error => {
                this.handleError(error);
                return Observable.throw(error);
            });
    }
    
    getById(id: number): Observable<_FormField> {
        return this.dataAdapter.get(`/api/Admin/_FormField/${id}`)
            .map(response => response.json() as _FormField)
            .catch(error => {
                this.handleError(error);
                return Observable.throw(error);
            });
    }
    
    save(entity: _FormFieldBase): Observable<_FormFieldBase> {
        return this.dataAdapter.post("/api/Admin/_FormField", entity)
            .map(response => response.json() as _FormFieldBase)
            .catch(error => {
                this.handleError(error);
                return Observable.throw(error);
            });
    }

    delete(id: number): Observable<number> {
        return this.dataAdapter.delete(`/api/Admin/_FormField/${id}`)
            .map(response => response.json() as number)
            .catch(error => {
                this.handleError(error);
                return Observable.throw(error);
            });
    }

    private handleError(error: any) {
    }
}