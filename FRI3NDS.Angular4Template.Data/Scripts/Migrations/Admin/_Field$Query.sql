-- Выборка полей.
CREATE OR REPLACE FUNCTION _Field$Query(
	_id INTEGER --идентификатор поля
	, _name TEXT --логин пользователя
	, _db_name TEXT --логин пользователя
	, __entity_id TEXT --логин пользователя
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
		 
		SELECT f._field_id AS Id 
			, f._field_type_id AS _FieldTypeId 
			, f._entity_id AS _EntityId 
			, f.name AS Name 
			, f.db_name AS DatabaseName 
		FROM public."_field_type" f 
		WHERE (_id IS NULL OR f._field_type_id = _id) 
			AND (_name IS NULL OR f.name = _name)
			AND (_db_name IS NULL OR f.db_name = _db_name)
			AND (__entity_id IS NULL OR f._entity_id = __entity_id)
		OFFSET _page_number * _page_size LIMIT _page_size;
	END;
$$ 
LANGUAGE plpgsql VOLATILE;