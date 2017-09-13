import { Injectable } from "@angular/core";
import { Router, NavigationExtras } from "@angular/router";

@Injectable()
export class ReverseRoutingService {
	
	constructor(private Router: Router) {
	}

	public register(): Promise<boolean> {
		return this.Router.navigate(['/register']);
	}
	public login(): Promise<boolean> {
		return this.Router.navigate(['/login']);
	}
	public profile(): Promise<boolean> {
		return this.Router.navigate(['/profile']);
	}
	public admin(): Promise<boolean> {
		return this.Router.navigate(['/admin']);
	}
	public entities(): Promise<boolean> {
		return this.Router.navigate(['/admin/entity']);
	}
	public newEntity(): Promise<boolean> {
		return this.Router.navigate(['admin/entity/new']);
	}
	public entity(id: number): Promise<boolean> {
		return this.Router.navigate(['admin/entity', id]);
	}
	public editEntity(id: number): Promise<boolean> {
		return this.Router.navigate(['admin/entity', id, 'edit']);
	}
	public newField(entityId: number): Promise<boolean> {
		return this.Router.navigate(['admin/entity/field/new', entityId]);
	}
	public field(id: number): Promise<boolean> {
		return this.Router.navigate(['admin/entity/field', id]);
	}
	public editField(id: number): Promise<boolean> {
		return this.Router.navigate(['admin/entity/field', id, 'edit']);
	}
	public viewer(): Promise<boolean> {
		return this.Router.navigate(['admin/viewer']);
	}
	public entityInstances(entityId: number): Promise<boolean> {
		return this.Router.navigate(['admin/viewer/entityInstances', entityId]);
	}
	public entityInstance(formId: number, entityInstanceId: number): Promise<boolean> {
		return this.Router.navigate(['admin/viewer/form', formId, entityInstanceId]);
	}
}