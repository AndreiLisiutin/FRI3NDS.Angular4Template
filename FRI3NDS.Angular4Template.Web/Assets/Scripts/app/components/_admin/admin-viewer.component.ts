import { Component } from '@angular/core';
import { OnInit, ViewChild } from '@angular/core';
import { MdSidenav } from "@angular/material";
import { TranslateService } from "@ngx-translate/core";
import { AuthenticationService } from "services/authentication.service";
import { Router } from "@angular/router";
import { ToastService } from "services/toast.service";
import { _EntityService } from "services/_admin/_entity.service";
import { _Entity } from "models/domain/_Entity";
import { _GenericEntityService } from "services/_admin/_generic-entity.service";
import { _GenericEntity } from "models/business/_GenericEntity";
import { Observable } from 'rxjs/Rx';
import { _FieldService } from "services/_admin/_field.service";
import { _FieldFilter } from "models/viewModels/_FieldViewModels";
import { _Field } from "models/domain/_Field";
import { _GenericEntityField } from "models/business/_GenericEntityField";
import { _GenericEntityFilter } from "models/viewModels/_GenericEntityViewModels";
import { ConvertService } from "services/utils/convert.service";
import { ITdDataTableSortChangeEvent, TdDataTableSortingOrder, IPageChangeEvent, TdPagingBarComponent } from "@covalent/core";

@Component({
	selector: 'admin-viewer',
	providers: [],
	moduleId: module.id,
	templateUrl: 'admin-viewer.component.html',
	styleUrls: ['admin-viewer.component.css']
})
export class AdminViewerComponent implements OnInit {

	constructor(
		private _entityService: _EntityService,
		private _fieldService: _FieldService,
		private notificationService: ToastService,
		private _genericEntityService: _GenericEntityService,
		private convertService: ConvertService,
		private router: Router
	) {
	}

	@ViewChild('pagingBar') viewPagingBar: TdPagingBarComponent;

	private entities: _Entity[];
	private currentEntityId: number;

	private fields: {
		list?: _Field[],
		entityInstanceFieldsList?: any[],
	} = {
	};

	private entityInstances: {
		list?: any[],
		pageSize?: number,
		pageNumber?: number,
		selectedEntityId: any[],
		sort_FieldId?: number,
		sortBy?: string,
		sortingOrder?: TdDataTableSortingOrder,
		count?: number,
		rowCompareFunction: Function
	} = {
		pageSize: 10,
		pageNumber: 1,
		rowCompareFunction: (row: any, model: any) => {
			var rowId = this.getEntityInstanceIdenty(row);
			var modelId = this.getEntityInstanceIdenty(model);

			return rowId && modelId && rowId == modelId;
		},
		selectedEntityId: []
	};

	private getEntityInstanceFieldName(fieldId: number): string {
		return 'f_' + fieldId;
	}
	private getEntityInstanceFieldId(fieldName: string): number {
		return parseInt(fieldName.substr(2));
	}
	private getEntityInstanceIdenty(entityInstance: any): any {
		var identityFields = this.fields.list.filter(f => f.isIdentity);
		if (identityFields.length == 0) {
			return false;
		}
		var identityFieldName = this.getEntityInstanceFieldName(identityFields[0].id);
		return entityInstance[identityFieldName];
	}

	ngOnInit(): void {
		this._entityService.query().subscribe((entities) => {
			this.entities = entities;
		}, (error) => {
			this.notificationService.error('Ошибка', error.text && error.text() || 'Ошибка.');
		});
	}

	onShowEntityInstancesClick(entityId: number): void {
		this.currentEntityId = entityId;

		this.entityInstances.sortingOrder = null;
		this.entityInstances.selectedEntityId = [];
		this.viewPagingBar.navigateToPage(1);
		this.entityInstances.sort_FieldId = null;
		this.entityInstances.count = 0;

		this.loadFields();
		this.loadEntityInstances();
		this.countEntityInstances();
	}

	onTableSortChange(sortEvent: ITdDataTableSortChangeEvent): void {
		this.entityInstances.sortBy = sortEvent.name;
		this.entityInstances.sortingOrder = sortEvent.order;
		this.entityInstances.sort_FieldId = this.getEntityInstanceFieldId(sortEvent.name.substr(2));
		this.loadEntityInstances();
	}

	onTablePageChange(pagingEvent: IPageChangeEvent): void {
		this.entityInstances.pageNumber = pagingEvent.page;
		this.entityInstances.pageSize = pagingEvent.pageSize;
		this.loadEntityInstances();
	}

	loadEntityInstances(): void {
		this._genericEntityService.getEntitiesList(new _GenericEntityFilter({
			_EntityId: this.currentEntityId,
			sort_FieldId: this.entityInstances.sort_FieldId,
			sortDirection: this.convertService.sortingOrderToSortDirection(this.entityInstances.sortingOrder),
			pageNumber: this.entityInstances.pageNumber - 1,
			pageSize: this.entityInstances.pageSize || null
		})).subscribe((entities) => {
			this.entityInstances.list = entities.map(entity => {
				var anyEntity: any = entity;
				entity.fields.forEach(f => {
					anyEntity[this.getEntityInstanceFieldName(f.fieldId)] = f.value;
				});
				return anyEntity;
			});
		}, (error) => {
			this.notificationService.error('Ошибка', error.text && error.text() || 'Ошибка.');
		});
	}

	countEntityInstances(): void {
		this._genericEntityService.getEntitiesCount(new _GenericEntityFilter({
			_EntityId: this.currentEntityId
		})).subscribe((count: number) => {
			this.entityInstances.count = count;
		}, (error) => {
			this.notificationService.error('Ошибка', error.text && error.text() || 'Ошибка.');
		});
	}

	loadFields(): void {
		this._fieldService.query(new _FieldFilter({
			_EntityId: this.currentEntityId
		})).subscribe((fields: _Field[]) => {
			this.fields.list = fields;
			this.fields.entityInstanceFieldsList = this.fields.list.map(f => {
				return {
					name: this.getEntityInstanceFieldName(f.id),
					label: f.name
				};
			});
		}, (error) => {
			this.notificationService.error('Ошибка', error.text && error.text() || 'Ошибка.');
		});
	}

	goToForm() {
		if (this.entityInstances.selectedEntityId.length != 1) {
			this.notificationService.error('Ошибка', 'Выберите сущность для редактирования.');
			return;
		}

		var entityInstanceId = this.getEntityInstanceIdenty(this.entityInstances.selectedEntityId[0]);
		var formId = 1;

		this.router.navigate(['admin/viewer/form', formId, entityInstanceId]);
	}
}