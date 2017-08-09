import { Component } from '@angular/core';
import { OnInit, ViewChild } from '@angular/core';
import { MdSidenav } from "@angular/material";
import { TranslateService } from "@ngx-translate/core";
import { AuthenticationService } from "services/authentication.service";
import { Router } from "@angular/router";
import { ToastService } from "services/toast.service";
import { _EntityService } from "services/_admin/_entity.service";
import { _Entity } from "models/domain/_Entity";

/**
 * Корневой компонент приложения.
 */
@Component({
    selector: 'admin-panel',
    providers: [],
    moduleId: module.id,
    templateUrl: 'admin-panel.component.html',
    styleUrls: ['admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {

    constructor(
        private notificationService: ToastService,
        private router: Router
    ) {
    }
    

    ngOnInit(): void {
       
    }
}