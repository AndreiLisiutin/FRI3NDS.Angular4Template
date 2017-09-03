-- Сохранение сущностей.
SELECT Service$DropFunction('_FieldType$Save');
CREATE OR REPLACE FUNCTION _FieldType$Save(
	_id INT --идентификатор пользователя
	, _name TEXT --имя пользователя
) 
RETURNS INT
AS 
$$
	DECLARE
		new_field_type_id INT;
	BEGIN
	
		IF (_id > 0) THEN
			UPDATE public."_field_type" 
			SET (name) 
			= (_name) 
			WHERE _field_type_id = _id;
			new_field_type_id = _id;
		ELSE
			INSERT INTO public."_field_type" 
			(name) 
			VALUES (_name)
			RETURNING _field_type_id INTO new_field_type_id;
		END IF;
		
		RETURN new_field_type_id;
	END;
$$ 
LANGUAGE plpgsql VOLATILE;