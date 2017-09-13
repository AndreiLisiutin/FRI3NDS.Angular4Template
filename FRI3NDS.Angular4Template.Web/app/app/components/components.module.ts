import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RoutingModule } from 'app/routing.module';
import { HttpModule } from "@angular/http";
import { CustomFormsModule } from 'ng2-validation';
import { TranslateModule } from "@ngx-translate/core";
import { SimpleNotificationsModule } from "angular2-notifications";

import { DataTableModule, SharedModule, InputTextModule, DropdownModule, CheckboxModule, CalendarModule, TabViewModule } from 'primeng/primeng';

import { CommonModule } from '@angular/common';
import { CdkTableModule } from '@angular/cdk';
import { RootComponent } from 'app/components/root.component';
import { LoginComponent } from 'app/components/login.component';
import { RegistrationComponent } from 'app/components/registration.component';
import { ValidationMessagesComponent } from 'app/components/validation-messages.component';
import { ToastComponent } from "app/components/toast.component";
import { ProfileComponent } from "app/components/profile/profile.component";
import { AdminPanelComponent } from "app/components/_admin/admin-panel.component";
import { AdminViewerComponent } from "app/components/_admin/viewer/admin-viewer.component";
import { AdminEntitiesComponent } from "app/components/_admin/_entity/admin-entities.component";
import { AdminEntityComponent } from "app/components/_admin/_entity/admin-entity.component";
import { AdminEntityEditComponent } from "app/components/_admin/_entity/admin-entity-edit.component";
import { AdminFieldComponent } from "app/components/_admin/_field/admin-field.component";
import { AdminFieldEditComponent } from "app/components/_admin/_field/admin-field-edit.component";
import { AdminGenericEntityFormComponent } from "app/components/_admin/_generic-entity/admin-generic-entity-form.component";
import { AdminViewerEntityInstancesComponent } from "app/components/_admin/viewer/admin-viewer-entity-instances.component";

/**
 * Модуль регистрации компонентов приложения.
 */
@NgModule({
	imports: [
		CommonModule,

		DataTableModule, SharedModule, InputTextModule, DropdownModule, CheckboxModule, CalendarModule, TabViewModule,

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
		AdminViewerEntityInstancesComponent,
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
		AdminViewerEntityInstancesComponent,
		AdminGenericEntityFormComponent
	],
	providers: []
})
export class ComponentsModule { }
