CREATE ROLE administrador WITH LOGIN PASSWORD 'admin123';
ALTER ROLE administrador SUPERUSER;

CREATE ROLE usuario_migracion WITH LOGIN PASSWORD 'admin123';
ALTER ROLE usuario_migracion SUPERUSER;

CREATE ROLE usuario_replicacion WITH LOGIN PASSWORD 'admin123';
ALTER ROLE usuario_replicacion SUPERUSER;

CREATE ROLE usuario_aplicacion WITH LOGIN PASSWORD 'admin123';
ALTER ROLE usuario_aplicacion SUPERUSER;

CREATE ROLE replicator WITH REPLICATION LOGIN PASSWORD 'replica123';