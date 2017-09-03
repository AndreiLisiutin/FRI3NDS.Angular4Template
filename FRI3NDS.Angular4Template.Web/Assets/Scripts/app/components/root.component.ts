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
    private selectedLanguageId: string;

	constructor(
        private authService: AuthenticationService
	) {
		super();
        this.languages = [{
            id: 'ru',
            name: 'Русский'
        }, {
            id: 'en',
            name: 'English'
        }];

        this.selectedLanguageId = this.languages[0].id;
		this.TranslateService.addLangs(this.languages.map(l => l.id));
		this.TranslateService.setDefaultLang(this.selectedLanguageId);
		this.TranslateService.use(this.selectedLanguageId);
    }

    isAuthenticated(): boolean {
        return this.authService.isAuthenticated();
    }

    onLogoutClick(): void {
        this.authService.logout().subscribe(() => {
			this.Router.navigate(['login']);
		}, (error) => this.handleError(error));
    }

    onLanguageChange(lang: string) {
		this.TranslateService.use(lang);
    }
}