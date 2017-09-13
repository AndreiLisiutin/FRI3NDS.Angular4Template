import { SortDirections } from "app/models/enums/SortDirections";
import { Injectable } from "@angular/core";
import { _FieldTypes } from "app/models/enums/_FieldTypes";
import * as moment from 'moment/moment';

@Injectable()
export class ConvertService {

	private DATE_TIME_FORMAT: string = 'DD.MM.YYYY HH:mm:ss';
	
	public deserialize(value: string, fieldTypeId: number): any {
		if (!value) {
			return null;
		}

		switch (fieldTypeId) {
			case _FieldTypes.Integer:
				return parseInt(value);
			case _FieldTypes.Decimal:
				return parseFloat(value);
			case _FieldTypes.String:
				return value;
			case _FieldTypes.DateTime:
				return moment(value, this.DATE_TIME_FORMAT).toDate();
			default:
				throw 'Неизвестный тип поля.';
		}
	}

	public serialize(value: any, fieldTypeId: number) {
		if (!value) {
			return null;
		}

		switch (fieldTypeId) {
			case _FieldTypes.Integer:
				return value.toString();
			case _FieldTypes.Decimal:
				return value.toString();
			case _FieldTypes.String:
				return value;
			case _FieldTypes.DateTime:
				return moment(value).format(this.DATE_TIME_FORMAT);
			default:
				throw 'Неизвестный тип поля.';
		}
	}

}