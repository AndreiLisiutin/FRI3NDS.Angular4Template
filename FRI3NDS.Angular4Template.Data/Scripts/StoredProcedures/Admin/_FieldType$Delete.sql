-- Удаление пользователей.
SELECT Service$DropFunction('_FieldType$Delete');
CREATE OR REPLACE FUNCTION _FieldType$Delete(
	_id INT --идентификатор пользователя
) 
RETURNS INT
AS 
$$
	BEGIN
		DELETE FROM public."_field_type" WHERE _id = _id;
		RETURN _id;
	END;
$$ 
LANGUAGE plpgsql VOLATILE;