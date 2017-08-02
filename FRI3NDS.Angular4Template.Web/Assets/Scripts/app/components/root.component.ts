import { Component } from '@angular/core';
import { OnInit, ViewChild } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import { MdSidenav } from "@angular/material";
import { TranslateService } from "@ngx-translate/core";

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
    constructor(private translate: TranslateService) {
        translate.addLangs(['en', 'ru']);
        translate.setDefaultLang('en');
        translate.use('en');
    }

    changeLang(lang: string) {
        this.translate.use(lang);
    }
}