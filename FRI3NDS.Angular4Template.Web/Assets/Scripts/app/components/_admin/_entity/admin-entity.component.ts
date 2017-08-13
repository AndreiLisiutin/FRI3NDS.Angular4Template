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
import { IDatatableSelectionEvent, IDatatableSortEvent } from "ng2-md-datatable";
import { _FieldService } from "services/_admin/_field.service";
import { _FieldFilter } from "models/viewModels/_FieldViewModels";
import { _Field, _FieldBase } from "models/domain/_Field";

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
        private route: ActivatedRoute,
        private _location: Location,
        private router: Router
    ) {
    }

    private entity: _Entity = new _Entity();
    private fields: _Field[] = new Array<_Field>();
    private selectedFieldId: number;

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            if (!params['id']) {
                //создание новой сущности
                this.entity = new _Entity();
                return;
            }

            var id: number = parseInt(params['id']);

            this._entityService.getById(id).subscribe((entity: _Entity) => {
                this.entity = entity;
            }, (error) => {
                this.notificationService.error('Ошибка', error.text && error.text() || 'Ошибка.');
            });
            
            this._fieldService.query(new _FieldFilter({
                _EntityId: id
            })).subscribe((fields: _Field[]) => {
                this.fields = fields;
            }, (error) => {
                this.notificationService.error('Ошибка', error.text && error.text() || 'Ошибка.');
            });

        });
    }

    onTableSortChange(event: IDatatableSortEvent): void {
        this.fields = this.fields.sort((a, b) => a[event.sortBy] > b[event.sortBy] ? (event.sortType == 1 ? 1 : -1) : (event.sortType == 1 ? -1 : 1));
    }

    onTableSelectionChange(event: IDatatableSelectionEvent): void {
        this.selectedFieldId = event.selectedValues.length == 1
            ? parseInt(event.selectedValues[0])
            : null;
    }

    goEditEntity(): void {
        this.router.navigate(['/admin/entity', this.entity.id, 'edit']);
    }

    goViewField(): void {
        if (!this.selectedFieldId) {
            this.notificationService.error('Ошибка', 'Выберите поле для редактирования.');
            return;
        }
        this.router.navigate(['/admin/entity/field', this.selectedFieldId]);
    }

    goCreateField(): void {
        this.router.navigate(['/admin/entity/field/new/', this.entity.id]);
    }

    deleteField(): void {
        if (!this.selectedFieldId) {
            this.notificationService.error('Ошибка', 'Выберите поле для удаления.');
            return;
        }
        this._fieldService.delete(this.selectedFieldId).subscribe((fieldId: number) => {
            this.fields = this.fields.filter(f => f.id != fieldId);
        }, (error) => {
            this.notificationService.error('Ошибка', error.text && error.text() || 'Ошибка.');
        });
    }

    goBack(): void {
        this._location.back();
    }
}