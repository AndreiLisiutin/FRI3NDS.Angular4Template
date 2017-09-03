import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from "services/authentication.service";
import { _EntityService } from "services/_admin/_entity.service";
import { _Entity } from "models/domain/_Entity";
import { Observable } from 'rxjs/Rx';
import { ConvertService } from "services/utils/convert.service";
import { ITdDataTableSortChangeEvent, TdDataTableSortingOrder, IPageChangeEvent, TdPagingBarComponent } from "@covalent/core";
import { BaseComponent } from "components/base.component";
import { _EntityFilter } from "models/viewModels/_EntityViewModels";

@Component({
	selector: 'admin-viewer',
	providers: [],
	moduleId: module.id,
	templateUrl: 'admin-viewer.component.html',
	styleUrls: ['admin-viewer.component.css']
})
export class AdminViewerComponent extends BaseComponent implements OnInit {

	constructor(
		private _entityService: _EntityService
	) {
		super();
	}

	@ViewChild('pagingBar') viewPagingBar: TdPagingBarComponent;

	private entities: {
		list?: any[],
		pageSize?: number,
		pageNumber?: number,
		selectedEntityId: any[],
		sortBy?: string,
		sortingOrder?: TdDataTableSortingOrder,
		count?: number,
		rowCompareFunction: Function
	} = {
		pageSize: 10,
		pageNumber: 1,
		rowCompareFunction: (row: any, model: any) => row.id == model.id,
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
			sortField: this.entities.sortBy,
			sortDirection: this.ConvertService.sortingOrderToSortDirection(this.entities.sortingOrder),
			pageNumber: this.entities.pageNumber - 1,
			pageSize: this.entities.pageSize || null
		})).subscribe((entities) => {
			this.entities.list = entities;
		}, (error) => this.handleError(error));
	}

	countEntities(): void {
		this._entityService.count(new _EntityFilter({}))
			.subscribe((count: number) => {
				this.entities.count = count;
			}, (error) => this.handleError(error));
	}
	
	goToEntityInstances() {
		if (this.entities.selectedEntityId.length != 1) {
			this.NotificationService.error('Ошибка', 'Выберите сущность для редактирования.');
			return;
		}
		
		this.Router.navigate(['admin/viewer/entityInstances', this.entities.selectedEntityId[0].id]);
	}
}