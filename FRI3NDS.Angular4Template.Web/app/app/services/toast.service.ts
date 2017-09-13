import { Injectable } from '@angular/core';
import { NotificationsService } from "angular2-notifications";


@Injectable()
export class ToastService {
	constructor(private _notificationService: NotificationsService) { }

	getChangeEmitter() {
		return this._notificationService.getChangeEmitter();
	}

	//// Access methods
	success(title: string, content: string, override?: any): any {
		return this._notificationService.success(title, content, override);
	}

	error(title: string, content: string, override?: any): any {
		return this._notificationService.error(title, content, override);
	}

	alert(title: string, content: string, override?: any): any {
		return this._notificationService.alert(title, content, override);
	}

	info(title: string, content: string, override?: any): any {
		return this._notificationService.info(title, content, override);
	}

	bare(title: string, content: string, override?: any): any {
		return this._notificationService.bare(title, content, override);
	}

	// With type method
	create(title: string, content: string, type: string, override?: any): any {
		return this._notificationService.create(title, content, type, override);
	}

	// HTML Notification method
	html(html: any, type: string, override?: any): any {
		return this._notificationService.create(html, type, override);
	}

	// Remove all notifications method
	remove(id?: string): void {
		this._notificationService.remove(id);
	}
}