﻿import { Injectable } from '@angular/core';
import { DataAdapter } from "app/services/data.adapter";
import { UserLoginModel, TokenInfo } from "app/models/viewModels/AuthenticationViewModels";
import { Observable } from "rxjs/Observable";
import { UserBase } from "app/models/domain/User";

@Injectable()
export class AuthenticationService {
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
                    this.dataAdapter.setAuthToken(result.token);
                    this.dataAdapter.setRefreshToken(result.refreshToken);
                }
            })
            .catch((error) => {
                this.handleError(error);
                return Observable.throw(error);
            });
    }

    /**
     * Разлогиниться.
     */
    logout(): Observable<void> {
        return this.dataAdapter.post("/api/Authentication/Logout")
            .do((result) => {
                if (result.ok) {
                    this.dataAdapter.clearAuthToken();
                    this.dataAdapter.clearRefreshToken();
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
                    this.dataAdapter.setAuthToken(result.token);
                    this.dataAdapter.setRefreshToken(result.refreshToken);
                }
            })
            .catch((error) => {
                this.handleError(error);
                return Promise.reject(error);
            });
    }

	/**
	 * Получить токен из хранилища сессии.
	 */
    getToken(): string {
        return this.dataAdapter.getAuthToken();
    }

	/**
	 * Проверить, аутентифицирован ли текущий пользователь.
	 */
    isAuthenticated(): boolean {
        return this.dataAdapter.isAuthenticated();
    }

	/**
	 * Получить инфу по токену. TODO: переписать на модель.
	 */
    getTokenInfo(): any {
        this.dataAdapter.getAuthTokenInfo();
    }

    private handleError(error: any) {
        console.error('Ошибка: ', error);
    }
}