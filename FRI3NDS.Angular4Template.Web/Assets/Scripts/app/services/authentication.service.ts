import { Injectable } from '@angular/core';
import { DataAdapter } from "services/data.adapter";
import { JwtHelper } from "angular2-jwt";
import { UserLoginModel, TokenInfo } from "models/viewModels/AuthenticationViewModels";
import { Observable } from "rxjs/Observable";
import { UserBase } from "models/domain/User";

@Injectable()
export class AuthenticationService {
    private jwtHelper: JwtHelper = new JwtHelper();
    constructor(private dataAdapter: DataAdapter) { }

    /**
     * Залогиниться.
     * @param userLoginModel Данные для авторизации пользователя.
     */
    login(userLoginModel: UserLoginModel): Observable<TokenInfo> {
        return this.dataAdapter.post("/api/Authentication/Login", userLoginModel)
            .map(response => response.json() as TokenInfo)
            .do((result: TokenInfo) => {
                if (result) {
                    this.dataAdapter.setToken(result.token);
                }
            })
            .catch((error) => {
                this.handleError(error);
                return Observable.throw(error);
            });
    }
    /**
     * Сохранить пользователя.
     * @param user Пользователь.
     */
    saveUser(user: UserBase): Observable<UserBase> {
        return this.dataAdapter.post("/api/Authentication/SaveUser", user)
            .map(response => response.json() as UserBase)
            .catch(error => {
                this.handleError(error);
                return Observable.throw(error);
            });
    }

    /**
     * Зарегистрировать нового пользователя.
     * @param userLoginModel Данные для регистрации пользователя.
     */
    register(userLoginModel: UserLoginModel): Observable<TokenInfo> {
        return this.dataAdapter.post("/api/Authentication/SignUp", userLoginModel)
            .map(response => response.json() as TokenInfo)
            .do((result: TokenInfo) => {
                if (result) {
                    this.dataAdapter.setToken(result.token);
                }
            })
            .catch((error) => {
                this.handleError(error);
                return Promise.reject(error);
            });
    }

    /**
	 * Разлогиниться.
	 */
    logout(): void {
        this.dataAdapter.clearToken();
    }

	/**
	 * Получить токен из хранилища сессии.
	 */
    getToken(): string {
        return this.dataAdapter.getToken();
    }

	/**
	 * Проверить, аутентифицирован ли текущий пользователь.
	 */
    isAuthenticated(): boolean {
        var token = this.dataAdapter.getToken();
        return token && !this.jwtHelper.isTokenExpired(token);
    }

	/**
	 * Получить инфу по токену. TODO: переписать на модель.
	 */
    getTokenInfo(): any {
        var token = this.getToken();
        return token && this.jwtHelper.decodeToken(token);
    }

    private handleError(error: any) {
        console.error('Ошибка: ', error);
    }
}