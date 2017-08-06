﻿import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastService } from "services/toast.service";
import { User } from "models/domain/User";
import { UserService } from "services/user.service";

/**
 * Компонент формы профиля.
 */
@Component({
    selector: 'profile',
    moduleId: module.id,
    templateUrl: 'profile.component.html',
    styleUrls: []
})
export class ProfileComponent implements OnInit {
	/**
	 * Модель пользователя.
	 */
    private user: User;

    constructor(
        private userService: UserService,
        private notificationService: ToastService) {
    }

	/**
	 * Обработчик загрузки компонента.
	 */
    ngOnInit(): void {
        this.user = new User();
        
        this.userService.getCurrentUser().subscribe(
            user => {
                this.user = user;
            },
            error => {
                this.notificationService.error('Ошибка', error.text && error.text() || 'Ошибка.');
            });
    }

    onSaveBtnClick(): void {
        this.userService.saveUser(this.user).subscribe(
            user => {
                this.user.id = user.id;
                this.notificationService.success('Успех', 'Учетная запись успешно изменена.');
            },
            error => {
                this.notificationService.error('Ошибка', error.text && error.text() || 'Ошибка.');
            });
    }
}