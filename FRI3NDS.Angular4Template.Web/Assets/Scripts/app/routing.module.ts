import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RootComponent } from 'components/root.component';
import { LoginComponent } from 'components/login.component';
import { RegistrationComponent } from 'components/registration.component';
import { ProfileComponent } from "components/profile/profile.component";
import { AdminPanelComponent } from "components/_admin/admin-panel.component";
import { AdminViewerComponent } from "components/_admin/admin-viewer.component";
import { AdminEntitiesComponent } from "components/_admin/_entity/admin-entities.component";
import { AdminEntityComponent } from "components/_admin/_entity/admin-entity.component";
import { AdminEntityEditComponent } from "components/_admin/_entity/admin-entity-edit.component";
import { AdminFieldComponent } from "components/_admin/_field/admin-field.component";
import { AdminFieldEditComponent } from "components/_admin/_field/admin-field-edit.component";

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
            { path: 'viewer', component: AdminViewerComponent },
            { path: 'entity', component: AdminEntitiesComponent },
            { path: 'entity/new', component: AdminEntityEditComponent },
            { path: 'entity/:id', component: AdminEntityComponent },
            { path: 'entity/:id/edit', component: AdminEntityEditComponent },
            { path: 'entity/field/new/:entityId', component: AdminFieldEditComponent },
            { path: 'entity/field/:id', component: AdminFieldComponent },
            { path: 'entity/field/:id/edit', component: AdminFieldEditComponent }
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