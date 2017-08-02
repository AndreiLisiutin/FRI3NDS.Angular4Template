import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import { TokenInfo, UserLoginModel } from 'models/viewModels/AuthenticationViewModels';
import { AuthenticationService } from "services/authentication.service";
import { NotificationsService } from "angular4-notifications";

/**
 * Компонент регистрации нового пользователя.
 */
@Component({
	selector: 'registration',
	moduleId: module.id,
    templateUrl: 'registration.component.html',
	styleUrls: []
})
export class RegistrationComponent implements OnInit {
	/**
	 * Модель логина.
	 */
	private userLoginModel: UserLoginModel;

	/**
	 * Конструктор компонента регистрации нового пользователя.
	 * @param authService Сервис аутентификации.
	 * @param _notificationService Сервис тостера.
	 */
    constructor(private authService: AuthenticationService, private _notificationService: NotificationsService) {
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
            .then((result: TokenInfo) => {
                this._notificationService.success('Регистрация успешна', 'Регистрация успешна: ' + JSON.stringify(result));
			})
			.catch(error => {
                this._notificationService.error('Ошибка', error.text && error.text() || 'Ошибка.');
			});
	}

	/**
	 * Тест - проверить логин через запрос по защищенному маршруту.
	 */
	checkLogin() {
        var tokenInfo = this.authService.getTokenInfo();
        this._notificationService.success('Токен', 'Инфа о токене: ' + JSON.stringify(tokenInfo));
	}
}
