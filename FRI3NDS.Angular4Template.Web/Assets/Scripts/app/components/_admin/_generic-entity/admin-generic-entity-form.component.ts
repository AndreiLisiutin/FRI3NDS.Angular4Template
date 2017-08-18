import { Component } from '@angular/core';
import { OnInit, ViewChild } from '@angular/core';
import { MdSidenav } from "@angular/material";
import { TranslateService } from "@ngx-translate/core";
import { AuthenticationService } from "services/authentication.service";
import { Router, ActivatedRoute } from "@angular/router";
import { ToastService } from "services/toast.service";
import { _EntityService } from "services/_admin/_entity.service";
import { _Entity } from "models/domain/_Entity";
import { _FormFieldService } from "services/_admin/_form-field.service";
import { _FormService } from "services/_admin/_form.service";
import { _FormFieldFilter } from "models/viewModels/_FormFieldViewModels";
import { _FormField } from "models/domain/_FormField";
import { _Form } from "models/domain/_Form";
import { Location } from '@angular/common';
import { _FieldTypes } from "models/enums/_FieldTypes";
import { _GenericEntityService } from "services/_admin/_generic-entity.service";
import { _GenericEntity } from "models/business/_GenericEntity";

@Component({
	selector: 'admin-generic-entity-form',
	providers: [],
	moduleId: module.id,
	templateUrl: 'admin-generic-entity-form.component.html',
	styleUrls: ['admin-generic-entity-form.component.css']
})
export class AdminGenericEntityFormComponent implements OnInit {

	constructor(
		private notificationService: ToastService,
		private formFieldService: _FormFieldService,
		private genericEntityService: _GenericEntityService,
		private formService: _FormService,
		private _location: Location,
		private route: ActivatedRoute,
		private router: Router
	) {
	}
	
	private formFields: _FormField[];
	private form: _Form;
	private entityInstance: _GenericEntity;
	private entityInstanceModel;

	ngOnInit(): void {
		this.entityInstanceModel = {
			f_1: 'hello'
		};

		this.route.params.subscribe(params => {
			if (!params['formId']) {
				//создание нового поля
				this.notificationService.error('Ошибка', 'Не задан идентификатор формы.');
				return;
			}
			if (!params['entityInstanceId']) {
				//создание нового поля
				this.notificationService.error('Ошибка', 'Не задан идентификатор экземпляра сущности.');
				return;
			}

			var formId: number = parseInt(params['formId']);
			var entityInstanceId: number = parseInt(params['entityInstanceId']);


			this.formService.getById(formId).subscribe((form: _Form) => {
				this.form = form;

				//this.genericEntityService.getEntitiyInstance(form._EntityId, entityInstanceId).subscribe((entityInstance: _GenericEntity) => {
				//	debugger;
				//	this.entityInstance = entityInstance;
				//	//this.entityInstance.fields.forEach(f => this.entityInstanceModel["f_" + f.fieldId] = f.value);
				//}, (error) => {
				//	this.notificationService.error('Ошибка', error.text && error.text() || 'Ошибка.');
				//});

			}, (error) => {
				this.notificationService.error('Ошибка', error.text && error.text() || 'Ошибка.');
			});

			this.formFieldService.query(new _FormFieldFilter({
				_FormId: formId
			})).subscribe((fields: _FormField[]) => {
				this.formFields = fields;
			}, (error) => {
				this.notificationService.error('Ошибка', error.text && error.text() || 'Ошибка.');
			});
		});
	}

	isFieldDate(_formFieldId: number): boolean {
		return _formFieldId == _FieldTypes.DateTime;
	}

	getWidthPerRow(): number {
		var minColumn = 0;
		var maxColumn = Math.max(...this.formFields.map(f => f.column + f.length));
		return maxColumn - minColumn;
	}

	getFormRows(): any[] {
		if (!this.formFields || !this.formFields.length) {
			return [];
		}
		var minRow = 0;
		var maxRow = Math.max(...this.formFields.map(f => f.row));
		var formRows: any[] = [];
		for (var row = minRow; row <= maxRow; row++) {
			var formRow = {
				fields: this.formFields
					.filter(f => f.row == row)
					.sort((a, b) => a.column - b.column)
			};
			formRows.push(formRow);
		}
		return formRows;
	}

	saveField(): void {
		//this._fieldService.save(this.field).subscribe((field: _FieldBase) => {
		//	this.field.id = field.id;
		//	this._location.back();
		//}, (error) => {
		//	this.notificationService.error('Ошибка', error.text && error.text() || 'Ошибка.');
		//});
	}

	goBack(): void {
		this._location.back();
	}
}