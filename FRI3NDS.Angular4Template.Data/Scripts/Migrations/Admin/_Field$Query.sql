-- Выборка полей.
SELECT Service$DropFunction('_Field$Query');
CREATE OR REPLACE FUNCTION _Field$Query(
	_id INTEGER --идентификатор поля
	, _name TEXT --название поля
	, _db_name TEXT --название поля в БД
	, __entity_id INTEGER --идентификатор сущности, к которой относится поле
	, _page_size INTEGER = 1000 --размер страницы
	, _page_number INTEGER = 0 --номер страницы
)
RETURNS TABLE (
	Id INTEGER 
	, _FieldTypeId INTEGER
	, _EntityId INTEGER
	, Name TEXT
	, DatabaseName TEXT
	, _EntityName TEXT
	, _FieldTypeName TEXT) 
AS 
$$
	BEGIN
		RETURN QUERY
		 
		SELECT f._field_id AS Id 
			, f._field_type_id AS _FieldTypeId 
			, f._entity_id AS _EntityId 
			, f.name AS Name 
			, f.db_name AS DatabaseName 
			, e.name AS _EntityName 
			, ft.name AS _FieldTypeName 
		FROM public."_field" f 
		INNER JOIN public."_entity" e ON e._entity_id = f._entity_id 
		INNER JOIN public."_field_type" ft ON ft._field_type_id = f._field_type_id
		WHERE (_id IS NULL OR f._field_id = _id) 
			AND (_name IS NULL OR f.name = _name)
			AND (_db_name IS NULL OR f.db_name = _db_name)
			AND (__entity_id IS NULL OR f._entity_id = __entity_id)
		OFFSET _page_number * _page_size LIMIT _page_size;
	END;
$$ 
LANGUAGE plpgsql VOLATILE;