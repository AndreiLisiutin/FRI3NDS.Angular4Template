﻿import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { AuthenticationService } from "services/authentication.service";
import { FormsModule, NgForm } from '@angular/forms';
import { TokenInfo, UserLoginModel } from 'models/viewModels/AuthenticationViewModels';
import { ToastService } from "services/toast.service";
import { Router } from "@angular/router";
import { UserService } from "services/user.service";
import { User } from "models/domain/User";

/**
 * Компонент формы входа.
 */
@Component({
    selector: 'login',
    moduleId: module.id,
    templateUrl: 'login.component.html',
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
	 * @param _notificationService Сервис тостера.
	 * @param router Роутер.
	 */
    constructor(
        private authService: AuthenticationService,
        private userService: UserService,
        private _notificationService: ToastService,
        private router: Router) {
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
            .subscribe((result: TokenInfo) => {
                console.log('Авторизация успешна: ' + JSON.stringify(result));
                this.userService.saveUser(new User()).subscribe(
                    user => {

                    },
                    error => {
                        this._notificationService.error('Ошибка', error.text && error.text() || 'Ошибка.');
                    });
                //this.router.navigate(['profile']);
            }, (error) => {
                this._notificationService.error('Ошибка', error.text && error.text() || 'Ошибка.');
            });
    }

	/**
	 * Проверить, аутентифицирован ли пользователь.
	 */
    isAuthenticated(): boolean {
        return this.authService.isAuthenticated();
    }
}