ALTER TABLE area_agricola 
ALTER COLUMN geometria TYPE geometry(MultiPolygon, 4326) 
USING ST_Multi(geometria);
