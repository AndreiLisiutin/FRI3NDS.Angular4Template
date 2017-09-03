-- Выборка типов полей.
SELECT Service$DropFunction('_FieldType$Query');
CREATE OR REPLACE FUNCTION _FieldType$Query(
	_id INTEGER --идентификатор пользователя
	, _name TEXT --логин пользователя
	, _page_size INTEGER = 1000 --размер страницы
	, _page_number INTEGER = 0 --номер страницы
)
RETURNS TABLE (
	Id INT 
	, Name TEXT) 
AS 
$$
	BEGIN
		RETURN QUERY
		 
		SELECT ft._field_type_id AS Id 
			, ft.name AS Name 
		FROM public."_field_type" ft 
		WHERE (_id IS NULL OR ft._field_type_id = _id) 
			AND (_name IS NULL OR ft.name = _name)
		OFFSET _page_number * _page_size LIMIT _page_size;
	END;
$$ 
LANGUAGE plpgsql VOLATILE;