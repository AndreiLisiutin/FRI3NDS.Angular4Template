import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RoutingModule } from 'routing.module';
import { HttpModule } from "@angular/http";
import { CustomFormsModule } from 'ng2-validation';
import { TranslateModule } from "@ngx-translate/core";
import { SimpleNotificationsModule } from "angular4-notifications";

import {
	MdAutocompleteModule, MdButtonModule, MdCheckboxModule, MdInputModule, MdToolbarModule, MdSidenavModule, MdMenuModule, MdIconModule, MdSelectModule, MdTabsModule, MdTableModule, MdSortModule,
	MdPaginatorModule, MdDatepickerModule, MdNativeDateModule
} from '@angular/material';

import { CovalentLayoutModule, CovalentStepsModule, CovalentDataTableModule, CovalentPagingModule, CovalentCommonModule } from '@covalent/core';

import { CommonModule } from '@angular/common';
import { CdkTableModule } from '@angular/cdk';
import { RootComponent } from 'components/root.component';
import { LoginComponent } from 'components/login.component';
import { RegistrationComponent } from 'components/registration.component';
import { ValidationMessagesComponent } from 'components/validation-messages.component';
import { ToastComponent } from "components/toast.component";
import { ProfileComponent } from "components/profile/profile.component";
import { AdminPanelComponent } from "components/_admin/admin-panel.component";
import { AdminViewerComponent } from "components/_admin/admin-viewer.component";
import { AdminEntitiesComponent } from "components/_admin/_entity/admin-entities.component";
import { AdminEntityComponent } from "components/_admin/_entity/admin-entity.component";
import { AdminEntityEditComponent } from "components/_admin/_entity/admin-entity-edit.component";
import { AdminFieldComponent } from "components/_admin/_field/admin-field.component";
import { AdminFieldEditComponent } from "components/_admin/_field/admin-field-edit.component";
import { AdminGenericEntityFormComponent } from "components/_admin/_generic-entity/admin-generic-entity-form.component";

/**
 * Модуль регистрации компонентов приложения.
 */
@NgModule({
	imports: [
		CommonModule,
		MdAutocompleteModule, MdButtonModule, MdCheckboxModule, MdInputModule, MdToolbarModule, MdSidenavModule, MdMenuModule, MdIconModule, MdSelectModule, MdTabsModule, MdTableModule, MdSortModule,
		MdPaginatorModule, MdDatepickerModule, MdNativeDateModule,

		CovalentLayoutModule, CovalentStepsModule, CovalentDataTableModule, CovalentPagingModule, CovalentCommonModule,

		CdkTableModule,
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
		ValidationMessagesComponent,

		AdminPanelComponent,
		AdminViewerComponent,
		AdminEntitiesComponent,
		AdminEntityComponent,
		AdminEntityEditComponent,
		AdminFieldComponent,
		AdminFieldEditComponent,
		AdminGenericEntityFormComponent
	],
	declarations: [
		RootComponent,
		LoginComponent,
		RegistrationComponent,
		ToastComponent,
		ProfileComponent,
		ValidationMessagesComponent,

		AdminPanelComponent,
		AdminViewerComponent,
		AdminEntitiesComponent,
		AdminEntityComponent,
		AdminEntityEditComponent,
		AdminFieldComponent,
		AdminFieldEditComponent,
		AdminGenericEntityFormComponent
	],
	providers: []
})
export class ComponentsModule { }
