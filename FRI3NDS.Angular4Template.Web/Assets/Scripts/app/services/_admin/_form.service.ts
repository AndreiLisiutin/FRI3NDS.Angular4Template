import { Injectable } from '@angular/core';
import { DataAdapter } from "services/data.adapter";
import { Observable } from "rxjs/Observable";
import { _Form, _FormBase } from "models/domain/_Form";

@Injectable()
export class _FormService {
    constructor(private dataAdapter: DataAdapter) { }
    
    query(): Observable<_Form[]> {
        return this.dataAdapter.get("/api/Admin/_Form")
            .map(response => response.json() as _Form[])
            .catch(error => {
                this.handleError(error);
                return Observable.throw(error);
            });
    }
    
    getById(id: number): Observable<_Form> {
        return this.dataAdapter.get(`/api/Admin/_Form/${id}`)
            .map(response => response.json() as _Form)
            .catch(error => {
                this.handleError(error);
                return Observable.throw(error);
            });
    }
    
    save(entity: _FormBase): Observable<_FormBase> {
        return this.dataAdapter.post("/api/Admin/_Form", entity)
            .map(response => response.json() as _FormBase)
            .catch(error => {
                this.handleError(error);
                return Observable.throw(error);
            });
    }

    delete(id: number): Observable<number> {
        return this.dataAdapter.delete(`/api/Admin/_Form/${id}`)
            .map(response => response.json() as number)
            .catch(error => {
                this.handleError(error);
                return Observable.throw(error);
            });
    }

    private handleError(error: any) {
    }
}