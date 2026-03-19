# GiveSync

Plataforma backend para facilitar donaciones monetarias a instituciones benéficas.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/express-5.1.0-blue)](https://expressjs.com/)

## Tabla de Contenidos

- [Descripción](#descripción)
- [Características Principales](#características-principales)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración de Variables de Entorno](#configuración-de-variables-de-entorno)
- [Uso de la Aplicación](#uso-de-la-aplicación)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [API Endpoints](#api-endpoints)
- [Licencia](#licencia)
- [Autores](#autores)

## Descripción

GiveSync es una API REST desarrollada para conectar donantes con instituciones benéficas como comedores públicos, orfanatos y hogares para ancianos. La plataforma facilita donaciones monetarias seguras y transparentes, permitiendo a los usuarios ver perfiles de instituciones, sus actividades y realizar contribuciones de manera confiable.

El sistema promueve la transparencia mediante publicaciones que muestran cómo se utilizan los fondos, creando una comunidad solidaria y verificada donde los administradores validan la autenticidad de las instituciones antes de ser aceptadas en la plataforma.

## Características Principales

- **Gestión de Instituciones**: Registro y validación de instituciones benéficas (comedores, orfanatos, hogares para ancianos)
- **Sistema de Donaciones**: Procesamiento seguro de donaciones monetarias con registro detallado
- **Transparencia Total**: Publicaciones de instituciones mostrando el uso de los fondos
- **Validación Administrativa**: Los administradores aprueban o rechazan solicitudes de instituciones
- **Gestión de Usuarios**: Roles diferenciados (administradores, clientes) con permisos específicos
- **Publicaciones Multimedia**: Soporte para imágenes y texto en las publicaciones institucionales
- **Sistema de Comentarios**: Interacción entre usuarios e instituciones
- **Notificaciones en Tiempo Real**: Sistema de notificaciones mediante Socket.IO
- **Reportes y Estadísticas**: Exportación de datos a Excel para análisis
- **API RESTful**: Endpoints bien estructurados para fácil integración
- **Seguridad Implementada**: Autenticación JWT, limitación de peticiones, CORS y seguridad de cabeceras

## Tecnologías Utilizadas

### Backend
- **Node.js** - Entorno de ejecución
- **Express.js** - Framework web
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticación mediante tokens
- **Argon2** - Cifrado de contraseñas
- **Socket.IO** - Comunicación en tiempo real

### Middleware y Utilidades
- **Morgan** - Registro de peticiones HTTP
- **Helmet** - Seguridad de cabeceras
- **CORS** - Compartir recursos entre orígenes
- **Multer** - Manejo de archivos
- **Express-validator** - Validación de datos
- **Express-rate-limit** - Limitación de peticiones
- **ExcelJS** - Generación de reportes en Excel
- **Dotenv** - Gestión de variables de entorno

## Requisitos Previos

- Node.js >= 18.0.0
- MongoDB >= 5.0
- npm >= 8.0.0
- Git

## Instalación

Sigue estos pasos para configurar el proyecto en tu entorno local:

### 1. Clonar el repositorio
```bash
git clone https://github.com/gabrielpinula/GiveSync_Backend
cd GiveSync_Backend
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Crea un archivo `.env` en la raíz del proyecto:

```bash
cp .env.example .env
```

Edita el archivo `.env` con tu configuración (ver en la sección de configuración).

### 4. Iniciar MongoDB
Asegúrate de que MongoDB esté corriendo en tu sistema.

### 5. Ejecutar la aplicación
```bash
# Modo desarrollo con reinicio automático
npm run dev

# Modo producción
npm start
```

El servidor se iniciará en `http://localhost:3000` por defecto.

## Configuración de Variables de Entorno

Copia el archivo de ejemplo de variables de entorno y crea tu archivo `.env`:

```bash
cp .env.example .env
```

Luego edita el archivo .env con la configuración necesaria para tu entorno.

Ejemplo de variables de entorno:

```env
# Configuración del servidor
PORT=3000
NODE_ENV=development

# Base de datos MongoDB
URI_MONGO=mongodb://localhost:27017/givesync

# JWT
SECRET_KEY=your_super_secret_key

# URL del cliente - Frontend
CLIENT_URL=http://localhost:5173

# Usuario administrador por defecto
ADMIN_NAME=Admin
ADMIN_SURNAME=User
ADMIN_USERNAME=admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
ADMIN_ROLE=ADMIN
```
> Nota: El archivo `.env` no está versionado y debe crearse localmente a partir de `.env.example`.

## Uso de la Aplicación

### Iniciar el servidor
```bash
# Desarrollo
npm run dev

# Producción
npm start
```

### Verificar el servidor
```bash
curl http://localhost:3000
```

### Registro de usuario
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "surname": "Smith",
    "username": "johnsmith",
    "email": "john@example.com",
    "password": "securePassword123"
  }'
```

### Inicio de sesión
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securePassword123"
  }'
```

### Crear institución (solicitud)
```bash
curl -X POST http://localhost:3000/v1/institution/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Comedor Solidario",
    "type": "EATERS",
    "description": "Comedor que sirve alimentos a personas en situación de vulnerabilidad",
    "address": "Calle Principal zona 1, Ciudad",
    "phone": "+50212345678"
  }'
```

### Realizar donación
```bash
curl -X POST http://localhost:3000/v1/donation/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "amount": 100,
    "institution": "INSTITUTION_ID"
  }'
```

## Estructura del Proyecto

```
GiveSync_Backend/
├── configs/                # Configuraciones de la aplicación
│   ├── app.js              # Configuración de Express y rutas
│   └── mongo.js            # Configuración de MongoDB
├── middlewares/            # Middlewares personalizados
│   ├── delete.file.on.errors.js
│   ├── multer.uploads.js
│   ├── rate.limit.js
│   ├── uploadHotelImage.js
│   ├── validate.errors.js
│   ├── validate.jwt.js
│   └── validators.js
├── src/                    # Código fuente principal
│   ├── auth/               # Autenticación y autorización
│   ├── comment/            # Gestión de comentarios
│   ├── donation/           # Gestión de donaciones
│   ├── excel/              # Reportes y exportación
│   ├── institution/        # Gestión de instituciones
│   ├── notification/       # Sistema de notificaciones
│   ├── publication/        # Gestión de publicaciones
│   └── user/               # Gestión de usuarios
├── utils/                  # Utilidades y funciones helper
├── uploads/                # Archivos subidos (imágenes, etc.)
├── .env                    # Variables de entorno (no versionado)
├── .env.example            # Ejemplo de variables de entorno
├── .gitignore              # Archivos ignorados por Git
├── index.js                # Punto de entrada de la aplicación
├── package.json            # Dependencias y scripts
└── README.md               # Documentación del proyecto
```

## API Endpoints

### Autenticación
- `POST /api/auth/register` - Registro de nuevos usuarios
- `POST /api/auth/login` - Inicio de sesión
- `GET /api/auth/test` - Endpoint de prueba (requiere autenticación)

### Usuarios
#### Clientes (Autenticados)
- `GET /v1/user/getAuthenticatedClient` - Obtener datos del cliente autenticado
- `PUT /v1/user/updateClient/` - Actualizar datos del cliente
- `DELETE /v1/user/deleteClient/` - Eliminar cuenta del cliente
- `PUT /v1/user/updatePassword/` - Cambiar contraseña del cliente
- `PUT /v1/user/updateUserImageClient/` - Actualizar imagen de perfil del cliente
- `DELETE /v1/user/deleteUserImageClient/` - Eliminar imagen de perfil del cliente

#### Administradores
- `GET /v1/user/getAllUsersADMIN` - Obtener todos los usuarios (solo admin)
- `GET /v1/user/getByIdADMIN/:id` - Obtener usuario por ID (solo admin)
- `PUT /v1/user/updateUserADMIN/:id` - Actualizar usuario (solo admin)
- `PUT /v1/user/changeRoleADMIN/:id` - Cambiar rol de usuario (solo admin)
- `DELETE /v1/user/deleteUserAdmin/` - Eliminar usuario (solo admin)
- `PUT /v1/user/updateUserImage/:id` - Actualizar imagen de usuario (solo admin)
- `DELETE /v1/user/deleteUserImage/:id` - Eliminar imagen de usuario (solo admin)

### Instituciones
- `GET /v1/institution/all` - Obtener todas las instituciones públicas
- `GET /v1/institution/pending` - Obtener instituciones pendientes de aprobación
- `GET /v1/institution/my` - Obtener instituciones del usuario autenticado
- `GET /v1/institution/:id` - Obtener institución por ID
- `POST /v1/institution/add` - Crear nueva institución (solicitud)
- `PUT /v1/institution/updateState/:id` - Actualizar estado de institución (aceptar/rechazar)
- `PUT /v1/institution/update/:id` - Actualizar datos de institución
- `PUT /v1/institution/updateImage/:id` - Actualizar imágenes de institución
- `DELETE /v1/institution/delete/:id` - Eliminar institución

### Donaciones
- `GET /v1/donation/` - Obtener todas las donaciones (requiere autenticación)
- `GET /v1/donation/:id` - Obtener donación por ID
- `POST /v1/donation/add` - Crear nueva donación
- `GET /v1/donation/institution/my` - Obtener donaciones a mis instituciones

### Publicaciones
- `GET /v1/publication/my` - Obtener mis instituciones (para publicaciones)
- `GET /v1/publication/test` - Endpoint de prueba
- `GET /v1/publication/list` - Obtener todas las publicaciones
- `GET /v1/publication/:id` - Obtener publicación por ID
- `GET /v1/publication/getByInstitution/:institutionId` - Obtener publicaciones por institución
- `POST /v1/publication/add` - Crear nueva publicación
- `PUT /v1/publication/update/:id` - Actualizar publicación
- `PUT /v1/publication/updateImage/:id` - Actualizar imágenes de publicación
- `DELETE /v1/publication/delete/:id` - Eliminar publicación

### Comentarios
- `GET /v1/comment/` - Obtener todos los comentarios
- `GET /v1/comment/:id` - Obtener comentario por ID
- `POST /v1/comment/` - Crear nuevo comentario
- `PUT /v1/comment/:id` - Actualizar comentario
- `DELETE /v1/comment/:id` - Eliminar comentario
- `GET /v1/comment/publication/:publicationId` - Obtener comentarios por publicación
- `GET /v1/comment/user/:userId` - Obtener comentarios por usuario

### Notificaciones
- `GET /v1/notification/all` - Obtener todas las notificaciones
- `GET /v1/notification/my` - Obtener notificaciones del usuario autenticado
- `PUT /v1/notification/markAsRead/:id` - Marcar notificación como leída
- `DELETE /v1/notification/delete/:id` - Eliminar notificación

### Reportes
- `GET /v1/export-excel` - Exportar datos a Excel (instituciones)

## Licencia

Este proyecto está licenciado bajo la Licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más detalles.

## Autores

- **Gabriel Pinula (GP)** - Desarrollo Principal - [gabrielpinula](https://github.com/gabrielpinula)
- **Marcos Pamal (MP)** - Desarrollo y Colaboración - [mpamal-2023046](https://github.com/mpamal-2023046)
- **Kenny Terraza (KT)** - Desarrollo y Colaboración [kterraza-2023022](https://github.com/kterraza-2023022)
- **Dylan Julian (DJ)** - Desarrollo y Colaboración - [djulian-2023098](https://github.com/djulian-2023098)
- **Andre Figueroa (AF)** - Desarrollo y Colaboración [afigueroa-2023106](https://github.com/afigueroa-2023106)

## Contacto

Si tienes alguna pregunta o sugerencia, no dudes en contactarnos:

- **Email**: gpinula-2020433@kinal.edu.gt
- **GitHub Issues**: [Issues del Proyecto](https://github.com/gabrielpinula/GiveSync_Backend/issues)

Gracias por tu interés en este proyecto y por contribuir a hacer del mundo un lugar mejor a través de las donaciones solidarias.