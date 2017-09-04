﻿import { ToastService } from "services/toast.service";
import { ConvertService } from "services/utils/convert.service";
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from "@angular/router";
import { Component } from "@angular/core";
import { AppInjector } from "infrastructure/app-injector";
import { TranslateService } from "@ngx-translate/core";

/**
 * Базовый компонент.
 */
export class BaseComponent {

	public NotificationService: ToastService;
	public ConvertService: ConvertService;
	public Location: Location;
	public Router: Router;
	public TranslateService: TranslateService;
	constructor(
	) {
		this.NotificationService = AppInjector().get(ToastService);
		this.ConvertService = AppInjector().get(ConvertService);
		this.Location = AppInjector().get(Location);
		this.Router = AppInjector().get(Router);
		this.TranslateService = AppInjector().get(TranslateService);
	}

	handleError(error: any) {
		this.NotificationService.error('Ошибка', error && error.text && error.text() || 'Произошла ошибка...');
	}
}