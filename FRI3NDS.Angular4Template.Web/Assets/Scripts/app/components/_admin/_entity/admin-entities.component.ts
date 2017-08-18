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
import { ITdDataTableSortChangeEvent, TdDataTableSortingOrder } from "@covalent/core";

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
		private router: Router
	) {
	}
	
	private entities: {
		list?: _Entity[],
		count?: number
		selectedEntityId?: number,
		sortBy?: string,
		sortDirection?: string,
		pageSize?: number,
		pageNumber?: number,
	} = {
		pageSize: 10,
		pageNumber: 0
	};

	ngOnInit(): void {
		this._entityService.query().subscribe((entities) => {
			this.entities.list = entities;
		}, (error) => {
			this.notificationService.error('Ошибка', error.text && error.text() || 'Ошибка.');
		});
	}

	onTableSortChange(sortEvent: ITdDataTableSortChangeEvent): void {
		this.entities.sortBy = sortEvent.name;
		this.entities.sortDirection = sortEvent.order === TdDataTableSortingOrder.Ascending ? 'DESC' : 'ASC';
		this.entities.list = this.entities.list.sort((a, b) => a[sortEvent.name] > b[sortEvent.name]
			? (sortEvent.order == TdDataTableSortingOrder.Ascending ? 1 : -1)
			: (sortEvent.order == TdDataTableSortingOrder.Ascending ? -1 : 1));
	}

	onTableSelectionChange(event: IDatatableSelectionEvent): void {
		this.entities.selectedEntityId = event.selectedValues.length == 1
			? parseInt(event.selectedValues[0])
			: null;
	}

	goEditEntity(): void {
		if (!this.entities.selectedEntityId) {
			this.notificationService.error('Ошибка', 'Выберите сущность для редактирования.');
			return;
		}
		this.router.navigate(['/admin/entity', this.entities.selectedEntityId]);
	}

	goCreateEntity(): void {
		this.router.navigate(['/admin/entity/new']);
	}

	deleteEntity(): void {
		if (!this.entities.selectedEntityId) {
			this.notificationService.error('Ошибка', 'Выберите сущность для удаления.');
			return;
		}
		this._entityService.delete(this.entities.selectedEntityId).subscribe((entityId: number) => {
			this.entities.list = this.entities.list.filter(e => e.id != entityId);
			this.entities.selectedEntityId = null;
		}, (error) => {
			this.notificationService.error('Ошибка', error.text && error.text() || 'Ошибка.');
		});
	}
}