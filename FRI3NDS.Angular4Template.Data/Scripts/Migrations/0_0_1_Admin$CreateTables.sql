-- Процедура создания сущностей для администрирования пользователей в БД.
CREATE TABLE public._entity
(
	_entity_id SERIAL,
	name text NOT NULL,
	db_name text NOT NULL,
	db_scheme text,
	CONSTRAINT _entity_pkey PRIMARY KEY (_entity_id),
	CONSTRAINT _entity_db_name_key UNIQUE (db_name)
);

CREATE TABLE public._field_type
(
	_field_type_id SERIAL,
	name text NOT NULL,
	CONSTRAINT _field_type_pkey PRIMARY KEY (_field_type_id)
);
INSERT INTO public._field_type (_field_type_id, name)
VALUES (1, 'Целое число');
INSERT INTO public._field_type (_field_type_id, name)
VALUES (2, 'Дробное число');
INSERT INTO public._field_type (_field_type_id, name)
VALUES (3, 'Строка');
INSERT INTO public._field_type (_field_type_id, name)
VALUES (4, 'Дата');

CREATE TABLE public._field
(
	_field_id SERIAL,
	_field_type_id integer NOT NULL,
	name text NOT NULL,
	db_name text NOT NULL,
	_entity_id integer NOT NULL,
	is_identity BOOLEAN NOT NULL,
	CONSTRAINT _field_pkey PRIMARY KEY (_field_id),
	CONSTRAINT _field__entity_id_fkey FOREIGN KEY (_entity_id)
		REFERENCES public._entity (_entity_id) MATCH SIMPLE
		ON UPDATE NO ACTION ON DELETE NO ACTION,
	CONSTRAINT _field__field_type_id_fkey FOREIGN KEY (_field_type_id)
		REFERENCES public._field_type (_field_type_id) MATCH SIMPLE
		ON UPDATE NO ACTION ON DELETE NO ACTION
);
