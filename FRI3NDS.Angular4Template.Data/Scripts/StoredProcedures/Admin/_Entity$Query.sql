-- Выборка сущностей.
SELECT Service$DropFunction('_Entity$Query');
CREATE OR REPLACE FUNCTION _Entity$Query(
	_id INTEGER --идентификатор пользователя
	, _name TEXT --логин пользователя
	, _db_name TEXT --логин пользователя
	, _page_size INTEGER = 1000 --размер страницы
	, _page_number INTEGER = 0 --номер страницы
	, _sort_field TEXT = NULL --номер страницы
	, _sort_direction TEXT = NULL  --номер страницы
)
RETURNS TABLE (
	Id INT 
	, Name TEXT 
	, DatabaseName TEXT 
	, DatabaseScheme TEXT) 
AS 
$$
	BEGIN
		RETURN QUERY
		 
		SELECT e._entity_id AS Id 
			, e.name AS Name 
			, e.db_name AS DatabaseName 
			, e.db_scheme AS DatabaseScheme 
		FROM public."_entity" e 
		WHERE (_id IS NULL OR e._entity_id = _id) 
			AND (_name IS NULL OR e.name = _name)
			AND (_db_name IS NULL OR e.db_name = _db_name)
		ORDER BY 
			CASE WHEN LOWER(_sort_direction) = 'asc' THEN
				CASE
                    WHEN LOWER(_sort_field) = LOWER('Id') THEN CAST(e._entity_id AS TEXT)
                    WHEN LOWER(_sort_field) = LOWER('Name') THEN e.name
                    WHEN LOWER(_sort_field) = LOWER('DatabaseName') THEN e.db_name
                    WHEN LOWER(_sort_field) = LOWER('DatabaseScheme') THEN e.db_scheme
                    ELSE CAST(e._entity_id AS TEXT)
                END
			END ASC,
			CASE WHEN LOWER(_sort_direction) = 'desc' THEN
				CASE
                    WHEN LOWER(_sort_field) = LOWER('Id') THEN CAST(e._entity_id AS TEXT)
                    WHEN LOWER(_sort_field) = LOWER('Name') THEN e.name
                    WHEN LOWER(_sort_field) = LOWER('DatabaseName') THEN e.db_name
                    WHEN LOWER(_sort_field) = LOWER('DatabaseScheme') THEN e.db_scheme
                    ELSE CAST(e._entity_id AS TEXT)
                END
			END DESC
		OFFSET _page_number * _page_size LIMIT _page_size;
	END;
$$ 
LANGUAGE plpgsql VOLATILE;