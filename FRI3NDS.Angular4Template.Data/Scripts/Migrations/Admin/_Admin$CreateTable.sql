-- Процедура создания сущностей для администрирования пользователей в БД.
CREATE OR REPLACE FUNCTION _Admin$CreateTable() RETURNS VOID AS 
$$
	BEGIN
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
		
		CREATE TABLE public._field
		(
			_field_id SERIAL,
			_field_type_id integer NOT NULL,
			name text NOT NULL,
			db_name text NOT NULL,
			_entity_id integer NOT NULL,
			CONSTRAINT _field_pkey PRIMARY KEY (_field_id),
			CONSTRAINT _field__entity_id_fkey FOREIGN KEY (_entity_id)
				REFERENCES public._entity (_entity_id) MATCH SIMPLE
				ON UPDATE NO ACTION ON DELETE NO ACTION,
			CONSTRAINT _field__field_type_id_fkey FOREIGN KEY (_field_type_id)
				REFERENCES public._field_type (_field_type_id) MATCH SIMPLE
				ON UPDATE NO ACTION ON DELETE NO ACTION
		);
	END;
$$ 
LANGUAGE plpgsql VOLATILE;
