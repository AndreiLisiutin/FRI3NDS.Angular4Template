import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RoutingModule } from 'routing.module';
import { HttpModule } from "@angular/http";
import { TranslateModule } from "@ngx-translate/core";
import { SimpleNotificationsModule } from "angular4-notifications";

import { ValidationService } from "services/validation.service";
import { DataAdapter } from "services/data.adapter";
import { AuthenticationService } from "services/authentication.service";
import { ToastService } from "services/toast.service";
import { UserService } from "services/user.service";

/**
 * Модуль регистрации сервисов приложения.
 */
@NgModule({
	imports: [
		FormsModule,
        HttpModule,
        TranslateModule,
        SimpleNotificationsModule
	],
	exports: [

	],
	declarations: [
	],
	providers: [
        ValidationService,
        AuthenticationService,
        DataAdapter,
        UserService,
        ToastService
	]
})
export class ServicesModule { }
