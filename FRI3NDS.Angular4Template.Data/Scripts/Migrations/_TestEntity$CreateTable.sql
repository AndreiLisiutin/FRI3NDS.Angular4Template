-- Процедура создания тестовой сущности в БД.
CREATE OR REPLACE FUNCTION _TestEntity$CreateTable() RETURNS VOID AS 
$$
	BEGIN
		CREATE TABLE IF NOT EXISTS public._test_entity
		(
			_test_entity_id SERIAL,
			name TEXT NOT NULL,
			date TIMESTAMP WITH TIME ZONE NOT NULL,
			CONSTRAINT _test_entity_pkey PRIMARY KEY (_test_entity_id)
		);
		
		CREATE TABLE public._test_subentity
		(
			_test_subentity_id SERIAL,
			name text NOT NULL,
			_test_entity_id integer NOT NULL,
			CONSTRAINT _test_subentity_pkey PRIMARY KEY (_test_subentity_id),
			CONSTRAINT _test_subentity__test_entity_id_fkey FOREIGN KEY (_test_entity_id)
				REFERENCES public._test_entity (_test_entity_id) MATCH SIMPLE
				ON UPDATE NO ACTION ON DELETE NO ACTION
		)
	END;
$$ 
LANGUAGE plpgsql VOLATILE;
