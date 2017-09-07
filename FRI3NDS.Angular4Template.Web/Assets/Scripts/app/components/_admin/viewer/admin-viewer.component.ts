import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from "services/authentication.service";
import { _EntityService } from "services/_admin/_entity.service";
import { _Entity } from "models/domain/_Entity";
import { Observable } from 'rxjs/Rx';
import { ConvertService } from "services/utils/convert.service";
import { BaseComponent } from "components/base.component";
import { _EntityFilter } from "models/viewModels/_EntityViewModels";
import { SortDirections } from "models/enums/SortDirections";

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

	private entities: {
		list?: _Entity[],
		pageSize?: number,
		pageNumber?: number,
		selectedEntity: _Entity,
		sortBy?: string,
		sortingOrder?: SortDirections,
		count?: number,
	} = {
		pageSize: 10,
		pageNumber: 0,
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

	onPage(e: { first: number, rows: number }) {
		this.entities.pageNumber = e.first / e.rows;
		this.entities.pageSize = e.rows;
		this.loadEntities();
	}

	loadEntities(): void {
		this._entityService.query(new _EntityFilter({
			sortField: this.entities.sortBy,
			sortDirection: this.entities.sortingOrder,
			pageNumber: this.entities.pageNumber,
			pageSize: this.entities.pageSize || null
		})).subscribe((entities: _Entity[]) => {
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
		if (this.entities.selectedEntity == null) {
			this.NotificationService.error('Ошибка', 'Выберите сущность для просмотра экземпляров.');
			return;
		}

		this.ReverseRouter.entityInstances(this.entities.selectedEntity.id);
	}
}