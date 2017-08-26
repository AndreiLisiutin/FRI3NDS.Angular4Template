-- Выборка полей.
SELECT Service$DropFunction('_Field$Count');
CREATE OR REPLACE FUNCTION _Field$Count(
	_name TEXT --название поля
	, _db_name TEXT --название поля в БД
	, __entity_id INTEGER --идентификатор сущности, к которой относится поле
)
RETURNS INTEGER
AS 
$$
	BEGIN
		RETURN (
		SELECT COUNT(f._field_id) 
		FROM public."_field" f 
		INNER JOIN public."_entity" e ON e._entity_id = f._entity_id 
		INNER JOIN public."_field_type" ft ON ft._field_type_id = f._field_type_id
		WHERE (_name IS NULL OR f.name = _name)
			AND (_db_name IS NULL OR f.db_name = _db_name)
			AND (__entity_id IS NULL OR f._entity_id = __entity_id)
		);
	END;
$$ 
LANGUAGE plpgsql VOLATILE;