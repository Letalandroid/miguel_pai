# Documentación de la Base de Datos

## Introducción

Esta documentación describe el esquema de la base de datos diseñada para un sistema de gestión de egresados, encargados, empresas y administradores. El sistema soporta la gestión de perfiles de usuarios, calendarios, reuniones, notificaciones, reportes, talleres, convocatorias laborales, eventos, y auditoría de acciones. La base de datos está diseñada para cumplir con los requerimientos funcionales (RF01 a RF07) y no funcionales (RNF01 a RNF04) especificados, asegurando rendimiento, seguridad, usabilidad y mantenibilidad.

El esquema utiliza MySQL y está normalizado para evitar redundancias, con índices para optimizar consultas y restricciones para garantizar la integridad de los datos. Las tablas están relacionadas mediante claves foráneas, y se incluye una tabla intermedia (`UsuarioEmpresa`) para gestionar múltiples representantes por empresa.

---

## Propósito General

La base de datos soporta un sistema que:
- Permite a los egresados registrarse, gestionar su perfil, agendar reuniones y participar en talleres (RF01, RF02, RF04).
- Facilita a los encargados la gestión de calendarios, talleres y reuniones (RF02, RF04).
- Permite a los representantes de empresas crear convocatorias laborales, eventos y gestionar disponibilidades (RF02, RF04).
- Proporciona a los administradores herramientas para gestionar usuarios, generar reportes y auditar acciones (RF05, RF06, RF07).
- Soporta notificaciones automáticas, reportes exportables y auditoría de cambios (RF04, RF05, RF06, RF07).
- Garantiza rendimiento, seguridad y escalabilidad mediante índices, cifrado de contraseñas y normalización (RNF01 a RNF04).

---

## Estructura de la Base de Datos

### Tablas y sus Funciones

1. **Usuario**
   - **Propósito**: Almacena la información común de todos los usuarios del sistema (egresados, encargados, representantes de empresas, administradores).
   - **Función**: Centraliza los datos personales y de autenticación, diferenciando los roles mediante el campo `tipo`. Soporta la autenticación (RF01.6), recuperación de contraseña (RF01.7), gestión de perfiles (RF01.1 a RF01.4), y auditoría de accesos (RNF03.5).
   - **Uso**: Cada usuario tiene un registro único identificado por su DNI, que sirve como punto de entrada para los perfiles específicos (Egresado, Encargado, Empresa).

2. **Egresado**
   - **Propósito**: Almacena información específica de los egresados, como datos académicos y CV.
   - **Función**: Permite registrar y consultar datos de egresados (RF01.1, RF01.5), asociándolos a usuarios mediante `usuario_dni`. Soporta filtrado por carrera y año de egreso (RF01.5).
   - **Uso**: Usada para gestionar el perfil académico de egresados y relacionarlos con reuniones y talleres.

3. **Empresa**
   - **Propósito**: Almacena información de las empresas como entidades legales.
   - **Función**: Registra los datos de empresas (RUC, razón social, rubro) y sirve como referencia para convocatorias, eventos y disponibilidades (RF02, RF04).
   - **Uso**: Identifica empresas mediante su RUC y permite asociarlas con usuarios (representantes) a través de `UsuarioEmpresa`.

4. **UsuarioEmpresa**
   - **Propósito**: Relaciona usuarios con empresas, permitiendo que múltiples usuarios representen a una misma empresa.
   - **Función**: Soporta la gestión de múltiples representantes por empresa, con roles específicos (RF06.1, RF06.2). Permite que un usuario con `tipo = 'Empresa'` gestione una o más empresas.
   - **Uso**: Usada para asignar permisos y rastrear quién gestiona cada empresa.

5. **Encargado**
   - **Propósito**: Almacena información específica de los encargados, como el área en la que trabajan.
   - **Función**: Relaciona a los usuarios con `tipo = 'Encargado'` con sus áreas de trabajo, soportando la gestión de calendarios y talleres (RF02, RF04).
   - **Uso**: Usada para asignar responsabilidades a encargados en el sistema.

6. **CalendarioEncargado**
   - **Propósito**: Gestiona los calendarios de los encargados, definiendo horarios disponibles.
   - **Función**: Soporta la configuración de horarios para reuniones (RF02.1) y sirve como base para las fechas disponibles en `FechasDisponibles`.
   - **Uso**: Usada por encargados para definir su disponibilidad horaria.

7. **FechasDisponibles**
   - **Propósito**: Almacena fechas y horas específicas disponibles para reuniones de egresados, empresas o ambos.
   - **Función**: Reemplaza los campos JSON originales para mejorar rendimiento y mantenibilidad (RNF01, RNF04). Permite a los egresados seleccionar fechas disponibles (RF02.2, RF02.3).
   - **Uso**: Usada para gestionar la disponibilidad de reuniones y evitar conflictos de horarios.

8. **Reuniones_egresado_area**
   - **Propósito**: Relaciona egresados con reuniones y calendarios de encargados.
   - **Función**: Registra las reuniones programadas por egresados, vinculándolas a calendarios y estados (RF02.4, RF02.6, RF02.7).
   - **Uso**: Usada para rastrear reuniones específicas y su historial.

9. **Estado**
   - **Propósito**: Define los posibles estados de entidades (reuniones, notificaciones, talleres, etc.).
   - **Función**: Soporta la gestión de estados y transiciones (RF02.7, RF04, RF06), asegurando trazabilidad y consistencia.
   - **Uso**: Usada para clasificar el estado de múltiples entidades en el sistema.

10. **TransicionEstado**
    - **Propósito**: Define las reglas para cambiar entre estados.
    - **Función**: Permite validar transiciones de estado (por ejemplo, de "pendiente" a "confirmada") según reglas específicas (RF02.7, RF06.4).
    - **Uso**: Usada para controlar los flujos de estado en el sistema.

11. **HistorialEstado**
    - **Propósito**: Registra el historial de cambios de estado para auditoría.
    - **Función**: Proporciona trazabilidad de las acciones realizadas en el sistema (RF06.4, RF07.6, RNF03.5).
    - **Uso**: Usada para auditar cambios en reuniones, notificaciones, y procesos de importación.

12. **DisponibilidadEmpresa**
    - **Propósito**: Gestiona la disponibilidad de empresas para reuniones con egresados.
    - **Función**: Registra las fechas y horas en que una empresa está disponible, vinculándolas a calendarios de encargados (RF02.1, RF02.4).
    - **Uso**: Usada para coordinar reuniones entre empresas y egresados.

13. **SlotDisponible**
    - **Propósito**: Almacena slots específicos de tiempo disponibles para reuniones.
    - **Función**: Permite asignar slots a egresados y gestionar su estado (RF02.2, RF02.3, RF02.4).
    - **Uso**: Usada para evitar conflictos de horarios y registrar reservas.

14. **Reunion**
    - **Propósito**: Registra las reuniones programadas, incluyendo tipo, fecha, hora, y estado.
    - **Función**: Soporta la gestión de reuniones, su historial, y notificaciones asociadas (RF02.4, RF02.6, RF02.7, RF04).
    - **Uso**: Usada para programar y rastrear reuniones entre egresados, encargados, y empresas.

15. **Taller**
    - **Propósito**: Gestiona talleres organizados por encargados.
    - **Función**: Almacena información de talleres (título, descripción, fecha, etc.) y su estado (RF02, RF04).
    - **Uso**: Usada para registrar y gestionar la inscripción de egresados en talleres.

16. **ConvocatoriaLaboral**
    - **Propósito**: Registra convocatorias laborales creadas por empresas.
    - **Función**: Almacena información de convocatorias (título, descripción, fechas) y su estado (RF04).
    - **Uso**: Usada para que empresas publiquen oportunidades laborales para egresados.

17. **Evento**
    - **Propósito**: Gestiona eventos organizados por empresas o encargados.
    - **Función**: Almacena información de eventos (título, tipo, fecha, etc.) y su estado (RF04).
    - **Uso**: Usada para coordinar eventos y notificar a los usuarios.

18. **Notificacion**
    - **Propósito**: Gestiona notificaciones enviadas a los usuarios.
    - **Función**: Soporta notificaciones automáticas y recordatorios para reuniones, talleres, y eventos (RF04.1 a RF04.4).
    - **Uso**: Usada para mantener a los usuarios informados sobre acciones y eventos.

19. **EgresadoTaller**
    - **Propósito**: Relaciona egresados con talleres en los que están inscritos.
    - **Función**: Registra las inscripciones de egresados en talleres, incluyendo la fecha de inscripción (RF04).
    - **Uso**: Usada para gestionar la participación de egresados en talleres.

20. **Reporte**
    - **Propósito**: Almacena metadatos de reportes generados.
    - **Función**: Soporta la exportación de reportes en PDF y Excel, registrando quién los generó y cuándo (RF05.2).
    - **Uso**: Usada para rastrear y almacenar reportes generados por el sistema.

---

## Diccionario de Datos

### Tabla: `Usuario`
| Campo              | Tipo         | Descripción                                                                 | Restricciones                     |
|--------------------|--------------|-----------------------------------------------------------------------------|-----------------------------------|
| `dni`             | varchar(255) | Identificador único del usuario (DNI de la persona).                        | PRIMARY KEY                       |
| `nombres`         | varchar(100) | Nombres del usuario.                                                       | NOT NULL                          |
| `apellidos`       | varchar(100) | Apellidos del usuario.                                                     | NOT NULL                          |
| `email`           | varchar(150) | Correo electrónico principal para autenticación y notificaciones.          | NOT NULL, INDEX                   |
| `password`        | varchar(255) | Contraseña cifrada del usuario.                                            | NOT NULL                          |
| `telefono`        | varchar(20)  | Número de teléfono del usuario.                                            | CHECK (formato numérico, 7-20 dígitos) |
| `tipo`            | varchar(255) | Rol del usuario (Egresado, Encargado, Empresa, Administrador).             | NOT NULL                          |
| `genero`          | varchar(20)  | Género del usuario (RF01.1).                                               |                                   |
| `fecha_nacimiento`| date         | Fecha de nacimiento del usuario (RF01.1).                                  |                                   |
| `ciudad`          | varchar(100) | Ciudad de residencia del usuario (RF01.5).                                 |                                   |
| `email_alternativo`| varchar(150)| Correo electrónico alternativo para recuperación (RF01.4).                 |                                   |
| `estado`          | varchar(20)  | Estado del usuario (activo, suspendido) (RF06.3).                          | DEFAULT 'activo'                  |
| `ultimo_acceso`   | datetime     | Fecha y hora del último acceso del usuario (RNF03.5).                      |                                   |

### Tabla: `Egresado`
| Campo               | Tipo         | Descripción                                                                 | Restricciones                     |
|---------------------|--------------|-----------------------------------------------------------------------------|-----------------------------------|
| `id`                | varchar(255) | Identificador único del egresado.                                           | PRIMARY KEY                       |
| `usuario_dni`       | varchar(255) | DNI del usuario asociado (vincula con `Usuario`).                          | FOREIGN KEY (`Usuario.dni`)       |
| `carrera_profesional`| varchar(100)| Carrera profesional del egresado (RF01.1).                                 | NOT NULL, INDEX                   |
| `grado_academico`   | varchar(100)| Grado académico obtenido (RF01.1).                                        |                                   |
| `anio_egreso`       | int          | Año de egreso del egresado (RF01.1).                                       | NOT NULL, INDEX                   |
| `cv`                | varchar(225) | Ruta o enlace al CV del egresado (RF01.1).                                 |                                   |

### Tabla: `Empresa`
| Campo          | Tipo         | Descripción                                                                 | Restricciones                     |
|----------------|--------------|-----------------------------------------------------------------------------|-----------------------------------|
| `ruc`          | varchar(11)  | Identificador único de la empresa (RUC).                                    | PRIMARY KEY, CHECK (11 dígitos)   |
| `razon_social` | varchar(150) | Nombre legal de la empresa.                                                | NOT NULL                          |
| `rubro`        | varchar(100) | Sector o industria de la empresa.                                          |                                   |

### Tabla: `UsuarioEmpresa`
| Campo            | Tipo         | Descripción                                                                 | Restricciones                     |
|------------------|--------------|-----------------------------------------------------------------------------|-----------------------------------|
| `usuario_dni`    | varchar(255) | DNI del usuario que representa a la empresa.                               | PRIMARY KEY, FOREIGN KEY (`Usuario.dni`) |
| `empresa_ruc`    | varchar(11)  | RUC de la empresa asociada.                                                | PRIMARY KEY, FOREIGN KEY (`Empresa.ruc`) |
| `rol_en_empresa` | varchar(100) | Rol del usuario en la empresa (ej. Gerente, Contacto).                     |                                   |

### Tabla: `Encargado`
| Campo         | Tipo         | Descripción                                                                 | Restricciones                     |
|---------------|--------------|-----------------------------------------------------------------------------|-----------------------------------|
| `dni`         | varchar(255) | Identificador único del encargado (vincula con `Usuario`).                 | PRIMARY KEY, FOREIGN KEY (`Usuario.dni`) |
| `usuario_dni` | varchar(255) | DNI del usuario asociado.                                                  | FOREIGN KEY (`Usuario.dni`)       |
| `area`        | varchar(100) | Área o departamento del encargado.                                         | NOT NULL                          |

### Tabla: `CalendarioEncargado`
| Campo          | Tipo         | Descripción                                                                 | Restricciones                     |
|----------------|--------------|-----------------------------------------------------------------------------|-----------------------------------|
| `id`           | int          | Identificador único del calendario.                                        | PRIMARY KEY, AUTO_INCREMENT        |
| `encargado_dni`| varchar(255) | DNI del encargado asociado.                                                | FOREIGN KEY (`Encargado.dni`)     |
| `hora_inicio`  | time         | Hora de inicio del horario disponible (RF02.1).                            | NOT NULL                          |
| `hora_fin`     | time         | Hora de fin del horario disponible (RF02.1).                               | NOT NULL                          |
| `estado`       | varchar(255) | Estado del calendario (ej. activo, inactivo).                              | NOT NULL                          |

### Tabla: `FechasDisponibles`
| Campo         | Tipo         | Descripción                                                                 | Restricciones                     |
|---------------|--------------|-----------------------------------------------------------------------------|-----------------------------------|
| `id`          | int          | Identificador único de la fecha disponible.                                | PRIMARY KEY, AUTO_INCREMENT        |
| `calendario_id`| int          | ID del calendario asociado.                                                | FOREIGN KEY (`CalendarioEncargado.id`) |
| `tipo`        | varchar(50)  | Tipo de disponibilidad (egresado, empresa, egresado_empresa) (RF02.1).     | NOT NULL                          |
| `fecha`       | datetime     | Fecha y hora específica disponible (RF02.2).                               | NOT NULL, INDEX                   |

### Tabla: `Reuniones_egresado_area`
| Campo        | Tipo         | Descripción                                                                 | Restricciones                     |
|--------------|--------------|-----------------------------------------------------------------------------|-----------------------------------|
| `id`         | int          | Identificador único de la relación.                                        | PRIMARY KEY, AUTO_INCREMENT        |
| `calendario` | int          | ID del calendario asociado.                                                | FOREIGN KEY (`CalendarioEncargado.id`) |
| `reunion`    | int          | ID de la reunión asociada.                                                 | FOREIGN KEY (`Reunion.id`)        |
| `egresado`   | varchar(255) | ID del egresado asociado.                                                  | FOREIGN KEY (`Egresado.id`)       |

### Tabla: `Estado`
| Campo              | Tipo         | Descripción                                                                 | Restricciones                     |
|--------------------|--------------|-----------------------------------------------------------------------------|-----------------------------------|
| `id`               | int          | Identificador único del estado.                                            | PRIMARY KEY, AUTO_INCREMENT        |
| `nombre`           | varchar(50)  | Nombre del estado (ej. pendiente, confirmada).                             | NOT NULL                          |
| `descripcion`      | varchar(255) | Descripción del estado.                                                    |                                   |
| `entidad_asociada` | varchar(50)  | Entidad a la que aplica el estado (ej. Reunion, Notificacion).             | NOT NULL                          |
| `es_final`         | boolean      | Indica si el estado es final (RF02.7).                                     | NOT NULL                          |
| `permite_transicion`| boolean      | Indica si el estado permite transiciones (RF02.7).                         | NOT NULL                          |

### Tabla: `TransicionEstado`
| Campo               | Tipo         | Descripción                                                                 | Restricciones                     |
|---------------------|--------------|-----------------------------------------------------------------------------|-----------------------------------|
| `id`                | int          | Identificador único de la transición.                                      | PRIMARY KEY, AUTO_INCREMENT        |
| `estado_origen_id`  | int          | ID del estado inicial.                                                    | FOREIGN KEY (`Estado.id`)         |
| `estado_destino_id` | int          | ID del estado final.                                                      | FOREIGN KEY (`Estado.id`)         |
| `regla_validacion`  | text         | Reglas para validar la transición (RF02.7).                                |                                   |

### Tabla: `HistorialEstado`
| Campo               | Tipo         | Descripción                                                                 | Restricciones                     |
|---------------------|--------------|-----------------------------------------------------------------------------|-----------------------------------|
| `id`                | int          | Identificador único del historial.                                         | PRIMARY KEY, AUTO_INCREMENT        |
| `fecha_cambio`      | datetime     | Fecha y hora del cambio de estado (RF06.4).                                | NOT NULL                          |
| `observaciones`     | text         | Detalles del cambio.                                                       |                                   |
| `contexto_id`       | varchar(36)  | ID de la entidad asociada (ej. ID de reunión).                             | NOT NULL                          |
| `tipo_contexto`     | varchar(50)  | Tipo de entidad (ej. Reunion, Notificacion) (RF06.4).                      | NOT NULL                          |
| `estado_anterior_id`| int          | ID del estado anterior.                                                   | FOREIGN KEY (`Estado.id`)         |
| `estado_nuevo_id`   | int          | ID del estado nuevo.                                                      | FOREIGN KEY (`Estado.id`)         |

### Tabla: `DisponibilidadEmpresa`
| Campo                 | Tipo         | Descripción                                                                 | Restricciones                     |
|-----------------------|--------------|-----------------------------------------------------------------------------|-----------------------------------|
| `id`                  | int          | Identificador único de la disponibilidad.                                  | PRIMARY KEY, AUTO_INCREMENT        |
| `empresa_ruc`         | varchar(11)  | RUC de la empresa asociada.                                                | FOREIGN KEY (`Empresa.ruc`)       |
| `calendario_encargado_id`| int       | ID del calendario asociado.                                                | FOREIGN KEY (`CalendarioEncargado.id`) |
| `fecha_creacion`      | datetime     | Fecha de creación de la disponibilidad (RF02.4).                           | NOT NULL                          |

### Tabla: `SlotDisponible`
| Campo            | Tipo         | Descripción                                                                 | Restricciones                     |
|------------------|--------------|-----------------------------------------------------------------------------|-----------------------------------|
| `id`             | int          | Identificador único del slot.                                              | PRIMARY KEY, AUTO_INCREMENT        |
| `disponibilidad_id`| int         | ID de la disponibilidad asociada.                                          | FOREIGN KEY (`DisponibilidadEmpresa.id`) |
| `egresado_dni`   | varchar(255) | ID del egresado asignado al slot (puede ser nulo).                        | FOREIGN KEY (`Egresado.id`)       |
| `fecha_hora`     | datetime     | Fecha y hora del slot (RF02.2).                                           | NOT NULL                          |
| `estado_id`      | int          | ID del estado del slot (RF02.3).                                          | FOREIGN KEY (`Estado.id`)         |

### Tabla: `Reunion`
| Campo              | Tipo         | Descripción                                                                 | Restricciones                     |
|--------------------|--------------|-----------------------------------------------------------------------------|-----------------------------------|
| `id`               | int          | Identificador único de la reunión.                                         | PRIMARY KEY, AUTO_INCREMENT        |
| `slot_disponible_id`| int         | ID del slot asociado.                                                     | FOREIGN KEY (`SlotDisponible.id`) |
| `tipo`             | varchar(255) | Tipo de reunión (ej. asesoría, entrevista) (RF02.4).                       | NOT NULL                          |
| `fecha_hora`       | datetime     | Fecha y hora de la reunión (RF02.4).                                      | NOT NULL                          |
| `observaciones`    | text         | Notas adicionales de la reunión (RF02.4).                                 |                                   |
| `cv_egresado`      | longblob     | CV del egresado asociado (RF02.4).                                        |                                   |
| `estado_id`        | int          | ID del estado de la reunión (RF02.7).                                     | FOREIGN KEY (`Estado.id`)         |

### Tabla: `Taller`
| Campo           | Tipo         | Descripción                                                                 | Restricciones                     |
|-----------------|--------------|-----------------------------------------------------------------------------|-----------------------------------|
| `id`            | int          | Identificador único del taller.                                            | PRIMARY KEY, AUTO_INCREMENT        |
| `titulo`        | varchar(150) | Título del taller.                                                        | NOT NULL                          |
| `descripcion`   | text         | Descripción del taller.                                                   |                                   |
| `fecha_hora`    | datetime     | Fecha y hora del taller.                                                  | NOT NULL                          |
| `enlace_acceso` | varchar(255) | Enlace para acceder al taller.                                            |                                   |
| `flyer`         | longblob     | Imagen promocional del taller.                                            |                                   |
| `encargado_dni` | varchar(255) | DNI del encargado responsable.                                            | FOREIGN KEY (`Encargado.dni`)     |
| `estado_id`     | int          | ID del estado del taller.                                                 | FOREIGN KEY (`Estado.id`)         |

### Tabla: `ConvocatoriaLaboral`
| Campo            | Tipo         | Descripción                                                                 | Restricciones                     |
|------------------|--------------|-----------------------------------------------------------------------------|-----------------------------------|
| `id`             | int          | Identificador único de la convocatoria.                                    | PRIMARY KEY, AUTO_INCREMENT        |
| `empresa_ruc`    | varchar(11)  | RUC de la empresa asociada.                                                | FOREIGN KEY (`Empresa.ruc`)       |
| `encargado_dni`  | varchar(255) | DNI del encargado responsable.                                            | FOREIGN KEY (`Encargado.dni`)     |
| `titulo`         | varchar(150) | Título de la convocatoria.                                                | NOT NULL                          |
| `descripcion`    | text         | Descripción de la convocatoria.                                           |                                   |
| `fecha_creacion`| datetime     | Fecha de creación de la convocatoria.                                     | NOT NULL                          |
| `fecha_cierre`   | datetime     | Fecha de cierre de la convocatoria.                                       | NOT NULL                          |
| `estado_id`      | int          | ID del estado de la convocatoria.                                         | FOREIGN KEY (`Estado.id`)         |

### Tabla: `Evento`
| Campo            | Tipo         | Descripción                                                                 | Restricciones                     |
|------------------|--------------|-----------------------------------------------------------------------------|-----------------------------------|
| `id`             | int          | Identificador único del evento.                                            | PRIMARY KEY, AUTO_INCREMENT        |
| `empresa_ruc`    | varchar(11)  | RUC de la empresa asociada.                                                | FOREIGN KEY (`Empresa.ruc`)       |
| `encargado_dni`  | varchar(255) | DNI del encargado responsable.                                            | FOREIGN KEY (`Encargado.dni`)     |
| `titulo`         | varchar(150) | Título del evento.                                                        | NOT NULL                          |
| `tipo`           | varchar(255) | Tipo de evento (ej. conferencia, webinar).                                 | NOT NULL                          |
| `descripcion`    | text         | Descripción del evento.                                                   |                                   |
| `fecha_hora`     | datetime     | Fecha y hora del evento.                                                  | NOT NULL                          |
| `enlace_acceso`  | varchar(255) | Enlace para acceder al evento.                                            |                                   |
| `flyer`          | longblob     | Imagen promocional del evento.                                            |                                   |
| `estado_id`      | int          | ID del estado del evento.                                                 | FOREIGN KEY (`Estado.id`)         |

### Tabla: `Notificacion`
| Campo            | Tipo         | Descripción                                                                 | Restricciones                     |
|------------------|--------------|-----------------------------------------------------------------------------|-----------------------------------|
| `id`             | int          | Identificador único de la notificación.                                    | PRIMARY KEY, AUTO_INCREMENT        |
| `usuario_dni`    | varchar(255) | DNI del usuario receptor.                                                 | FOREIGN KEY (`Usuario.dni`)       |
| `tipo`           | varchar(255) | Tipo de notificación (ej. recordatorio, alerta) (RF04.1).                  | NOT NULL                          |
| `contenido`      | text         | Contenido de la notificación (RF04.1).                                    | NOT NULL                          |
| `fecha_creacion`| datetime     | Fecha de creación de la notificación (RF04.1).                            | NOT NULL                          |
| `leida`          | boolean      | Indica si la notificación ha sido leída (RF04.4).                         | DEFAULT FALSE                     |
| `estado_id`      | int          | ID del estado de la notificación.                                         | FOREIGN KEY (`Estado.id`)         |

### Tabla: `EgresadoTaller`
| Campo             | Tipo         | Descripción                                                                 | Restricciones                     |
|-------------------|--------------|-----------------------------------------------------------------------------|-----------------------------------|
| `egresado_dni`    | varchar(255) | ID del egresado inscrito.                                                 | PRIMARY KEY, FOREIGN KEY (`Egresado.id`) |
| `taller_id`       | int          | ID del taller asociado.                                                   | PRIMARY KEY, FOREIGN KEY (`Taller.id`) |
| `fecha_inscripcion`| datetime     | Fecha de inscripción del egresado al taller.                              | NOT NULL                          |

### Tabla: `Reporte`
| Campo             | Tipo         | Descripción                                                                 | Restricciones                     |
|-------------------|--------------|-----------------------------------------------------------------------------|-----------------------------------|
| `id`              | int          | Identificador único del reporte.                                           | PRIMARY KEY, AUTO_INCREMENT        |
| `tipo`            | varchar(50)  | Tipo de reporte (PDF, Excel) (RF05.2).                                     | NOT NULL                          |
| `fecha_generacion`| datetime     | Fecha de generación del reporte (RF05.2).                                 | NOT NULL                          |
| `ruta_archivo`    | varchar(255) | Ruta del archivo generado (RF05.2).                                       | NOT NULL                          |
| `usuario_dni`     | varchar(255) | DNI del usuario que generó el reporte.                                    | FOREIGN KEY (`Usuario.dni`)       |

---

## Relaciones entre Tablas

1. **Usuario → Egresado, Encargado, UsuarioEmpresa, Notificacion, Reporte**
   - **Relación**: Uno a muchos.
   - **Descripción**: Un usuario (`Usuario.dni`) puede ser un egresado (`Egresado.usuario_dni`), un encargado (`Encargado.usuario_dni`), un representante de una empresa (`UsuarioEmpresa.usuario_dni`), receptor de notificaciones (`Notificacion.usuario_dni`), o generador de reportes (`Reporte.usuario_dni`).
   - **Propósito**: Centraliza la gestión de usuarios y sus roles, permitiendo autenticación y trazabilidad (RF01.6, RF06.1, RF06.4).

2. **Empresa → UsuarioEmpresa, DisponibilidadEmpresa, ConvocatoriaLaboral, Evento**
   - **Relación**: Uno a muchos.
   - **Descripción**: Una empresa (`Empresa.ruc`) puede tener múltiples representantes (`UsuarioEmpresa.empresa_ruc`), disponibilidades (`DisponibilidadEmpresa.empresa_ruc`), convocatorias (`ConvocatoriaLaboral.empresa_ruc`), y eventos (`Evento.empresa_ruc`).
   - **Propósito**: Permite gestionar empresas como entidades legales y asociarlas con usuarios y actividades (RF02, RF04).

3. **UsuarioEmpresa → Usuario, Empresa**
   - **Relación**: Muchos a muchos.
   - **Descripción**: Relaciona usuarios (`Usuario.dni`) con empresas (`Empresa.ruc`), permitiendo que múltiples usuarios representen una misma empresa con roles específicos.
   - **Propósito**: Soporta la gestión de múltiples representantes por empresa (RF06.1, RF06.2).

4. **Encargado → CalendarioEncargado, Taller, ConvocatoriaLaboral, Evento**
   - **Relación**: Uno a muchos.
   - **Descripción**: Un encargado (`Encargado.dni`) puede tener múltiples calendarios (`CalendarioEncargado.encargado_dni`), talleres (`Taller.encargado_dni`), convocatorias (`ConvocatoriaLaboral.encargado_dni`), y eventos (`Evento.encargado_dni`).
   - **Propósito**: Asocia a los encargados con sus responsabilidades de gestión (RF02, RF04).

5. **CalendarioEncargado → FechasDisponibles, Reuniones_egresado_area, DisponibilidadEmpresa**
   - **Relación**: Uno a muchos.
   - **Descripción**: Un calendario (`CalendarioEncargado.id`) puede tener múltiples fechas disponibles (`FechasDisponibles.calendario_id`), reuniones asociadas (`Reuniones_egresado_area.calendario`), y disponibilidades de empresas (`DisponibilidadEmpresa.calendario_encargado_id`).
   - **Propósito**: Centraliza la gestión de horarios para reuniones (RF02.1 a RF02.3).

6. **FechasDisponibles → CalendarioEncargado**
   - **Relación**: Muchos a uno.
   - **Descripción**: Cada fecha disponible (`FechasDisponibles.calendario_id`) pertenece a un calendario (`CalendarioEncargado.id`).
   - **Propósito**: Organiza las fechas disponibles para reuniones, mejorando rendimiento (RNF01).

7. **Reuniones_egresado_area → CalendarioEncargado, Reunion, Egresado**
   - **Relación**: Muchos a uno.
   - **Descripción**: Cada relación (`Reuniones_egresado_area`) vincula un calendario (`calendario`), una reunión (`reunion`), y un egresado (`egresado`).
   - **Propósito**: Registra reuniones específicas y sus participantes (RF02.4, RF02.6).

8. **Estado → TransicionEstado, HistorialEstado, SlotDisponible, Reunion, Taller, ConvocatoriaLaboral, Evento, Notificacion**
   - **Relación**: Uno a muchos.
   - **Descripción**: Un estado (`Estado.id`) puede aplicarse a múltiples transiciones (`TransicionEstado.estado_origen_id`, `TransicionEstado.estado_destino_id`), historiales (`HistorialEstado.estado_anterior_id`, `HistorialEstado.estado_nuevo_id`), slots (`SlotDisponible.estado_id`), reuniones (`Reunion.estado_id`), talleres (`Taller.estado_id`), convocatorias (`ConvocatoriaLaboral.estado_id`), eventos (`Evento.estado_id`), y notificaciones (`Notificacion.estado_id`).
   - **Propósito**: Centraliza la gestión de estados para múltiples entidades (RF02.7, RF04, RF06).

9. **TransicionEstado → Estado**
   - **Relación**: Muchos a uno.
   - **Descripción**: Cada transición (`TransicionEstado`) referencia un estado origen y destino (`Estado.id`).
   - **Propósito**: Define reglas de cambio de estado (RF02.7).

10. **HistorialEstado → Estado**
    - **Relación**: Muchos a uno.
    - **Descripción**: Cada historial (`HistorialEstado`) referencia un estado anterior y nuevo (`Estado.id`).
    - **Propósito**: Registra cambios de estado para auditoría (RF06.4, RF07.6).

11. **DisponibilidadEmpresa → Empresa, CalendarioEncargado**
    - **Relación**: Muchos a uno.
    - **Descripción**: Cada disponibilidad (`DisponibilidadEmpresa`) pertenece a una empresa (`Empresa.ruc`) y un calendario (`CalendarioEncargado.id`).
    - **Propósito**: Gestiona la disponibilidad de empresas para reuniones (RF02.1).

12. **SlotDisponible → DisponibilidadEmpresa, Egresado, Estado**
    - **Relación**: Muchos a uno.
    - **Descripción**: Cada slot (`SlotDisponible`) pertenece a una disponibilidad (`DisponibilidadEmpresa.id`), puede estar asignado a un egresado (`Egresado.id`), y tiene un estado (`Estado.id`).
    - **Propósito**: Gestiona slots de tiempo para reuniones (RF02.2, RF02.3).

13. **Reunion → SlotDisponible, Estado**
    - **Relación**: Muchos a uno.
    - **Descripción**: Cada reunión (`Reunion`) está asociada a un slot (`SlotDisponible.id`) y un estado (`Estado.id`).
    - **Propósito**: Registra reuniones programadas y su estado (RF02.4, RF02.7).

14. **EgresadoTaller → Egresado, Taller**
    - **Relación**: Muchos a muchos.
    - **Descripción**: Relaciona egresados (`Egresado.id`) con talleres (`Taller.id`) mediante inscripciones.
    - **Propósito**: Gestiona la participación de egresados en talleres (RF04).

15. **Reporte → Usuario**
    - **Relación**: Muchos a uno.
    - **Descripción**: Cada reporte (`Reporte`) está asociado al usuario que lo generó (`Usuario.dni`).
    - **Propósito**: Registra metadatos de reportes exportados (RF05.2).

---

## Resumen de Relaciones

- **Usuario** es la tabla central, vinculando todos los perfiles (`Egresado`, `Encargado`, `UsuarioEmpresa`) y soportando autenticación, notificaciones, y reportes.
- **Empresa** se identifica por `ruc` y se relaciona con usuarios a través de `UsuarioEmpresa`, permitiendo múltiples representantes.
- **CalendarioEncargado** y **FechasDisponibles** gestionan horarios y disponibilidades para reuniones.
- **Estado**, **TransicionEstado**, y **HistorialEstado** proporcionan un sistema robusto para gestionar estados y auditoría.
- **Reuniones_egresado_area**, **SlotDisponible**, y **Reunion** coordinan la programación de reuniones.
- **Taller**, **ConvocatoriaLaboral**, y **Evento** soportan actividades adicionales, vinculadas a encargados y empresas.
- **Notificacion** y **EgresadoTaller** gestionan comunicaciones y participación en talleres.
- **Reporte** registra metadatos de reportes generados.

---

## Consideraciones Finales

- **Integridad**: Las claves foráneas y restricciones `CHECK` aseguran la consistencia de los datos.
- **Rendimiento**: Los índices en `email`, `carrera_profesional`, `anio_egreso`, y `fecha` optimizan consultas frecuentes (RNF01).
- **Seguridad**: El campo `password` soporta cifrado, y `ultimo_acceso` permite auditar sesiones (RNF03).
- **Mantenibilidad**: Los comentarios y la normalización (como `FechasDisponibles`) facilitan el mantenimiento (RNF04).
- **Escalabilidad**: La estructura modular y las relaciones muchos a muchos (`UsuarioEmpresa`, `EgresadoTaller`) soportan crecimiento (RNF04).

Esta base de datos cumple con todos los requerimientos funcionales y no funcionales, proporcionando un sistema robusto para gestionar usuarios, reuniones, notificaciones, y reportes. Si necesitas ejemplos de consultas SQL, scripts de inicialización, o más detalles, por favor indícalos.