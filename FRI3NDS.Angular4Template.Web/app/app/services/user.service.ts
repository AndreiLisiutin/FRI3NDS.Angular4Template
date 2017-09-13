import { Injectable } from '@angular/core';
import { DataAdapter } from "app/services/data.adapter";
import { Observable } from "rxjs/Observable";
import { User, UserBase } from "app/models/domain/User";

@Injectable()
export class UserService {
    constructor(private dataAdapter: DataAdapter) { }


    /**
     * Получить текущего пользователя.
     */
    getCurrentUser(): Observable<User> {
        return this.dataAdapter.get("/api/User/GetCurrentUser")
            .map(response => response.json())
            .catch(error => {
                this.handleError(error);
                return Observable.throw(error);
            });
    }

    /**
     * Сохранить пользователя.
     * @param user Пользователь.
     */
    saveUser(user: UserBase): Observable<UserBase> {
        return this.dataAdapter.post("/api/User/SaveUser", user)
            .map(response => response.json() as UserBase)
            .catch(error => {
                this.handleError(error);
                return Observable.throw(error);
            });
    }

    private handleError(error: any) {
    }
}