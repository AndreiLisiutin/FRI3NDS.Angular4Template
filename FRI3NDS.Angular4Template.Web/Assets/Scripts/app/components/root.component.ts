import { Component } from '@angular/core';
import { OnInit, ViewChild } from '@angular/core';
import { MdSidenav } from "@angular/material";
import { TranslateService } from "@ngx-translate/core";
import { AuthenticationService } from "services/authentication.service";
import { Router } from "@angular/router";
import { ToastService } from "services/toast.service";

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
export class RootComponent {

    private languages: any[];
    private selectedLanguageId: string;

    constructor(
        private translate: TranslateService,
        private authService: AuthenticationService,
        private notificationService: ToastService,
        private router: Router
    ) {
        this.languages = [{
            id: 'ru',
            name: 'Русский'
        }, {
            id: 'en',
            name: 'English'
        }];

        this.selectedLanguageId = this.languages[0].id;
        translate.addLangs(this.languages.map(l => l.id));
        translate.setDefaultLang(this.selectedLanguageId);
        translate.use(this.selectedLanguageId);
    }

    isAuthenticated(): boolean {
        return this.authService.isAuthenticated();
    }

    onLogoutClick(): void {
        this.authService.logout().subscribe(() => {
            this.router.navigate(['login']);
        }, (error) => {
            this.notificationService.error('Ошибка', error.text && error.text() || 'Ошибка.');
        });
    }

    onLanguageChange(lang: string) {
        this.translate.use(lang);
    }
}