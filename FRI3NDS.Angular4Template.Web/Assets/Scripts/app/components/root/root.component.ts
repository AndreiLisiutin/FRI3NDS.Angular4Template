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
	templateUrl: 'root.html',
    styles: [`.is-active {color: cornflowerblue;}
.example-fill-remaining-space {
  flex: 1 1 auto;
}
`]
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