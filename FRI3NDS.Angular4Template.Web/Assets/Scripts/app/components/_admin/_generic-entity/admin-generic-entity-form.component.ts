import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from "services/authentication.service";
import { _EntityService } from "services/_admin/_entity.service";
import { _Entity } from "models/domain/_Entity";
import { _FormFieldService } from "services/_admin/_form-field.service";
import { _FormService } from "services/_admin/_form.service";
import { _FormFieldFilter } from "models/viewModels/_FormFieldViewModels";
import { _FormField } from "models/domain/_FormField";
import { _Form } from "models/domain/_Form";
import { _FieldTypes } from "models/enums/_FieldTypes";
import { _GenericEntityService } from "services/_admin/_generic-entity.service";
import { _GenericEntity } from "models/business/_GenericEntity";
import { BaseComponent } from "components/base.component";
import { ActivatedRoute } from "@angular/router";
import { _FieldService } from "services/_admin/_field.service";
import { _FieldFilter } from "models/viewModels/_FieldViewModels";
import { _Field } from "models/domain/_Field";
import { _GenericEntityField } from "models/business/_GenericEntityField";

@Component({
	selector: 'admin-generic-entity-form',
	providers: [],
	moduleId: module.id,
	templateUrl: 'admin-generic-entity-form.component.html',
	styleUrls: ['admin-generic-entity-form.component.css']
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