-- Сохранение сущностей.
SELECT Service$DropFunction('_Field$Save');
CREATE OR REPLACE FUNCTION _Field$Save(
	_id INT --идентификатор пользователя
	, __field_type_id INT --имя пользователя
	, _name TEXT --имя пользователя
	, _db_name TEXT --фамилия пользователя
	, __entity_id INT --отчество пользователя
	, _is_identity BOOLEAN
) 
RETURNS INT
AS 
$$
	DECLARE
		new_field_id INT;
	BEGIN
	
		IF (_id > 0) THEN
			UPDATE public."_field" 
			SET (_field_type_id, name, db_name, _entity_id, is_identity) 
			= (__field_type_id, _name, _db_name, __entity_id, _is_identity) 
			WHERE _field_id = _id;
			new_field_id = _id;
		ELSE
			INSERT INTO public."_field" 
			(_field_type_id, name, db_name, _entity_id, is_identity) 
			VALUES (__field_type_id, _name, _db_name, __entity_id, _is_identity)
			RETURNING _field_id INTO new_field_id;
		END IF;
		
		RETURN new_field_id;
	END;
$$ 
LANGUAGE plpgsql VOLATILE;