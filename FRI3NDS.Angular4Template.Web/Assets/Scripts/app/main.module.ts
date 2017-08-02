import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from "@angular/http";
import { Http, RequestOptions } from '@angular/http';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import 'hammerjs';

import { RootComponent } from 'components/root.component';
import { ComponentsModule } from 'components/components.module';
import { ServicesModule } from 'services/services.module';
import { RoutingModule } from 'routing.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

/**
 * Главный модуль приложения.
 */
@NgModule({
    imports: [
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
	providers: []
})
export class MainModule { }
