import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from "app/services/authentication.service";
import { _EntityService } from "app/services/_admin/_entity.service";
import { _Entity, _EntityBase } from "app/models/domain/_Entity";
import { Observable } from "rxjs/Observable";
import { _FieldService } from "app/services/_admin/_field.service";
import { _FieldFilter } from "app/models/viewModels/_FieldViewModels";
import { _Field, _FieldBase } from "app/models/domain/_Field";
import { BaseComponent } from "app/components/base.component";
import { ActivatedRoute } from "@angular/router";
import { SortDirections } from "app/models/enums/SortDirections";

@Component({
	selector: 'admin-entity',
	templateUrl: 'admin-entity.component.html',
	styleUrls: ['admin-entity.component.scss']
})
export class AdminEntityComponent extends BaseComponent implements OnInit {

	constructor(
		private ActivatedRoute: ActivatedRoute,
		private _entityService: _EntityService,
		private _fieldService: _FieldService
	) {
		super();
	}

	private entity: _Entity = new _Entity();
	private entityId: number;

	private fields: {
		list?: _Field[],
		count?: number
		selectedField?: _Field,
		sortBy?: string,
		sortingOrder?: SortDirections,
		pageSize?: number,
		pageNumber?: number,
	} = {
		pageSize: 10,
		pageNumber: 0,
		count: 0,
		list: [],
		selectedField: null
	};


	ngOnInit(): void {
		this.ActivatedRoute.params.subscribe(params => {
			if (!params['id']) {
				//создание новой сущности
				this.entity = new _Entity();
				return;
			}

			this.entityId = parseInt(params['id']);

			this.loadEntity();
			this.loadFields();
			this.countFields();
		});
	}

	onSort(sortEvent: { field: string, order: number }): void {
		this.fields.sortBy = sortEvent.field;
		this.fields.sortingOrder = sortEvent.order;
		this.fields.pageNumber = 0;
		this.loadFields();
	}

	onPage(e: { first: number, rows: number }) {
		this.fields.pageNumber = e.first / e.rows;
		this.fields.pageSize = e.rows;
		this.loadFields();
	}
	
	loadFields(): void {
		this._fieldService.query(new _FieldFilter({
			_EntityId: this.entityId,
			pageNumber: this.fields.pageNumber,
			pageSize: this.fields.pageSize,
			sortDirection: this.fields.sortingOrder,
			sortField: this.fields.sortBy
		})).subscribe((entities) => {
			this.fields.list = entities;
		}, (error) => this.handleError(error));
	}

	countFields(): void {
		this._fieldService.count(new _FieldFilter({
			_EntityId: this.entityId
		})).subscribe((count: number) => {
			this.fields.count = count;
		}, (error) => this.handleError(error));
	}

	loadEntity(): void {
		this._entityService.getById(this.entityId).subscribe((entity: _Entity) => {
			this.entity = entity;
		}, (error) => this.handleError(error));
	}

	goEditEntity(): void {
		this.ReverseRouter.editEntity(this.entity.id);
	}

	goViewField(): void {
		if (this.fields.selectedField == null) {
			this.NotificationService.error('Ошибка', 'Выберите поле для редактирования.');
			return;
		}
		this.ReverseRouter.field(this.fields.selectedField.id);
	}

	goCreateField(): void {
		this.ReverseRouter.newField(this.entity.id);
	}

	deleteField(): void {
		if (this.fields.selectedField == null) {
			this.NotificationService.error('Ошибка', 'Выберите поле для удаления.');
			return;
		}
		this._fieldService.delete(this.fields.selectedField.id).subscribe((fieldId: number) => {
			this.fields.list = this.fields.list.filter(f => f.id != fieldId);
			this.fields.count--;
		}, (error) => this.handleError(error));
	}

	goBack(): void {
		this.Location.back();
	}
}