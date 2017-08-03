import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RoutingModule } from 'routing.module';
import { HttpModule } from "@angular/http";
import { CustomFormsModule } from 'ng2-validation';
import { TranslateModule } from "@ngx-translate/core";
import { SimpleNotificationsModule } from "angular4-notifications";

import { MdAutocompleteModule, MdButtonModule, MdCheckboxModule, MdInputModule, MdToolbarModule, MdSidenavModule, MdMenuModule, MdIconModule, MdSelectModule } from '@angular/material';

import { RootComponent } from 'components/root.component';
import { LoginComponent } from 'components/login.component';
import { RegistrationComponent } from 'components/registration.component';
import { ValidationMessagesComponent } from 'components/validation-messages.component';
import { ToastComponent } from "components/toast.component";
import { ProfileComponent } from "components/profile/profile.component";

/**
 * Модуль регистрации компонентов приложения.
 */
@NgModule({
    imports: [
        MdAutocompleteModule, MdButtonModule, MdCheckboxModule, MdInputModule, MdToolbarModule, MdSidenavModule, MdMenuModule, MdIconModule, MdSelectModule,
        SimpleNotificationsModule.forRoot(),
		FormsModule,
		HttpModule,
		BrowserModule,
        RoutingModule,
        TranslateModule,
		CustomFormsModule
	],
	exports: [
		RootComponent,
		LoginComponent,
        RegistrationComponent,
        ToastComponent,
        ProfileComponent,
		ValidationMessagesComponent
	],
	declarations: [
		RootComponent,
		LoginComponent,
        RegistrationComponent,
        ToastComponent,
        ProfileComponent,
		ValidationMessagesComponent
	],
	providers: []
})
export class ComponentsModule { }
