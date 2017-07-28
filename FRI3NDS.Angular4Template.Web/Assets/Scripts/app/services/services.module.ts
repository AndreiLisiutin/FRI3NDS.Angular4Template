import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RoutingModule } from 'routing.module';
import { HttpModule } from "@angular/http";

import { ValidationService } from "services/validation.service";
import { DataAdapter } from "services/data.adapter";
import { AuthenticationService } from "services/authentication.service";

/**
 * Модуль регистрации сервисов приложения.
 */
@NgModule({
	imports: [
		FormsModule,
		HttpModule,
	],
	exports: [

	],
	declarations: [
	],
	providers: [
        ValidationService,
        AuthenticationService,
        DataAdapter
	]
})
export class ServicesModule { }
