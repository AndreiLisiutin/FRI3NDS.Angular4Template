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
import { IDatatableSelectionEvent, IDatatableSortEvent } from "ng2-md-datatable";
import { ITdDataTableSortChangeEvent, TdDataTableSortingOrder, IPageChangeEvent } from "@covalent/core";
import { SortDirections } from "models/enums/SortDirections";
import { _EntityFilter } from "models/viewModels/_EntityViewModels";
import { ConvertService } from "services/utils/convert.service";

@Component({
	selector: 'admin-entities',
	providers: [],
	moduleId: module.id,
	templateUrl: 'admin-entities.component.html',
	styleUrls: ['admin-entities.component.css']
})
export class AdminEntitiesComponent implements OnInit {

	constructor(
		private _entityService: _EntityService,
		private notificationService: ToastService,
		private convertService: ConvertService,
		private router: Router
	) {
	}
	
	private entities: {
		list?: _Entity[],
		count?: number
		selectedEntityId?: any[],
		sortBy?: string,
		sortingOrder?: TdDataTableSortingOrder,
		pageSize?: number,
		pageNumber?: number,
		rowCompareFunction: Function
	} = {
		pageSize: 1,
		pageNumber: 1,
		count: 0,
		rowCompareFunction: (row: any, model: any) => row.id === model.id,
		selectedEntityId: []
	};

	ngOnInit(): void {
		this.loadEntities();
		this.countEntities();
	}

	onTableSortChange(sortEvent: ITdDataTableSortChangeEvent): void {
		this.entities.sortBy = sortEvent.name;
		this.entities.sortingOrder = sortEvent.order;
		this.loadEntities();
	}
	
	onTablePageChange(pagingEvent: IPageChangeEvent): void {
		this.entities.pageNumber = pagingEvent.page;
		this.entities.pageSize = pagingEvent.pageSize;
		this.loadEntities();
	}

	loadEntities(): void {
		this._entityService.query(new _EntityFilter({
			pageNumber: this.entities.pageNumber - 1,
			pageSize: this.entities.pageSize,
			sortDirection: this.convertService.sortingOrderToSortDirection(this.entities.sortingOrder),
			sortField: this.entities.sortBy
		})).subscribe((entities) => {
			this.entities.list = entities;
		}, (error) => {
			this.notificationService.error('Ошибка', error.text && error.text() || 'Ошибка.');
		});
	}

	countEntities(): void {
		this._entityService.count(new _EntityFilter({})).subscribe((count: number) => {
			this.entities.count = count;
		}, (error) => {
			this.notificationService.error('Ошибка', error.text && error.text() || 'Ошибка.');
		});
	}
	
	goEditEntity(): void {
		if (this.entities.selectedEntityId.length != 1) {
			this.notificationService.error('Ошибка', 'Выберите сущность для редактирования.');
			return;
		}
		this.router.navigate(['/admin/entity', this.entities.selectedEntityId[0].id]);
	}

	goCreateEntity(): void {
		this.router.navigate(['/admin/entity/new']);
	}

	deleteEntity(): void {
		if (this.entities.selectedEntityId.length != 1) {
			this.notificationService.error('Ошибка', 'Выберите сущность для удаления.');
			return;
		}
		this._entityService.delete(this.entities.selectedEntityId[0].id).subscribe((entityId: number) => {
			this.entities.list = this.entities.list.filter(e => e.id != entityId);
			this.entities.selectedEntityId = null;
		}, (error) => {
			this.notificationService.error('Ошибка', error.text && error.text() || 'Ошибка.');
		});
	}
}