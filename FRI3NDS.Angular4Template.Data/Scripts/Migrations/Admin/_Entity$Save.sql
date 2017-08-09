-- Сохранение сущностей.
CREATE OR REPLACE FUNCTION _Entity$Save(
	_id INT --идентификатор пользователя
	, _name TEXT --имя пользователя
	, _db_name TEXT --фамилия пользователя
	, _db_scheme TEXT --отчество пользователя
) 
RETURNS INT
AS 
$$
	DECLARE
		new_entity_id INT;
	BEGIN
	
		IF (_id > 0) THEN
			UPDATE public."_entity" 
			SET (name, db_name, db_scheme) 
			= (_name, _db_name, _db_scheme) 
			WHERE _entity_id = _id;
			new_entity_id = _id;
		ELSE
			INSERT INTO public."_entity" 
			(name, db_name, db_scheme) 
			VALUES (_name, _db_name, _db_scheme)
			RETURNING _entity_id INTO new_entity_id;
		END IF;
		
		RETURN new_entity_id;
	END;
$$ 
LANGUAGE plpgsql VOLATILE;