﻿import { _GenericEntityField } from "app/models/business/_GenericEntityField";

export class _GenericEntity {
public constructor(init?: Partial<_GenericEntity>) {
        Object.assign(this, init);
    }
    public entityId: number;
    public fields: _GenericEntityField[];
}

