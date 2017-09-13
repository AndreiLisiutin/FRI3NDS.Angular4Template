import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from "@angular/http";
import { TranslateModule } from "@ngx-translate/core";
import { SimpleNotificationsModule } from "angular2-notifications";

import { ValidationService } from "app/services/validation.service";
import { DataAdapter } from "app/services/data.adapter";
import { AuthenticationService } from "app/services/authentication.service";
import { ToastService } from "app/services/toast.service";
import { UserService } from "app/services/user.service";
import { _EntityService } from "app/services/_admin/_entity.service";
import { _FieldService } from "app/services/_admin/_field.service";
import { _GenericEntityService } from "app/services/_admin/_generic-entity.service";
import { _FormService } from "app/services/_admin/_form.service";
import { _FormFieldService } from "app/services/_admin/_form-field.service";
import { ConvertService } from "app/services/utils/convert.service";
import { ReverseRoutingService } from "app/services/utils/reverse-routing.service";

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
		ConvertService,
		ReverseRoutingService,
		_EntityService,
		_FieldService,
		_GenericEntityService,
		_FormService,
		_FormFieldService
	]
})
export class ServicesModule { }
