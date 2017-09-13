import { NgModule, APP_INITIALIZER, Injector } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from "@angular/http";
import { Http, RequestOptions } from '@angular/http';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import 'hammerjs';

import { RootComponent } from 'app/components/root.component';
import { ComponentsModule } from 'app/components/components.module';
import { ServicesModule } from 'app/services/services.module';
import { RoutingModule } from 'app/routing.module';
import { CommonModule } from "@angular/common";
import { AppInjector } from "app/infrastructure/app-injector";

/**
 * Главный модуль приложения.
 */
@NgModule({
	imports: [
		CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        HttpModule,
        FormsModule,
        RouterModule,
        HttpClientModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (http: HttpClient) => new TranslateHttpLoader(http, '/Localization/', '.json'),
                deps: [HttpClient]
            }
        }),
		ComponentsModule,
		ServicesModule,
		RoutingModule
    ],
    declarations: [],
	bootstrap: [RootComponent],
	providers: [{
		'provide': APP_INITIALIZER,
		'useFactory': function init(config: Injector) {
			return () => {
				AppInjector(config);
			};
		},
		'deps': [Injector],
		'multi': true
	}]
})
export class MainModule { }
