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

@Component({
    selector: 'admin-entity-edit',
    providers: [],
    moduleId: module.id,
    templateUrl: 'admin-entity-edit.component.html',
    styleUrls: ['admin-entity-edit.component.css']
})
export class AdminEntityEditComponent implements OnInit {

    constructor(
        private _entityService: _EntityService,
        private notificationService: ToastService,
        private route: ActivatedRoute,
        private _location: Location,
        private router: Router
    ) {
    }

    private entity: _Entity = new _Entity();

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
        });
    }

    saveEntity(): void {
        this._entityService.save(this.entity).subscribe((entity: _EntityBase) => {
            this.entity.id = entity.id;
            this._location.back();
        }, (error) => {
            this.notificationService.error('Ошибка', error.text && error.text() || 'Ошибка.');
        });
    }

    goBack(): void {
        this._location.back();
    }
}