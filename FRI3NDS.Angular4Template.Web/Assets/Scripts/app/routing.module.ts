import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RootComponent } from 'components/root.component';
import { LoginComponent } from 'components/login.component';
import { RegistrationComponent } from 'components/registration.component';
import { ProfileComponent } from "components/profile/profile.component";

/**
 * Маршруты приложения.
 */
const routes: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'login' },
	{ path: 'register', component: RegistrationComponent },
	{ path: 'login', component: LoginComponent },
    { path: 'profile', component: ProfileComponent }
];

/**
 * Модуль навигации.
 */
@NgModule({
	imports: [RouterModule.forRoot(routes, { useHash: true })],
	exports: [RouterModule]
})
export class RoutingModule { }