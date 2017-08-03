import { Injectable } from '@angular/core';
import { DataAdapter } from "services/data.adapter";
import { Observable } from "rxjs/Observable";
import { User } from "models/domain/User";

@Injectable()
export class UserService {
    constructor(private dataAdapter: DataAdapter) { }


    /**
     * Получить текущего пользователя.
     */
    getCurrentUser(): Observable<User> {
        return this.dataAdapter.get("/api/User/GetCurrentUser")
            .catch(error => {
                this.handleError(error);
                return Observable.throw(error);
            })
            .map(response => response.json());
    }

    private handleError(error: any) {
        console.error('Ошибка: ', error);
    }
}