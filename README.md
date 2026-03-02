# SADARA - Sistema de Administración de Registro de Asignaturas

## Introducción / Contexto

Este proyecto no busca reemplazar un ERP o Intranet académico completo, sino demostrar cómo abordo un problema real de gestión académica desde una perspectiva técnica y de diseño, mediante un módulo demostrativo. Como proyecto de portafolio, el enfoque principal está en:

- Solucionar la gestión de toma de ramos
- Arquitectura de software
- Modelado de dominio
- Multi-tenancy
- Manejo de roles de usuario

Al ser un proyecto académico/portafolio, no está orientado a monetización real. Esta decisión justifica el por qué ciertas funcionalidades no existen y no aplican.

## ¿Qué es SADARA?

SADARA (Software de Administración de Registro de Asignaturas) es un sistema diseñado para la gestión de toma de ramos en instituciones educativas de nivel superior. El sistema permite configurar una malla académica dentro de un conjunto limitado de reglas predefinidas, representativas de un escenario real.

Este proyecto funciona como un MVP que cuenta con un ambiente de producción hosteado en Azure Free Tier, con usuarios definidos y un flujo exacto pensado para resolver de forma administrativa la formación de tomas de ramos semestrales de alumnos.

## Objetivo del Proyecto

Desarrollar un sistema multi-institución que demuestre capacidades técnicas en:

- Arquitectura modular escalable en complejidad funcional
- Gestión de dominios complejos
- Implementación de multi-tenancy
- Control de acceso basado en roles
- Validaciones de negocio complejas

## Alcance Funcional

### Alcance del Sistema

**Multi-institución:**
- Soporta múltiples instituciones
- Cada institución tiene sus propios datos
- Cada institución no puede acceder a datos de otras instituciones
- Aislamiento lógico mediante `institucion_id`

**Configuración por Institución:**
- Carreras/programa académico
- Asignaturas
- Periodos académicos
- Reglas básicas (prerrequisitos, cupos máximos, estado de inscripción/avance)

**Capacidades del Estudiante:**
- Habilitar una inscripción de ramos
- Ver la oferta de asignaturas disponible
- Inscribir asignaturas
- Eliminar asignaturas
- Visualizar cupos
- Visualizar prerrequisitos

### Proceso de Inscripción

El sistema implementa un flujo completo de inscripción que incluye:
- Validación de prerrequisitos
- Control de cupos disponibles
- Gestión de periodos académicos
- Motor de reglas para validaciones de negocio

### Autenticación y Autorización

- Autenticación básica con JWT
- Autorización basada en roles
- Acceso limitado por institución

## Usuarios y Responsabilidades

**Super Admin:**
- Puede crear instituciones
- Ver estado general del sistema
- No interactúa con datos académicos internos

**Admin Institución:**
- Gestionar configuración de su institución
- Administrar carreras y asignaturas
- Configurar periodos académicos
- No puede acceder a datos de otras instituciones

**Estudiante:**
- Realizar proceso de inscripción
- Gestionar sus asignaturas inscritas
- No puede modificar reglas ni configuraciones académicas

## Fuera de Alcance

Este proyecto **NO** incluye:

- Pagos o aranceles
- Gestión de notas
- Gestión de docentes
- RRHH
- Integración con LMS
- Reportes avanzados
- App móvil
- Analítica o BI

Estas exclusiones son intencionales y permiten mantener el proyecto enfocado en dominio, arquitectura y control de acceso.

## Decisiones Arquitectónicas

### Arquitectura de Software: Monolito Modular

Debido a la naturaleza del proyecto, magnitud y contexto, decidí que la arquitectura más adecuada es **monolito modular**. Esto me permite con un solo deploy en NestJS tener las funcionalidades organizadas en módulos independientes (auth, inscripción, académico, reglas, etc.).

### Arquitectura de Datos: Multi-tenant

En una sola instancia puedo servir a múltiples instituciones y cada una podrá ver sus datos gracias al filtrado por `institucion_id`. Las instituciones comparten base de datos, mas no la misma aplicación.

### Justificación de Tecnologías

**Angular:**
Angular se utiliza como framework principal debido a las restricciones estructurales que tiene. El hecho de que asuma TypeScript tipado e incluya enrutamiento, manejo de formularios, estructura e inyección de dependencias, fue determinante para esta elección, además de ser un framework adecuado para profundizar en arquitectura de software.

**NestJS:**
Con NestJS es un poco más de lo mismo, inspirado en Angular, y por ende, una elección bastante natural. En este caso además para construir APIs bien estructuradas con separación de capas real y no solamente enrutadas en un archivo. Además, el proyecto al tener reglas de negocio complejas (autenticación, roles, validaciones, múltiples entidades) hace que sea un stack completo en conjunto con Prisma, PostgreSQL y Azure.

**PostgreSQL + Prisma:**
Base de datos relacional Open Source como elección por defecto, en conjunto con Prisma, un ORM moderno para TypeScript me permiten tener mi base de datos en un lenguaje ya utilizado y legible.

**Azure:**
Azure se utiliza únicamente como entorno de despliegue básico por afinidad con el stack y facilidad de integración, no como una decisión definitiva de arquitectura cloud ni de infraestructura productiva.

## Arquitectura Técnica

### Alcance Técnico

- Frontend monolito modular (SPA)
- Backend monolito modular (API REST)
- Base de datos relacional
- Control de acceso por roles
- Multi-tenancy en gestión de datos
- Validaciones de dominio en backend
- Hosting en infraestructura cloud

### Diagrama de Arquitectura
```
┌──────────────────────────────────────────────────────┐
│                  Angular SPA                         │
│             (Frontend Multi-tenant)                  │
│          Hosting: Azure Static Web Apps              │
└────────────────────────┬─────────────────────────────┘
                         │ HTTPS / REST API
                         │
┌────────────────────────▼─────────────────────────────┐
│               NestJS – API Backend                   │
│               Hosting: Azure App Service             │
│                                                      │
│  ┌─────────────┬──────────────┬──────────────────┐   │
│  │   Módulo    │    Módulo    │      Módulo      │   │
│  │    Auth     │  Institución │    Académico     │   │
│  └─────────────┴──────────────┴──────────────────┘   │
│  ┌─────────────┬──────────────┬──────────────────┐   │
│  │   Módulo    │    Módulo    │      Módulo      │   │
│  │ Inscripción │ Motor Reglas │  Generador PDF   │   │
│  └─────────────┴──────────────┴──────────────────┘   │
│  ┌─────────────┬──────────────┐                      │
│  │   Módulo    │    Módulo    │                      │
│  │ Estudiantes │  Prioridad*  │                      │
│  └─────────────┴──────────────┘                      │
│                                                      │
│  * Gestión de prioridad de inscripción basada en     │
│    requisitos de continuidad académica               │
└───────┬──────────────────────────────────────────────┘
        │
        ▼
   PostgreSQL
   (Azure Database for PostgreSQL)
   
   Datos del sistema
```

**Nota:** El módulo de Prioridad gestiona la prioridad de inscripción 
de estudiantes basándose en requisitos de continuidad de ramos 
(estudiantes que necesitan ramos específicos para continuar su malla).

## Modelo de Datos

![Modelo Entidad-Relación](docs/Untitled.png)

## Stack Tecnológico

| Capa | Tecnología |
|------|------------|
| Frontend | Angular |
| Backend | NestJS |
| ORM | Prisma |
| Base de datos | PostgreSQL |
| Dev local | Docker Compose (PostgreSQL) |
| Producción Backend | Azure App Service (NestJS) |
| Producción DB | Azure Database for PostgreSQL |
| Producción Frontend | Azure Static Web Apps (Angular) |

## Seguridad

| Capa | Medida |
|------|--------|
| Autenticación | JWT con expiración, refresh tokens |
| Autorización | Guards de NestJS por rol (super_admin, admin_institucion, estudiante) |
| Contraseñas | Hash con bcrypt |
| Multi-tenant | Middleware que filtra datos por institución en cada request |
| CORS | Configurado para aceptar solo orígenes permitidos |
| Validación | DTOs con class-validator en cada endpoint |

---

---

## Instalación — Desarrollo Local

### Requisitos previos

| Herramienta | Versión mínima |
|---|---|
| Node.js | 20 LTS |
| Docker Desktop | cualquiera reciente |
| Git | cualquiera |

### Pasos

**1. Clonar el repositorio**
```bash
git clone https://github.com/cruentao/sadara.git
cd sadara
```

**2. Configurar variables de entorno**
```bash
cd backend
cp .env.example .env
# Los valores por defecto funcionan para desarrollo local con Docker
```

**3. Levantar la base de datos**
```bash
# Desde la raíz del proyecto
docker-compose up -d

# Verificar que esté corriendo
docker ps   # debe aparecer sadara_db  Up
```

**4. Instalar dependencias**
```bash
cd backend
npm install --legacy-peer-deps
```

**5. Ejecutar migraciones**
```bash
npx prisma migrate deploy
```

**6. Iniciar el backend**
```bash
npm run start:dev
```

- API: `http://localhost:3000`
- Swagger: `http://localhost:3000/api/docs`

---

## Deploy en Azure

El backend está contenerizado con Docker y desplegado en Azure App Service. La base de datos corre en Azure Database for PostgreSQL Flexible Server. Las variables de entorno se configuran directamente en el App Service.

Al iniciar el contenedor, `prisma migrate deploy` se ejecuta automáticamente antes de levantar el servidor.

---

## CI/CD — GitHub Actions

El pipeline de integración y despliegue continuo está definido en `.github/workflows/ci-cd.yml`.

### Trigger

Se activa automáticamente en cada `push` a la rama `main` que incluya cambios dentro de `backend/`.

```
push → main (backend/**) → CI/CD pipeline
```

### Etapas del pipeline

```
checkout → buildx setup → login GHCR → build & push imagen → deploy Azure
```

| Etapa | Herramienta | Qué hace |
|-------|-------------|----------|
| Checkout | `actions/checkout@v4` | Descarga el código del repositorio |
| Docker Buildx | `docker/setup-buildx-action@v3` | Habilita builder avanzado con soporte de caché |
| Login GHCR | `docker/login-action@v3` | Se autentica en `ghcr.io` con el PAT del secret |
| Build & Push | `docker/build-push-action@v5` | Construye la imagen desde `backend/Dockerfile` y la publica en GHCR con caché entre runs |
| Deploy | `azure/webapps-deploy@v3` | Indica a Azure App Service qué imagen usar y reinicia el contenedor |

### Secrets requeridos en GitHub

Configurar en **Settings → Secrets and variables → Actions**:

| Secret | Descripción |
|--------|-------------|
| `GHCR_TOKEN` | Personal Access Token con scope `write:packages` |
| `AZURE_WEBAPP_NAME` | Nombre del App Service (`sadara-backend`) |
| `AZURE_PUBLISH_PROFILE` | XML descargado desde Azure Portal → App Service → Overview → *Get publish profile* |

### Caché de capas Docker

El pipeline usa caché de GitHub Actions (`type=gha`) para reutilizar capas entre ejecuciones. El primer build tarda ~2-3 min; los builds subsiguientes que no cambien dependencias pueden reducirse a menos de 1 min.

### Flujo completo de un deploy

```
1. git push → main
2. GitHub Actions detecta cambios en backend/
3. Build de imagen Docker (con caché)
4. Push a ghcr.io/cruentao/sadara-backend:latest
5. Azure App Service descarga la nueva imagen
6. Contenedor reinicia → prisma migrate deploy → node dist/main
7. API disponible en https://sadara-backend.azurewebsites.net
```

---

## Variables de entorno

| Variable | Descripción | Ejemplo |
|---|---|---|
| `NODE_ENV` | Entorno de ejecución | `development` / `production` |
| `PORT` | Puerto del servidor | `3000` |
| `DATABASE_URL` | Cadena de conexión PostgreSQL | `postgresql://user:pass@host:5432/db` |
| `JWT_ACCESS_SECRET` | Secreto para firmar access tokens | mínimo 32 chars aleatorios |
| `JWT_ACCESS_EXPIRATION` | Duración del access token | `15m` |
| `JWT_REFRESH_SECRET` | Secreto para firmar refresh tokens | mínimo 32 chars aleatorios |
| `JWT_REFRESH_EXPIRATION` | Duración del refresh token | `7d` |
| `CORS_ALLOWED_ORIGINS` | Orígenes permitidos (separados por coma) | `http://localhost:4200` |
| `BCRYPT_SALT_ROUNDS` | Rondas de hash para contraseñas | `10` |

---

**Proyecto de Portafolio** | Desarrollo activo
