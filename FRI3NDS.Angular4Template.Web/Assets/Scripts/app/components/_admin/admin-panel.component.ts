import { Component, OnInit, ViewChild } from '@angular/core';
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

	pageChange(e: { index: number }): void {
		var index = e.index;
		switch (e.index) {
			case 0:
				this.ReverseRouter.viewer();
				break;
			case 1:
				this.ReverseRouter.entities();
				break;
		}
	}

	ngOnInit(): void {

	}
}