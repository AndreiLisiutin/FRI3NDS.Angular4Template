import 'styles.scss';

import { enableProdMode } from '@angular/core';
import { platformBrowser } from '@angular/platform-browser';

import { MainModuleNgFactory } from '../aot/app/app/main.module.ngfactory';

// Entry point for AoT compilation.
declare var System: any;

// Styles.
enableProdMode();

platformBrowser().bootstrapModuleFactory(MainModuleNgFactory);
