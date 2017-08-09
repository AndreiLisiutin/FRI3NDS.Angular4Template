-- Удаление пользователей.
CREATE OR REPLACE FUNCTION _Entity$Delete(
	_id INT --идентификатор пользователя
) 
RETURNS INT
AS 
$$
	BEGIN
		DELETE FROM public."_entity" WHERE _id = _id;
		RETURN _id;
	END;
$$ 
LANGUAGE plpgsql VOLATILE;