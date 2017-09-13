import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from "app/services/authentication.service";
import { _EntityService } from "app/services/_admin/_entity.service";
import { _Entity } from "app/models/domain/_Entity";
import { _FormFieldService } from "app/services/_admin/_form-field.service";
import { _FormService } from "app/services/_admin/_form.service";
import { _FormFieldFilter } from "app/models/viewModels/_FormFieldViewModels";
import { _FormField } from "app/models/domain/_FormField";
import { _Form } from "app/models/domain/_Form";
import { _FieldTypes } from "app/models/enums/_FieldTypes";
import { _GenericEntityService } from "app/services/_admin/_generic-entity.service";
import { _GenericEntity } from "app/models/business/_GenericEntity";
import { BaseComponent } from "app/components/base.component";
import { ActivatedRoute } from "@angular/router";
import { _FieldService } from "app/services/_admin/_field.service";
import { _FieldFilter } from "app/models/viewModels/_FieldViewModels";
import { _Field } from "app/models/domain/_Field";
import { _GenericEntityField } from "app/models/business/_GenericEntityField";

@Component({
	selector: 'admin-generic-entity-form',
	templateUrl: 'admin-generic-entity-form.component.html',
	styleUrls: ['admin-generic-entity-form.component.scss']
})
export class AdminGenericEntityFormComponent extends BaseComponent implements OnInit {

	constructor(
		private ActivatedRoute: ActivatedRoute,
		private formFieldService: _FormFieldService,
		private genericEntityService: _GenericEntityService,
		private formService: _FormService,
		private fileldService: _FieldService,
	) {
		super();
	}

	private formId: number;
	private entityInstanceId: number;

	private formFields: _FormField[];
	private form: _Form;
	private entityInstance: _GenericEntity;
	private entityInstanceModel = {};
	private formRows: any[] = [];

	private getEntityInstanceFieldName(fieldId: number): string {
		return 'f_' + fieldId;
	}
	private getEntityInstanceFieldId(fieldName: string): number {
		return parseInt(fieldName.substr(2));
	}

	ngOnInit(): void {
		this.ActivatedRoute.params.subscribe(params => {
			if (!params['formId']) {
				//создание нового поля
				this.NotificationService.error('Ошибка', 'Не задан идентификатор формы.');
				return;
			}

			this.formId = parseInt(params['formId']);
			this.entityInstanceId = parseInt(params['entityInstanceId']) || 0;

			this.loadEntityInstance();
			this.loadFormFields();
		});

	}

	loadFormFields(): void {
		this.formFieldService.query(new _FormFieldFilter({
			_FormId: this.formId
		})).subscribe((fields: _FormField[]) => {
			this.formFields = fields;
			this.formRows = this.getFormRows();
		}, (error) => this.handleError(error));
	}

	loadEntityInstance(): void {
		this.formService.getById(this.formId).subscribe((form: _Form) => {
			this.form = form;
			var entityId: number = form._EntityId;

			if (this.entityInstanceId) {
				this.genericEntityService.getEntitiyInstance(entityId, this.entityInstanceId).subscribe((entityInstance: _GenericEntity) => {
					this.entityInstance = entityInstance;
					this.fillEntityInstanceModel();
				}, (error) => this.handleError(error));
			} else {
				this.fileldService.query(new _FieldFilter({
					_EntityId: entityId
				})).subscribe((fields: _Field[]) => {
					this.entityInstance = new _GenericEntity({
						entityId: entityId,
						fields: fields.map(f => new _GenericEntityField({
							fieldId: f.id,
							_FieldTypeId: f._FieldTypeId,
							value: null
						}))
					});
					this.fillEntityInstanceModel();
				}, (error) => this.handleError(error));
			}
		}, (error) => this.handleError(error));
	}

	fillEntityInstanceModel(): void {
		this.entityInstance.fields.forEach(f => {
			var fieldName = this.getEntityInstanceFieldName(f.fieldId);
			var fieldValue = this.ConvertService.deserialize(f.value, f._FieldTypeId);
			this.entityInstanceModel[fieldName] = fieldValue;
		});
	}

	isFieldDate(fieldTypeId: number): boolean {
		return fieldTypeId == _FieldTypes.DateTime;
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

	saveForm(): void {
		this.entityInstance.fields.forEach(f => {
			var fieldName = this.getEntityInstanceFieldName(f.fieldId);
			var fildValuue = this.entityInstanceModel[fieldName];
			var serializedValue = this.ConvertService.serialize(fildValuue, f._FieldTypeId);
			f.value = serializedValue;
		});

		this.genericEntityService.saveEntitiyInstance(this.entityInstance).subscribe((field: number) => {
			this.Location.back();
		}, (error) => this.handleError(error));
	}

	goBack(): void {
		this.Location.back();
	}
}