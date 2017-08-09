import { Component } from '@angular/core';
import { OnInit, ViewChild } from '@angular/core';
import { MdSidenav } from "@angular/material";
import { TranslateService } from "@ngx-translate/core";
import { AuthenticationService } from "services/authentication.service";
import { Router } from "@angular/router";
import { ToastService } from "services/toast.service";
import { _EntityService } from "services/_admin/_entity.service";
import { _Entity } from "models/domain/_Entity";

@Component({
    selector: 'admin-viewer',
    providers: [],
    moduleId: module.id,
    templateUrl: 'admin-viewer.component.html',
    styleUrls: ['admin-viewer.component.css']
})
export class AdminViewerComponent implements OnInit {

    constructor(
        private _entityService: _EntityService,
        private notificationService: ToastService,
        private router: Router
    ) {
    }

   private entities: _Entity[];

    ngOnInit(): void {
        this._entityService.query().subscribe((entities) => {
            this.entities = entities;
        }, (error) => {
            this.notificationService.error('Ошибка', error.text && error.text() || 'Ошибка.');
        });
    }
}