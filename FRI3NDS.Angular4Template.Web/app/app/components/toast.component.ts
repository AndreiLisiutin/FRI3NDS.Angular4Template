﻿import { Component } from '@angular/core';

@Component({
	selector: 'toast',
    templateUrl: 'toast.component.html'
})
export class ToastComponent {

    /**
    * Умолчания для конфигурации тостов.
    */
    private toastOptions: any = {
        position: ['top', 'right'],
        timeOut: 10 * 1000,
        showProgressBar: true,
        pauseOnHover: true,
        lastOnBottom: true,
        clickToClose: true,
        maxStack: 10,
        animate: 'scale'
    };    
}