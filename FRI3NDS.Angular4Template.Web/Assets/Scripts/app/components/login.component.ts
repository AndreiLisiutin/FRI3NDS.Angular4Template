import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from "services/authentication.service";
import { FormsModule, NgForm } from '@angular/forms';
import { TokenInfo, UserLoginModel } from 'models/viewModels/AuthenticationViewModels';
import { BaseComponent } from "components/base.component";

/**
 * Компонент формы входа.
 */
@Component({
    selector: 'login',
    moduleId: module.id,
    templateUrl: 'login.component.html',
    styleUrls: []
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
                this.Router.navigate(['profile']);
			}, this.handleError);
    }

	/**
	 * Проверить, аутентифицирован ли пользователь.
	 */
    isAuthenticated(): boolean {
        return this.authService.isAuthenticated();
    }
}