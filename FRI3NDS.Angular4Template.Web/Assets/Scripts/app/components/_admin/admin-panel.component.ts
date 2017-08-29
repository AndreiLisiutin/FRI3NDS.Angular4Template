import { Component,OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from "services/authentication.service";
import { _EntityService } from "services/_admin/_entity.service";
import { _Entity } from "models/domain/_Entity";
import { BaseComponent } from "components/base.component";

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
export class AdminPanelComponent extends BaseComponent implements OnInit {

    constructor(
	) {
		super();
    }
    

    ngOnInit(): void {
       
    }
}