﻿import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { AuthenticationService } from "services/authentication.service";
import { AuthHttp } from 'angular2-jwt';
import { FormsModule, NgForm } from '@angular/forms';
import { TokenInfo, UserLoginModel } from 'models/viewModels/AuthenticationViewModels';

/**
 * Компонент формы входа.
 */
@Component({
	selector: 'login',
	moduleId: module.id,
	templateUrl: 'login.html',
	styleUrls: []
})
export class LoginComponent implements OnInit {
	/**
	 * Модель логина.
	 */
	private userLoginModel: UserLoginModel;
	/**
	 * Конструктор компонента формы входа.
	 * @param authService Сервис аутентификации.
	 */
	constructor(private authService: AuthenticationService) {
	}

	/**
	 * Обработчик загрузки компонента.
	 */
	ngOnInit(): void {
		this.userLoginModel = new UserLoginModel();
	}
    
	/**
	 * Войти в приложение.
	 */
	doLogin(): void {
		this.authService.login(this.userLoginModel)
			.then((result :TokenInfo)  => {
				console.log('Авторизация успешна: ' + JSON.stringify(result));
			})
			.catch(error => {
				alert(error.text && error.text() || 'Ошибка.');
			});
	}

	/**
	 * Тест - проверить логин через запрос по защищенному маршруту.
	 */
    checkLogin(): void {
        this.authService.checkLogin();
		var tokenInfo = this.authService.getTokenInfo();
		console.log('Инфа о токене: ' + JSON.stringify(tokenInfo));
	}

	/**
	 * Выйти из приложения.
	 */
	doLogout(): void {
		this.authService.logout();
	}

	/**
	 * Проверить, аутентифицирован ли пользователь.
	 */
	isAuthenticated(): boolean {
		return this.authService.isAuthenticated();
	}
}