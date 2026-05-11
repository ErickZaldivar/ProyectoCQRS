-- Insertar 10 registros en ss_organizaciones
INSERT INTO servicio_social.ss_organizaciones (id, nombre_organizacion, nombre_titular_organizacion, puesto_titular_organizaciones) VALUES
(1, 'Fundación Ayuda Social', 'María González Hernández', 'Directora General'),
(2, 'Centro de Desarrollo Comunitario', 'Carlos López Martínez', 'Coordinador'),
(3, 'Asociación Pro-Bienestar', 'Ana Rodríguez Sánchez', 'Presidenta'),
(4, 'Instituto de Formación Integral', 'Juan Pérez Gómez', 'Director'),
(5, 'Casa de la Juventud', 'Laura Fernández Castillo', 'Gerente'),
(6, 'Organización Rescate Infantil', 'Roberto Morales Díaz', 'Tesorero'),
(7, 'Fundación Educación para Todos', 'Patricia Ramírez Torres', 'Secretaria'),
(8, 'Centro de Apoyo al Estudiante', 'Fernando Gómez Luna', 'Subdirector'),
(9, 'Asociación de Voluntarios Unidos', 'Sofía Herrera Vega', 'Coordinadora General'),
(10, 'Instituto de Desarrollo Social', 'Ricardo Castro Méndez', 'Director Ejecutivo')
ON CONFLICT (id) DO NOTHING;

-- Insertar 10 registros en ss_permisos
INSERT INTO servicio_social.ss_permisos (id, permiso) VALUES
(1, 'crear_organizacion'),
(2, 'editar_organizacion'),
(3, 'eliminar_organizacion'),
(4, 'ver_organizaciones'),
(5, 'crear_programa'),
(6, 'editar_programa'),
(7, 'eliminar_programa'),
(8, 'ver_programas'),
(9, 'asignar_estudiante'),
(10, 'ver_reportes')
ON CONFLICT (id) DO NOTHING;

-- Insertar 10 registros en ss_roles
INSERT INTO servicio_social.ss_roles (id, rol) VALUES
(1, 'Administrador'),
(2, 'Coordinador'),
(3, 'Supervisor'),
(4, 'Docente'),
(5, 'Alumno'),
(6, 'Director'),
(7, 'Asistente'),
(8, 'Invitado'),
(9, 'Auditor'),
(10, 'Consultor')
ON CONFLICT (id) DO NOTHING;

-- Insertar 10 registros en ss_roles_permisos
INSERT INTO servicio_social.ss_roles_permisos (id, id_ss_rol, id_ss_permiso) VALUES
(1, 1, 1),  -- Administrador puede crear organización
(2, 1, 2),  -- Administrador puede editar organización
(3, 1, 3),  -- Administrador puede eliminar organización
(4, 1, 4),  -- Administrador puede ver organizaciones
(5, 2, 4),  -- Coordinador puede ver organizaciones
(6, 2, 5),  -- Coordinador puede crear programa
(7, 3, 8),  -- Supervisor puede ver programas
(8, 4, 8),  -- Docente puede ver programas
(9, 5, 8),  -- Alumno puede ver programas
(10, 2, 10) -- Coordinador puede ver reportes
ON CONFLICT (id) DO NOTHING;

-- Insertar 10 registros en ss_tipos_programas
INSERT INTO servicio_social.ss_tipos_programas (id, nombre_tipo) VALUES
(1, 'Educativo'),
(2, 'Comunitario'),
(3, 'Asistencial'),
(4, 'Ambiental'),
(5, 'Salud'),
(6, 'Cultural'),
(7, 'Deportivo'),
(8, 'Tecnológico'),
(9, 'Empresarial'),
(10, 'Investigación')
ON CONFLICT (id) DO NOTHING;

-- Insertar 10 registros en ss_programas
INSERT INTO servicio_social.ss_programas (id, id_organizacion, id_tipo_programa, nombre_programa, modalidad, fecha_inicio_servicio, fecha_fin_servicio, lista_actividades, plan_trabajo) VALUES
(1, 1, 1, 'Programa de Alfabetización', true, '2024-01-15', '2024-12-15', 'Enseñar lectura y escritura a adultos', NULL),
(2, 2, 2, 'Limpieza de Espacios Públicos', false, '2024-02-01', '2024-11-30', 'Jornadas de limpieza en parques y calles', NULL),
(3, 3, 3, 'Apoyo a Personas Vulnerables', true, '2024-01-10', '2024-12-20', 'Visitas domiciliarias y asistencia social', NULL),
(4, 4, 4, 'Reforestación Urbana', false, '2024-03-01', '2024-10-31', 'Plantación de árboles en áreas verdes', NULL),
(5, 5, 5, 'Campaña de Vacunación', true, '2024-02-15', '2024-08-15', 'Apoyo en jornadas de vacunación', NULL),
(6, 6, 6, 'Talleres de Arte y Cultura', true, '2024-01-20', '2024-12-10', 'Clases de pintura, música y teatro', NULL),
(7, 7, 7, 'Escuela de Fútbol Infantil', false, '2024-02-10', '2024-11-25', 'Entrenamientos deportivos para niños', NULL),
(8, 8, 8, 'Capacitación en Computación', true, '2024-01-05', '2024-12-05', 'Cursos básicos de informática', NULL),
(9, 9, 9, 'Emprendedores Juveniles', true, '2024-03-10', '2024-12-20', 'Talleres de negocios y finanzas', NULL),
(10, 10, 10, 'Investigación de Satisfacción', false, '2024-01-25', '2024-11-15', 'Aplicación de encuestas y análisis de datos', NULL)
ON CONFLICT (id) DO NOTHING;