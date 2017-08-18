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
import { IDatatableSortEvent, IDatatablePaginationEvent } from "ng2-md-datatable";
import { _GenericEntityFilter } from "models/viewModels/_GenericEntityViewModels";

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
		private router: Router
	) {
	}

	private entities: _Entity[];
	private currentEntityId: number;
	private fields: _Field[];

	private entityInstances: {
		list?: _GenericEntity[],
		pageSize?: number,
		pageNumber?: number,
		sort_FieldId?: number,
		sortDirection?: number,
		count?: number
	} = {
		pageSize: 10,
		pageNumber: 1
	};

	ngOnInit(): void {
		this._entityService.query().subscribe((entities) => {
			this.entities = entities;
		}, (error) => {
			this.notificationService.error('Ошибка', error.text && error.text() || 'Ошибка.');
		});
	}

	getEntityInstanceValue(fieldId: number, entityInstance: _GenericEntity) {
		var field: _GenericEntityField = entityInstance.fields.filter(x => x.fieldId == fieldId)[0];
		return field ? field.value : null;
	}

	onEntityInstancesStateChange(sortEvent: IDatatableSortEvent, pageEvent: IDatatablePaginationEvent): void {
		if (sortEvent != null) {
			if (!sortEvent.sortType) {
				this.entityInstances.sort_FieldId = null;
				this.entityInstances.sortDirection = null;
			} else {
				this.entityInstances.sort_FieldId = parseInt(sortEvent.sortBy.substring(2));
				this.entityInstances.sortDirection = sortEvent.sortType;
			}
			this.entityInstances.pageNumber = 1;
		} else if (pageEvent != null) {
			this.entityInstances.pageNumber = pageEvent.page;
			this.entityInstances.pageSize = pageEvent.itemsPerPage;
		}
		this.loadEntityInstances(this.currentEntityId);
	}

	loadEntityInstances(entityId: number): void {
		this.currentEntityId = entityId;
		if (!entityId) {
			return;
		}

		Observable.forkJoin(
			this._genericEntityService.getEntitiesList(new _GenericEntityFilter({
				_EntityId: entityId,
				sort_FieldId: this.entityInstances.sort_FieldId,
				sortDirection: this.entityInstances.sortDirection,
				pageNumber: this.entityInstances.pageNumber - 1,
				pageSize: this.entityInstances.pageSize || null
			})),
			this._genericEntityService.getEntitiesCount(new _GenericEntityFilter({
				_EntityId: entityId
			})),
			this._fieldService.query(new _FieldFilter({ _EntityId: entityId }))
		).subscribe((results: [_GenericEntity[], number, _Field[]]) => {
			this.entityInstances.list = results[0];
			this.entityInstances.count = results[1];
			this.fields = results[2];
		}, (error) => {
			this.notificationService.error('Ошибка', error.text && error.text() || 'Ошибка.');
		});
	}

	goToForm(entity: _GenericEntity) {
		if (!entity) {
			return;
		}
		var formId = 1;
		var entityInstanceId = 1;

		this.router.navigate(['admin/viewer/form', formId, entityInstanceId]);
	}
}