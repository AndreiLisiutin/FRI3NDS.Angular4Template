import { Component } from '@angular/core';
import { OnInit, ViewChild } from '@angular/core';
import { MdSidenav, MdSort, MdPaginator } from "@angular/material";
import { TranslateService } from "@ngx-translate/core";
import { AuthenticationService } from "services/authentication.service";
import { Router } from "@angular/router";
import { ToastService } from "services/toast.service";
import { _EntityService } from "services/_admin/_entity.service";
import { _Entity, _EntityBase } from "models/domain/_Entity";
import { DataSource } from "@angular/cdk";
import { Observable } from "rxjs/Observable";
import { ITdDataTableSortChangeEvent, TdDataTableSortingOrder, IPageChangeEvent } from "@covalent/core";
import { SortDirections } from "models/enums/SortDirections";
import { _EntityFilter } from "models/viewModels/_EntityViewModels";
import { ConvertService } from "services/utils/convert.service";
import { BaseComponent } from "components/base.component";

@Component({
	selector: 'admin-entities',
	providers: [],
	moduleId: module.id,
	templateUrl: 'admin-entities.component.html',
	styleUrls: ['admin-entities.component.css']
})
export class AdminEntitiesComponent extends BaseComponent implements OnInit {

	constructor(
		private _entityService: _EntityService,
	) {
		super();
	}

	private entities: {
		list?: _Entity[],
		count?: number
		selectedEntity?: _Entity,
		sortBy?: string,
		sortingOrder?: SortDirections,
		pageSize?: number,
		pageNumber?: number,
		rowCompareFunction: Function
	} = {
		pageSize: 10,
		pageNumber: 0,
		count: 0,
		rowCompareFunction: (row: any, model: any) => row.id === model.id,
		selectedEntity: null
	};

	ngOnInit(): void {
		this.loadEntities();
		this.countEntities();
	}

	onSort(sortEvent: { field: string, order: number }): void {
		this.entities.sortBy = sortEvent.field;
		this.entities.sortingOrder = sortEvent.order;
		this.entities.pageNumber = 0;
		this.loadEntities();
	}

	onPage(e: any) {
		this.entities.pageNumber = e.first / e.rows;
		this.entities.pageSize = e.rows;
		this.loadEntities();
	}

	loadEntities(): void {
		this._entityService.query(new _EntityFilter({
			pageNumber: this.entities.pageNumber,
			pageSize: this.entities.pageSize,
			sortDirection: this.entities.sortingOrder,
			sortField: this.entities.sortBy
		})).subscribe((entities) => {
			this.entities.list = entities;
		}, (error) => this.handleError(error));
	}

	countEntities(): void {
		this._entityService.count(new _EntityFilter({})).subscribe((count: number) => {
			this.entities.count = count;
		}, (error) => this.handleError(error));
	}

	goEditEntity(): void {
		if (this.entities.selectedEntity == null) {
			this.NotificationService.error('Ошибка', 'Выберите сущность для редактирования.');
			return;
		}
		var entityId: number = this.entities.selectedEntity.id;
		this.ReverseRouter.entity(entityId);
	}

	goCreateEntity(): void {
		this.ReverseRouter.newEntity();
	}

	deleteEntity(): void {
		if (this.entities.selectedEntity == null) {
			this.NotificationService.error('Ошибка', 'Выберите сущность для удаления.');
			return;
		}
		this._entityService.delete(this.entities.selectedEntity.id).subscribe((entityId: number) => {
			this.entities.list = this.entities.list.filter(e => e.id != entityId);
			this.entities.selectedEntity = null;
		}, (error) => this.handleError(error));
	}
}