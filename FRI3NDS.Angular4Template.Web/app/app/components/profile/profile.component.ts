import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { User } from "app/models/domain/User";
import { UserService } from "app/services/user.service";
import { BaseComponent } from "app/components/base.component";

/**
 * Компонент формы профиля.
 */
@Component({
	selector: 'profile',
	templateUrl: 'profile.component.html'
})
export class ProfileComponent extends BaseComponent implements OnInit {
	/**
	 * Модель пользователя.
	 */
	private user: User;

	constructor(
		private userService: UserService
	) {
		super();
	}

	/**
	 * Обработчик загрузки компонента.
	 */
	ngOnInit(): void {
		this.user = new User();

		this.userService.getCurrentUser().subscribe(
			user => {
				this.user = user;
			}, (error) => this.handleError(error));
	}

	onSaveBtnClick(): void {
		this.userService.saveUser(this.user).subscribe(
			user => {
				this.user.id = user.id;
				this.NotificationService.success('Успех', 'Учетная запись успешно изменена.');
			}, (error) => this.handleError(error));
	}
}