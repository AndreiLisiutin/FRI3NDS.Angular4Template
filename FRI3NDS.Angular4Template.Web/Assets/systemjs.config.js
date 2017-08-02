(function (global) {
    System.config({
        baseURL: './Scripts/app',
        paths: {
            'npm:': './Scripts/lib/',
        },

        map: {
            //���� � ����������
            'Scripts/app': './Scripts/app/',

            //������������ � typescript ������
            '@angular/core': 'npm:@angular/core/bundles/core.umd.js',
            '@angular/common': 'npm:@angular/common/bundles/common.umd.js',
            '@angular/common/http': 'npm:@angular/common/bundles/common-http.umd.js',
            '@angular/compiler': 'npm:@angular/compiler/bundles/compiler.umd.js',
            '@angular/platform-browser': 'npm:@angular/platform-browser/bundles/platform-browser.umd.js',
            '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
            '@angular/http': 'npm:@angular/http/bundles/http.umd.js',
            '@angular/router': 'npm:@angular/router/bundles/router.umd.js',
            '@angular/router/upgrade': 'npm:@angular/router/bundles/router-upgrade.umd.js',
            '@angular/forms': 'npm:@angular/forms/bundles/forms.umd.js',
            '@angular/animations': 'npm:@angular/animations/bundles/animations.umd.js',
            '@angular/animations/browser': 'npm:@angular/animations/bundles/animations-browser.umd.js',
            '@angular/platform-browser/animations': 'npm:@angular/platform-browser/bundles/platform-browser-animations.umd.js',
            'angular2-jwt': 'npm:angular2-jwt/angular2-jwt.js',
            'ng2-validation': 'npm:ng2-validation/bundles/ng2-validation.umd.js',
            'libphonenumber-js': 'npm:libphonenumber-js/bundle/libphonenumber-js.min.js',
            'rxjs': 'npm:rxjs',
            'angular-in-memory-web-api': 'npm:angular-in-memory-web-api/bundles/in-memory-web-api.umd.js',
            '@angular/material': 'npm:@angular/material/bundles/material.umd.js',
            '@angular/cdk': 'npm:@angular/cdk/bundles/cdk.umd.js',
            'hammerjs': 'npm:hammerjs/hammer.min.js',
            'angular4-notifications': 'npm:angular4-notifications',
            '@ngx-translate/core': 'npm:@ngx-translate/core/bundles/core.umd.js',
            '@ngx-translate/http-loader': 'npm:@ngx-translate/http-loader/bundles/http-loader.umd.js',
            'tslib': 'npm:tslib/tslib.js',
        },

        packages: {
            'Scripts/app': {
                main: './main.js',
                defaultExtension: 'js'
            },
            'angular4-notifications': {
                main: 'components.js',
                defaultExtension: 'js'
            },
            rxjs: {
                defaultExtension: 'js'
            }
        }
    });
})(this);
