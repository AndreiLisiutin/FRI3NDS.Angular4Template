import { Component } from '@angular/core';
import { OnInit, ViewChild } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import { MdSidenav } from "@angular/material";

/**
 * Корневой компонент приложения.
 */
@Component({
	selector: 'root',
	providers: [],
	moduleId: module.id,
	templateUrl: 'root.html',
    styles: [`.is-active {color: cornflowerblue;}
.example-fill-remaining-space {
  flex: 1 1 auto;
}
`]
})
export class RootComponent {
    
}