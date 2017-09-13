import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from "app/services/authentication.service";
import { FormsModule, NgForm } from '@angular/forms';
import { TokenInfo, UserLoginModel } from 'app/models/viewModels/AuthenticationViewModels';
import { BaseComponent } from "app/components/base.component";

/**
 * Компонент формы входа.
 */
@Component({
    selector: 'login',
    templateUrl: 'login.component.html'
})
export class LoginComponent extends BaseComponent implements OnInit {
	/**
	 * Модель логина.
	 */
	private userLoginModel: UserLoginModel;
	/**
	 * Конструктор компонента формы входа.
	 * @param authService Сервис аутентификации.
	 */
    constructor(
		private authService: AuthenticationService
	) {
		super();
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
				this.ReverseRouter.profile();
			}, (error) => this.handleError(error));
    }

	/**
	 * Проверить, аутентифицирован ли пользователь.
	 */
    isAuthenticated(): boolean {
        return this.authService.isAuthenticated();
    }
}