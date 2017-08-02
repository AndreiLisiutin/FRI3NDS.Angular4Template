import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RootComponent } from 'components/root.component';
import { LoginComponent } from 'components/login.component';
import { RegistrationComponent } from 'components/registration.component';

/**
 * Маршруты приложения.
 */
const routes: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'login' },
	{ path: 'register', component: RegistrationComponent },
	{ path: 'login', component: LoginComponent }
];

/**
 * Модуль навигации.
 */
@NgModule({
	imports: [RouterModule.forRoot(routes, { useHash: true })],
	exports: [RouterModule]
})
export class RoutingModule { }