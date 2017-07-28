import { Injectable } from '@angular/core';
import { DataAdapter } from "services/data.adapter";
import { JwtHelper } from "angular2-jwt";
import { UserLoginModel, TokenInfo } from "models/viewModels/AuthenticationViewModels";

@Injectable()
export class AuthenticationService {
    private jwtHelper: JwtHelper = new JwtHelper();
    constructor(private dataAdapter: DataAdapter) { }

    /**
     * Залогиниться.
     * @param userLoginModel Данные для авторизации пользователя.
     */
    login(userLoginModel: UserLoginModel): Promise<TokenInfo> {
        return this.dataAdapter.post("/api/Authentication/Login", userLoginModel)
            .toPromise()
            .then((response) => {
                var result: TokenInfo = response.json() as TokenInfo;
                if (result) {
                    this.dataAdapter.setToken(result.token);
                }
                return result;
            })
            .catch((error) => {
                this.handleError(error);
                return Promise.reject(error);
            });
    }

    /**
     * Зарегистрировать нового пользователя.
     * @param userLoginModel Данные для регистрации пользователя.
     */
    register(userLoginModel: UserLoginModel): Promise<TokenInfo> {
        return this.dataAdapter.post("/api/Authentication/SignUp", userLoginModel)
            .toPromise()
            .then((response) => {
                var result: TokenInfo = response.json() as TokenInfo;
                if (result) {
                    this.dataAdapter.setToken(result.token);
                }
                return result;
            })
            .catch((error) => {
                this.handleError(error);
                return Promise.reject(error);
            });
    }

    checkLogin(): void {
        this.dataAdapter.get("/api/Authentication/Test")
            .toPromise()
            .then((response) => {
                var result = response.ok ? 'OK' : 'No OK';
                console.log(result);
                return result;
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