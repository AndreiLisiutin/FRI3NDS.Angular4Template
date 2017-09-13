import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RootComponent } from 'app/components/root.component';
import { LoginComponent } from 'app/components/login.component';
import { RegistrationComponent } from 'app/components/registration.component';
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
 * Маршруты приложения.
 */
const _routes: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'login' },
	{ path: 'register', component: RegistrationComponent },
	{ path: 'login', component: LoginComponent },
	{ path: 'profile', component: ProfileComponent },
	{
		path: 'admin', component: AdminPanelComponent, children: [
			{ path: 'entity', component: AdminEntitiesComponent },
			{ path: 'entity/new', component: AdminEntityEditComponent },
			{ path: 'entity/:id', component: AdminEntityComponent },
			{ path: 'entity/:id/edit', component: AdminEntityEditComponent },
			{ path: 'entity/field/new/:entityId', component: AdminFieldEditComponent },
			{ path: 'entity/field/:id', component: AdminFieldComponent },
			{ path: 'entity/field/:id/edit', component: AdminFieldEditComponent },
			{ path: 'viewer', component: AdminViewerComponent },
			{ path: 'viewer/entityInstances/:entityId', component: AdminViewerEntityInstancesComponent },
			{ path: 'viewer/form/:formId/:entityInstanceId', component: AdminGenericEntityFormComponent }
		]
	}
];

/**
 * Модуль навигации.
 */
@NgModule({
	imports: [RouterModule.forRoot(_routes, { useHash: true })],
	exports: [RouterModule]
})
export class RoutingModule { }