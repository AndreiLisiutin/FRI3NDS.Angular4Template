import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from "services/authentication.service";
import { _EntityService } from "services/_admin/_entity.service";
import { _Entity, _EntityBase } from "models/domain/_Entity";
import { Observable } from "rxjs/Observable";
import { BaseComponent } from "components/base.component";
import { ActivatedRoute } from "@angular/router";

@Component({
	selector: 'admin-entity-edit',
	providers: [],
	moduleId: module.id,
	templateUrl: 'admin-entity-edit.component.html',
	styleUrls: ['admin-entity-edit.component.css']
})
export class AdminEntityEditComponent extends BaseComponent implements OnInit {

	constructor(
		private ActivatedRoute: ActivatedRoute,
		private _entityService: _EntityService
	) {
		super();
	}

	private entity: _Entity = new _Entity();

	ngOnInit(): void {
		this.ActivatedRoute.params.subscribe(params => {
			if (!params['id']) {
				//создание новой сущности
				this.entity = new _Entity();
				return;
			}

			var id: number = parseInt(params['id']);

			this._entityService.getById(id).subscribe((entity: _Entity) => {
				this.entity = entity;
			}, (error) => this.handleError(error));
		});
	}

	saveEntity(): void {
		this._entityService.save(this.entity).subscribe((entity: _EntityBase) => {
			this.entity.id = entity.id;
			this.Location.back();
		}, (error) => this.handleError(error));
	}

	goBack(): void {
		this.Location.back();
	}
}