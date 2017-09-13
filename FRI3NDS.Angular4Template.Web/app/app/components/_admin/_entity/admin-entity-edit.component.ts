import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from "app/services/authentication.service";
import { _EntityService } from "app/services/_admin/_entity.service";
import { _Entity, _EntityBase } from "app/models/domain/_Entity";
import { Observable } from "rxjs/Observable";
import { BaseComponent } from "app/components/base.component";
import { ActivatedRoute } from "@angular/router";

@Component({
	selector: 'admin-entity-edit',
	templateUrl: 'admin-entity-edit.component.html',
	styleUrls: ['admin-entity-edit.component.scss']
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