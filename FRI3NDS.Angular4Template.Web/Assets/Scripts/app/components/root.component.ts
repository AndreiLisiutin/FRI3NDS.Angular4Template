import { Component } from '@angular/core';
import { OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from "services/authentication.service";
import { BaseComponent } from "components/base.component";

/**
 * Корневой компонент приложения.
 */
@Component({
	selector: 'root',
	providers: [],
	moduleId: module.id,
	templateUrl: 'root.component.html',
	styleUrls: ['root.component.css']
})
export class RootComponent extends BaseComponent {

	private languages: any[];
	private selectedLanguage: string;

	constructor(
		private authService: AuthenticationService
	) {
		super();
		this.languages = [{
			value: 'ru',
			label: 'Русский'
		}, {
			value: 'en',
			label: 'English'
		}];

		this.selectedLanguage = this.languages[0].value;
		this.TranslateService.addLangs(this.languages.map(l => l.value));
		this.TranslateService.setDefaultLang(this.selectedLanguage);
		this.TranslateService.use(this.selectedLanguage);
	}

	isAuthenticated(): boolean {
		return this.authService.isAuthenticated();
	}

	onLogoutClick(): void {
		this.authService.logout().subscribe(() => {
			this.ReverseRouter.login();
		}, (error) => this.handleError(error));
	}

	onLanguageChange(changeEvent: { value: string }) {
		this.TranslateService.use(changeEvent.value);
	}
}