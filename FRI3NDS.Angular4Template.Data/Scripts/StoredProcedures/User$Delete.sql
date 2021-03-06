﻿-- Удаление пользователей.
SELECT Service$DropFunction('User$Delete');
CREATE OR REPLACE FUNCTION User$Delete(
	_id INT --идентификатор пользователя
) 
RETURNS INT
AS 
$$
	BEGIN
		DELETE FROM public."user" WHERE user_id = _id;
		RETURN _id;
	END;
$$ 
LANGUAGE plpgsql VOLATILE;