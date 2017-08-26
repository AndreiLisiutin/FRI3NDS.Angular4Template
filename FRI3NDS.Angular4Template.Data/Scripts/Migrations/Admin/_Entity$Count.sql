-- Выборка сущностей.
SELECT Service$DropFunction('_Entity$Count');
CREATE OR REPLACE FUNCTION _Entity$Count(
	_name TEXT --логин пользователя
	, _db_name TEXT --логин пользователя
)
RETURNS INTEGER
AS 
$$
	BEGIN
		RETURN (
		SELECT COUNT(e._entity_id)
		FROM public."_entity" e 
		WHERE (_name IS NULL OR e.name = _name)
			AND (_db_name IS NULL OR e.db_name = _db_name)
		);
	END;
$$ 
LANGUAGE plpgsql VOLATILE;