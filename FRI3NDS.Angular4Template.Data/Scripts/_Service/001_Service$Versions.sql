CREATE TABLE IF NOT EXISTS public._version
(
	_version_id SERIAL,
	name text NOT NULL,
	script_hash text NOT NULL,
	description text,
	applied_on DATE NOT NULL,
	CONSTRAINT _version_pkey PRIMARY KEY (_version_id)
);

SELECT Service$DropFunction('_Version$Query');
CREATE OR REPLACE FUNCTION _Version$Query(
	_id INTEGER --идентификатор версии
	, _name TEXT --номер версии
	, _script_hash TEXT --хэш скрипта версии
	, _page_size INTEGER = 1000 --размер страницы
	, _page_number INTEGER = 0 --номер страницы
)
RETURNS TABLE (
	Id INT 
	, Name TEXT 
	, ScriptHash TEXT 
	, Description TEXT 
	, AppliedOn DATE) 
AS 
$$
	BEGIN
		RETURN QUERY
		 
		SELECT v._version_id AS Id 
			, v.name AS Name 
			, v.script_hash AS ScriptHash 
			, v.description AS Description 
			, v.applied_on AS AppliedOn
		FROM public."_version" v 
		WHERE (_id IS NULL OR v._version_id = _id) 
			AND (_name IS NULL OR v.name = _name)
			AND (_script_hash IS NULL OR v.script_hash = _script_hash)
		OFFSET _page_number * _page_size LIMIT _page_size;
	END;
$$ 
LANGUAGE plpgsql VOLATILE;

-- Сохранение версий.
SELECT Service$DropFunction('_Version$Save');
CREATE OR REPLACE FUNCTION _Version$Save(
	_id INTEGER --идентификатор версии
	, _name TEXT --номер версии
	, _script_hash TEXT --хэш скрипта версии
	, _description TEXT --описание версии
	, _applied_on DATE --дата наката версии
) 
RETURNS INT
AS 
$$
	DECLARE
		new_version_id INT;
	BEGIN
	
		IF (_id > 0) THEN
			UPDATE public."_version" 
			SET (name, script_hash, description, applied_on) 
			= (_name, _script_hash, _description, _applied_on) 
			WHERE _version_id = _id;
			new_version_id = _id;
		ELSE
			INSERT INTO public."_version" 
			(name, script_hash, description, applied_on) 
			VALUES (_name, _script_hash, _description, _applied_on)
			RETURNING _version_id INTO new_version_id;
		END IF;
		
		RETURN new_version_id;
	END;
$$ 
LANGUAGE plpgsql VOLATILE;

-- Удаление версий.
SELECT Service$DropFunction('_Version$Delete');
CREATE OR REPLACE FUNCTION _Version$Delete(
	_id INT --идентификатор версии
) 
RETURNS INT
AS 
$$
	BEGIN
		DELETE FROM public."_version" WHERE _version_id = _id;
		RETURN _id;
	END;
$$ 
LANGUAGE plpgsql VOLATILE;