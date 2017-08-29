import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from "services/authentication.service";
import { _EntityService } from "services/_admin/_entity.service";
import { _Entity, _EntityBase } from "models/domain/_Entity";
import { Observable } from "rxjs/Observable";
import { _FieldService } from "services/_admin/_field.service";
import { _FieldFilter } from "models/viewModels/_FieldViewModels";
import { _Field } from "models/domain/_Field";
import { BaseComponent } from "components/base.component";
import { ActivatedRoute } from "@angular/router";

@Component({
	selector: 'admin-field',
	providers: [],
	moduleId: module.id,
	templateUrl: 'admin-field.component.html',
	styleUrls: ['admin-field.component.css']
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
			}, this.handleError);
		});
	}

	goEditField(): void {
		this.Router.navigate(['/admin/entity/field', this.field.id, 'edit']);
	}

	goBack(): void {
		this.Location.back();
	}
}