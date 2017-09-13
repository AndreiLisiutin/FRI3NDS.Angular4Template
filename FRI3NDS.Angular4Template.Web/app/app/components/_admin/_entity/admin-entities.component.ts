import { Component } from '@angular/core';
import { OnInit, ViewChild } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";
import { AuthenticationService } from "app/services/authentication.service";
import { Router } from "@angular/router";
import { ToastService } from "app/services/toast.service";
import { _EntityService } from "app/services/_admin/_entity.service";
import { _Entity, _EntityBase } from "app/models/domain/_Entity";
import { DataSource } from "@angular/cdk";
import { Observable } from "rxjs/Observable";
import { SortDirections } from "app/models/enums/SortDirections";
import { _EntityFilter } from "app/models/viewModels/_EntityViewModels";
import { ConvertService } from "app/services/utils/convert.service";
import { BaseComponent } from "app/components/base.component";

@Component({
	selector: 'admin-entities',
	providers: [],
	templateUrl: 'admin-entities.component.html',
	styleUrls: ['admin-entities.component.scss']
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
	} = {
		pageSize: 10,
		pageNumber: 0,
		count: 0,
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

	onPage(pageEvent: { first: number, rows: number }) {
		this.entities.pageNumber = pageEvent.first / pageEvent.rows;
		this.entities.pageSize = pageEvent.rows;
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