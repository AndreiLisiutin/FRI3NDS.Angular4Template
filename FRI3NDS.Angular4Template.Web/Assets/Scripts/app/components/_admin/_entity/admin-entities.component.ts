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

    private entities: _Entity[];
    private selectedEntityId: number;

    ngOnInit(): void {
        this._entityService.query().subscribe((entities) => {
            this.entities = entities;
        }, (error) => {
            this.notificationService.error('Ошибка', error.text && error.text() || 'Ошибка.');
        });
    }

    onTableSortChange(event: IDatatableSortEvent): void {
        this.entities = this.entities.sort((a, b) => a[event.sortBy] > b[event.sortBy] ? (event.sortType == 1 ? 1 : -1) : (event.sortType == 1 ? -1 : 1));
    }

    onTableSelectionChange(event: IDatatableSelectionEvent): void {
        this.selectedEntityId = event.selectedValues.length == 1
            ? parseInt(event.selectedValues[0])
            : null;
    }

    goEditEntity(): void {
        if (!this.selectedEntityId) {
            this.notificationService.error('Ошибка', 'Выберите сущность для редактирования.');
            return;
        }
        this.router.navigate(['/admin/entity', this.selectedEntityId]);
    }

    goCreateEntity(): void {
        this.router.navigate(['/admin/entity/new']);
    }

    deleteEntity(): void {
        if (!this.selectedEntityId) {
            this.notificationService.error('Ошибка', 'Выберите сущность для удаления.');
            return;
        }
        this._entityService.delete(this.selectedEntityId).subscribe((entity: _EntityBase) => {
            this.entities = this.entities.filter(e => e.id != entity.id);
            this.selectedEntityId = null;
        }, (error) => {
            this.notificationService.error('Ошибка', error.text && error.text() || 'Ошибка.');
        });
    }
}