import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from "app/services/authentication.service";
import { _EntityService } from "app/services/_admin/_entity.service";
import { _Entity } from "app/models/domain/_Entity";
import { _GenericEntityService } from "app/services/_admin/_generic-entity.service";
import { _GenericEntity } from "app/models/business/_GenericEntity";
import { Observable } from 'rxjs/Rx';
import { _FieldService } from "app/services/_admin/_field.service";
import { _FieldFilter } from "app/models/viewModels/_FieldViewModels";
import { _Field } from "app/models/domain/_Field";
import { _GenericEntityField } from "app/models/business/_GenericEntityField";
import { _GenericEntityFilter } from "app/models/viewModels/_GenericEntityViewModels";
import { ConvertService } from "app/services/utils/convert.service";
import { BaseComponent } from "app/components/base.component";
import { ActivatedRoute } from "@angular/router";
import { SortDirections } from "app/models/enums/SortDirections";

@Component({
	selector: 'admin-viewer-entity-instances',
	templateUrl: 'admin-viewer-entity-instances.component.html',
	styleUrls: ['admin-viewer-entity-instances.component.scss']
})
export class AdminViewerEntityInstancesComponent extends BaseComponent implements OnInit {

	constructor(
		private ActivatedRoute: ActivatedRoute,
		private _entityService: _EntityService,
		private _fieldService: _FieldService,
		private _genericEntityService: _GenericEntityService,
	) {
		super();
	}

	private entities: _Entity[];
	private currentEntityId: number;

	private fields: {
		list?: _Field[],
		identityField?: _Field,
		identityEntityInstanceFieldName?: string
	} = {
		list: [],
		identityField: null,
		identityEntityInstanceFieldName: null
	};

	private entityInstances: {
		list?: any[],
		pageSize?: number,
		pageNumber?: number,
		selectedEntityInstance: any,
		sort_FieldId?: number,
		sortBy?: string,
		sortingOrder?: SortDirections,
		count?: number
	} = {
		pageSize: 10,
		pageNumber: 0,
		count: 0,
		selectedEntityInstance: null
	};

	private getEntityInstanceFieldName(fieldId: number): string {
		return 'f_' + fieldId;
	}
	private getEntityInstanceFieldId(fieldName: string): number {
		return parseInt(fieldName.substr(2));
	}
	private getEntityInstanceIdenty(entityInstance: any): any {
		if (this.fields.identityEntityInstanceFieldName == null) {
			return false;
		}
		return entityInstance[this.fields.identityEntityInstanceFieldName];
	}

	ngOnInit(): void {
		this.ActivatedRoute.params.subscribe(params => {
			if (!params['entityId']) {
				this.NotificationService.error('Ошибка', 'Не задан тип сущностей.');
				return;
			}

			this.currentEntityId = parseInt(params['entityId']);
			
			this.loadFields();
			this.loadEntityInstances();
			this.countEntityInstances();
		});
	}

	onSort(sortEvent: { field: string, order: number }): void {
		this.entityInstances.sortBy = sortEvent.field;
		this.entityInstances.sortingOrder = sortEvent.order;
		this.entityInstances.sort_FieldId = this.getEntityInstanceFieldId(sortEvent.field);
		this.entityInstances.pageNumber = 0;
		this.loadEntityInstances();
	}

	onPage(pageEvent: { first: number, rows: number }) {
		this.entityInstances.pageNumber = pageEvent.first / pageEvent.rows;
		this.entityInstances.pageSize = pageEvent.rows;
		this.loadEntityInstances();
	}


	loadEntityInstances(): void {
		this._genericEntityService.getEntitiesList(new _GenericEntityFilter({
			_EntityId: this.currentEntityId,
			sort_FieldId: this.entityInstances.sort_FieldId,
			sortDirection: this.entityInstances.sortingOrder,
			pageNumber: this.entityInstances.pageNumber,
			pageSize: this.entityInstances.pageSize || null
		})).subscribe((entities) => {
			this.entityInstances.list = entities.map(entity => {
				var anyEntity: any = entity;
				entity.fields.forEach(f => {
					anyEntity[this.getEntityInstanceFieldName(f.fieldId)] = f.value;
				});
				return anyEntity;
			});
		}, (error) => this.handleError(error));
	}

	countEntityInstances(): void {
		this._genericEntityService.getEntitiesCount(new _GenericEntityFilter({
			_EntityId: this.currentEntityId
		})).subscribe((count: number) => {
			this.entityInstances.count = count;
		}, (error) => this.handleError(error));
	}

	loadFields(): void {
		this._fieldService.query(new _FieldFilter({
			_EntityId: this.currentEntityId
		})).subscribe((fields: _Field[]) => {
			this.fields.list = fields;
			this.fields.identityField = fields.filter(f => f.isIdentity)[0];
			this.fields.identityEntityInstanceFieldName = this.getEntityInstanceFieldName(this.fields.identityField.id);
		}, (error) => this.handleError(error));
	}

	goEditForm() {
		if (this.entityInstances.selectedEntityInstance == null) {
			this.NotificationService.error('Ошибка', 'Выберите сущность для редактирования.');
			return;
		}

		var entityInstanceId = this.getEntityInstanceIdenty(this.entityInstances.selectedEntityInstance);
		var formId = 1;
		
		this.ReverseRouter.entityInstance(formId, entityInstanceId);
	}

	goCreateForm() {
		var entityInstanceId = 0;
		var formId = 1;

		this.ReverseRouter.entityInstance(formId, entityInstanceId);
	}

	deleteEntityInstance(): void {
		this.NotificationService.alert('', 'В разработке.');
	}
}