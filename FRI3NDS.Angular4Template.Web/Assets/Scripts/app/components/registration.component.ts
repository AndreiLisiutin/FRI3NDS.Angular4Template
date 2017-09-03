import { Component, OnInit } from '@angular/core';
import { TokenInfo, UserLoginModel } from 'models/viewModels/AuthenticationViewModels';
import { AuthenticationService } from "services/authentication.service";
import { BaseComponent } from "components/base.component";

/**
 * Компонент регистрации нового пользователя.
 */
@Component({
	selector: 'registration',
	moduleId: module.id,
    templateUrl: 'registration.component.html',
	styleUrls: []
})
export class RegistrationComponent extends BaseComponent implements OnInit {
	/**
	 * Модель логина.
	 */
	private userLoginModel: UserLoginModel;

	/**
	 * Конструктор компонента регистрации нового пользователя.
	 * @param authService Сервис аутентификации.
	 */
    constructor(private authService: AuthenticationService) {
		super();
	}

	/**
	 * Обработчик загрузки компонента.
	 */
	ngOnInit(): void {
		this.userLoginModel = new UserLoginModel();
	}

	/**
	 * Зарегистрироваться в приложении.
	 */
    doRegister() {
        this.authService.register(this.userLoginModel)
			.subscribe((tokenInfo: TokenInfo) => {
				this.NotificationService.success('Регистрация успешна', 'Регистрация успешна: ' + JSON.stringify(tokenInfo));
			}, (error) => this.handleError(error));
	}

	/**
	 * Тест - проверить логин через запрос по защищенному маршруту.
	 */
	checkLogin() {
		var tokenInfo = this.authService.getTokenInfo();
		this.NotificationService.success('Токен', 'Инфа о токене: ' + JSON.stringify(tokenInfo));
	}
}
