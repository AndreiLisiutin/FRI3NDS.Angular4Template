import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from "app/services/authentication.service";
import { _EntityService } from "app/services/_admin/_entity.service";
import { _Entity, _EntityBase } from "app/models/domain/_Entity";
import { Observable } from "rxjs/Observable";
import { _FieldService } from "app/services/_admin/_field.service";
import { _FieldFilter } from "app/models/viewModels/_FieldViewModels";
import { _Field } from "app/models/domain/_Field";
import { BaseComponent } from "app/components/base.component";
import { ActivatedRoute } from "@angular/router";

@Component({
	selector: 'admin-field',
	templateUrl: 'admin-field.component.html',
	styleUrls: ['admin-field.component.scss']
})
export class AdminFieldComponent extends BaseComponent implements OnInit {

	constructor(
		private ActivatedRoute: ActivatedRoute,
		private _fieldService: _FieldService
	) {
		super();
	}

	private field: _Field = new _Field();

	ngOnInit(): void {
		this.ActivatedRoute.params.subscribe(params => {
			if (!params['id']) {
				//создание нового поля
				this.field = new _Field();
				return;
			}

			var id: number = parseInt(params['id']);

			this._fieldService.getById(id).subscribe((field: _Field) => {
				this.field = field;
			}, (error) => this.handleError(error));
		});
	}

	goEditField(): void {
		this.ReverseRouter.editField(this.field.id);
	}

	goBack(): void {
		this.Location.back();
	}
}