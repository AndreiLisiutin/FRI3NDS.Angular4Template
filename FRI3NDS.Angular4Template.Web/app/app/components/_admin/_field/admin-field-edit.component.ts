﻿import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from "app/services/authentication.service";
import { _EntityService } from "app/services/_admin/_entity.service";
import { _Entity, _EntityBase } from "app/models/domain/_Entity";
import { Observable } from "rxjs/Observable";
import { _FieldService } from "app/services/_admin/_field.service";
import { _FieldFilter } from "app/models/viewModels/_FieldViewModels";
import { _Field, _FieldBase } from "app/models/domain/_Field";
import { _FieldType } from "app/models/domain/_FieldType";
import { BaseComponent } from "app/components/base.component";
import { ActivatedRoute } from "@angular/router";

@Component({
	selector: 'admin-field-edit',
	templateUrl: 'admin-field-edit.component.html',
	styleUrls: ['admin-field-edit.component.scss']
})
export class AdminFieldEditComponent extends BaseComponent implements OnInit {

	constructor(
		private ActivatedRoute: ActivatedRoute,
		private _fieldService: _FieldService
	) {
		super();
	}

	private field: _Field = new _Field();
	private fieldTypes: _FieldType[] = [];

	ngOnInit(): void {
		this.ActivatedRoute.params.subscribe(params => {
			if (!params['id']) {
				//создание нового поля
				this.field = new _Field();
				if (!params['entityId']) {
					this.NotificationService.error('Ошибка', 'Не задана сущность для нового поля.');
				}
				this.field._EntityId = parseInt(params['entityId']);
				return;
			}

			var id: number = parseInt(params['id']);

			this._fieldService.getById(id).subscribe((field: _Field) => {
				this.field = field;
			}, (error) => this.handleError(error));
		});

		this._fieldService.GetFieldTypes().subscribe((fieldTypes: _FieldType[]) => {
			fieldTypes.forEach(x => {
				(x as any).label = x.name;
				(x as any).value = x.id;
			});
			this.fieldTypes = fieldTypes;
		}, (error) => this.handleError(error));
	}

	saveField(): void {
		this._fieldService.save(this.field).subscribe((field: _FieldBase) => {
			this.field.id = field.id;
			this.Location.back();
		}, (error) => this.handleError(error));
	}

	goBack(): void {
		this.Location.back();
	}
}