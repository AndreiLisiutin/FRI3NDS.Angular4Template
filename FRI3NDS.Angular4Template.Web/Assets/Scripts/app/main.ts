import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { MainModule } from 'main.module';
import { AppInjector } from "infrastructure/app-injector";

platformBrowserDynamic().bootstrapModule(MainModule);
