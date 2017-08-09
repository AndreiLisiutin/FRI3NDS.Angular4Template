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
    selector: 'admin-field-edit',
    providers: [],
    moduleId: module.id,
    templateUrl: 'admin-field-edit.component.html',
    styleUrls: ['admin-field-edit.component.css']
})
export class AdminFieldEditComponent implements OnInit {

    constructor(
        private _fieldService: _FieldService,
        private notificationService: ToastService,
        private route: ActivatedRoute,
        private _location: Location,
        private router: Router
    ) {
    }

    private field: _Field = new _Field();

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            if (!params['id']) {
                //создание нового поля
                this.field = new _Field();
                return;
            }

            var id: number = parseInt(params['id']);

            this._fieldService.getById(id).subscribe((field: _Field) => {
                this.field = field;
            }, (error) => {
                this.notificationService.error('Ошибка', error.text && error.text() || 'Ошибка.');
            });
        });
    }
    
    saveField(): void {
        this._fieldService.save(this.field).subscribe((field: _FieldBase) => {
            this.field.id = field.id;
            this._location.back();
        }, (error) => {
            this.notificationService.error('Ошибка', error.text && error.text() || 'Ошибка.');
        });
    }

    goBack(): void {
        this._location.back();
    }
}