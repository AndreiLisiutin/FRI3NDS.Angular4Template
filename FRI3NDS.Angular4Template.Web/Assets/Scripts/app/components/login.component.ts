import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { AuthenticationService } from "services/authentication.service";
import { FormsModule, NgForm } from '@angular/forms';
import { TokenInfo, UserLoginModel } from 'models/viewModels/AuthenticationViewModels';
import { ToastService } from "services/toast.service";
import { Router } from "@angular/router";

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
			.then((result :TokenInfo)  => {
                console.log('Авторизация успешна: ' + JSON.stringify(result));
                this.router.navigate(['profile']);
			})
            .catch(error => {
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