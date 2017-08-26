import { Component } from '@angular/core';
import { OnInit, ViewChild } from '@angular/core';
import { MdSidenav, MdSort, MdPaginator } from "@angular/material";
import { TranslateService } from "@ngx-translate/core";
import { AuthenticationService } from "services/authentication.service";
import { Router, ActivatedRoute } from "@angular/router";
import { ToastService } from "services/toast.service";
import { _EntityService } from "services/_admin/_entity.service";
import { _Entity, _EntityBase } from "models/domain/_Entity";
import { DataSource } from "@angular/cdk";
import { Observable } from "rxjs/Observable";
import { Location } from '@angular/common';
import { _FieldService } from "services/_admin/_field.service";
import { _FieldFilter } from "models/viewModels/_FieldViewModels";
import { _Field, _FieldBase } from "models/domain/_Field";
import { TdDataTableSortingOrder, ITdDataTableSortChangeEvent, IPageChangeEvent } from "@covalent/core";
import { ConvertService } from "services/utils/convert.service";

@Component({
	selector: 'admin-entity',
	providers: [],
	moduleId: module.id,
	templateUrl: 'admin-entity.component.html',
	styleUrls: ['admin-entity.component.css']
})
export class AdminEntityComponent implements OnInit {

	constructor(
		private _entityService: _EntityService,
		private _fieldService: _FieldService,
		private notificationService: ToastService,
		private convertService: ConvertService,
		private route: ActivatedRoute,
		private _location: Location,
		private router: Router
	) {
	}

	private entity: _Entity = new _Entity();
	private entityId: number;

	private fields: {
		list?: _Field[],
		count?: number
		selectedFieldId?: any[],
		sortBy?: string,
		sortingOrder?: TdDataTableSortingOrder,
		pageSize?: number,
		pageNumber?: number,
		rowCompareFunction: Function
	} = {
		pageSize: 1,
		pageNumber: 1,
		count: 0,
		rowCompareFunction: (row: any, model: any) => row.id == model.id,
		selectedFieldId: []
	};


	ngOnInit(): void {
		this.route.params.subscribe(params => {
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

	onTableSortChange(sortEvent: ITdDataTableSortChangeEvent): void {
		this.fields.sortBy = sortEvent.name;
		this.fields.sortingOrder = sortEvent.order;
		this.loadFields();
	}

	onTablePageChange(pagingEvent: IPageChangeEvent): void {
		this.fields.pageNumber = pagingEvent.page;
		this.fields.pageSize = pagingEvent.pageSize;
		this.loadFields();
	}

	loadFields(): void {
		this._fieldService.query(new _FieldFilter({
			_EntityId: this.entityId,
			pageNumber: this.fields.pageNumber - 1,
			pageSize: this.fields.pageSize,
			sortDirection: this.convertService.sortingOrderToSortDirection(this.fields.sortingOrder),
			sortField: this.fields.sortBy
		})).subscribe((entities) => {
			this.fields.list = entities;
		}, (error) => {
			this.notificationService.error('Ошибка', error.text && error.text() || 'Ошибка.');
		});
	}

	countFields(): void {
		this._fieldService.count(new _FieldFilter({
			_EntityId: this.entityId
		})).subscribe((count: number) => {
			this.fields.count = count;
		}, (error) => {
			this.notificationService.error('Ошибка', error.text && error.text() || 'Ошибка.');
		});
	}

	loadEntity(): void {
		this._entityService.getById(this.entityId).subscribe((entity: _Entity) => {
			this.entity = entity;
		}, (error) => {
			this.notificationService.error('Ошибка', error.text && error.text() || 'Ошибка.');
		});
	}

	goEditEntity(): void {
		this.router.navigate(['/admin/entity', this.entity.id, 'edit']);
	}

	goViewField(): void {
		if (this.fields.selectedFieldId.length != 1) {
			this.notificationService.error('Ошибка', 'Выберите поле для редактирования.');
			return;
		}
		this.router.navigate(['/admin/entity/field', this.fields.selectedFieldId[0].id]);
	}

	goCreateField(): void {
		this.router.navigate(['/admin/entity/field/new/', this.entity.id]);
	}

	deleteField(): void {
		if (this.fields.selectedFieldId.length != 1) {
			this.notificationService.error('Ошибка', 'Выберите поле для удаления.');
			return;
		}
		this._fieldService.delete(this.fields.selectedFieldId[0].id).subscribe((fieldId: number) => {
			this.fields.list = this.fields.list.filter(f => f.id != fieldId);
			this.fields.count--;
		}, (error) => {
			this.notificationService.error('Ошибка', error.text && error.text() || 'Ошибка.');
		});
	}

	goBack(): void {
		this._location.back();
	}
}