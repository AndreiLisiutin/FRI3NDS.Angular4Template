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
import { _EntityService } from "services/_admin/_entity.service";
import { _FieldService } from "services/_admin/_field.service";

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
        ToastService,
        _EntityService,
        _FieldService
	]
})
export class ServicesModule { }
