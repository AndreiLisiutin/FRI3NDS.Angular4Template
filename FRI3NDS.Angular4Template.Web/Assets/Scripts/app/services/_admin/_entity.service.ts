import { Injectable } from '@angular/core';
import { DataAdapter } from "services/data.adapter";
import { Observable } from "rxjs/Observable";
import { _Entity, _EntityBase } from "models/domain/_Entity";

@Injectable()
export class _EntityService {
    constructor(private dataAdapter: DataAdapter) { }
    
    query(): Observable<_Entity[]> {
        return this.dataAdapter.get("/api/Admin/_Entity")
            .map(response => response.json() as _Entity[])
            .catch(error => {
                this.handleError(error);
                return Observable.throw(error);
            });
    }
    
    getById(id: number): Observable<_Entity> {
        return this.dataAdapter.get(`/api/Admin/_Entity/${id}`)
            .map(response => response.json() as _Entity)
            .catch(error => {
                this.handleError(error);
                return Observable.throw(error);
            });
    }
    
    save(entity: _EntityBase): Observable<_EntityBase> {
        return this.dataAdapter.post("/api/Admin/_Entity", entity)
            .map(response => response.json() as _EntityBase)
            .catch(error => {
                this.handleError(error);
                return Observable.throw(error);
            });
    }

    delete(id: number): Observable<_EntityBase> {
        return this.dataAdapter.delete(`/api/Admin/_Entity/${id}`)
            .map(response => response.json() as _EntityBase)
            .catch(error => {
                this.handleError(error);
                return Observable.throw(error);
            });
    }

    private handleError(error: any) {
    }
}