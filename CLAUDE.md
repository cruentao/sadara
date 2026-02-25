# SADARA - Sistema de Administración de Registro de Asignaturas

## Contexto del Proyecto
Sistema multi-tenant de gestión de inscripción de asignaturas para instituciones de educación superior.
Proyecto de portafolio con enfoque en arquitectura, modelado de dominio y control de acceso.
Stack: Angular + NestJS + Prisma + PostgreSQL + Azure.

---

## Estructura del Proyecto
```
/
├── frontend/     # Angular SPA
├── backend/      # NestJS API REST
└── docker-compose.yml
```

---

## Reglas Generales — SIEMPRE seguir

- Responde siempre en español
- Los comentarios en el código van en inglés
- NUNCA escribas código incompleto ni uses placeholders como `// TODO` o `...`
- NUNCA instales dependencias nuevas sin consultarme primero
- NUNCA cambies la estructura de carpetas sin aprobación explícita
- Ante decisiones arquitectónicas importantes, presenta opciones con pros/contras y recomienda una antes de implementar
- Usa conventional commits: `feat:`, `fix:`, `chore:`, `refactor:`, `docs:`
- No hagas más de lo que se te pide en cada prompt

---

## Reglas de Prisma — CRÍTICO

- **NUNCA modifiques el schema de Prisma** a menos que se te pida de forma explícita
- **NUNCA ejecutes** `prisma migrate dev` ni `prisma db push` por iniciativa propia
- Si una feature requiere cambios en el schema, detente y consúltame antes de continuar
- Puedes leer el schema para entender el modelo de datos, pero no tocarlo

---

## Backend — NestJS

### Estructura de módulos
Cada módulo sigue esta estructura sin excepción:
```
modulo/
├── modulo.module.ts
├── modulo.controller.ts
├── modulo.service.ts
├── dto/
│   ├── create-modulo.dto.ts
│   └── update-modulo.dto.ts
└── entities/
    └── modulo.entity.ts
```

### Patrones obligatorios

- **Repository Pattern**: toda interacción con Prisma va en el Service, nunca en el Controller
- **DTO validation**: usa `class-validator` en todos los DTOs de entrada, sin excepción
- **Guard-first**: toda ruta protegida debe tener `@UseGuards(JwtAuthGuard, RolesGuard)` antes de cualquier lógica
- **Single Responsibility**: cada Service tiene una responsabilidad clara; si crece demasiado, propón dividirlo

### Multi-tenancy — CRÍTICO

- El `institucion_id` **siempre** se extrae del JWT payload, nunca del body ni de headers del request
- **Todo query a Prisma** que involucre datos de una institución debe incluir el filtro `where: { institucion_id }` sin excepción
- El middleware de tenant extrae el `institucion_id` del token y lo inyecta en el request antes de llegar al controller
- Nunca confíes en un `institucion_id` que venga del cliente directamente

Ejemplo correcto:
```typescript
// Correcto — institution_id viene del JWT
async findAll(institucionId: string) {
  return this.prisma.asignatura.findMany({
    where: { institucion_id: institucionId }
  });
}

// INCORRECTO — nunca hagas esto
async findAll(body: { institucionId: string }) { ... }
```

### Roles disponibles
- `super_admin` — gestión de instituciones, sin acceso a datos académicos internos
- `admin_institucion` — gestión académica de su institución únicamente
- `estudiante` — inscripción y consulta de sus propios ramos

---

## Manejo de incertidumbre

- Si no sabes cómo implementar algo con certeza, dilo explícitamente 
  antes de intentarlo
- Si necesitas información que no está en el codebase ni en el CLAUDE.md, 
  pregunta antes de asumir
- Nunca inventes nombres de métodos, clases o configuraciones de Prisma 
  que no hayas visto en el código
- Si el schema de Prisma no está disponible, detente y pídeme que 
  te lo muestre antes de escribir queries
---

## Seguridad

### Autenticación JWT
- Access token: vida corta (15min recomendado)
- Refresh token: almacenado en **cookie httpOnly**, nunca en localStorage ni en el body de respuesta
- El payload del JWT debe incluir: `sub` (userId), `role`, `institucion_id`
- Nunca expongas el refresh token en respuestas JSON

### Guards y autorización
- Usa `RolesGuard` con el decorator `@Roles()` para proteger endpoints por rol
- Los endpoints de estudiante deben validar además que el recurso pertenezca al estudiante autenticado
- Un `admin_institucion` nunca debe poder acceder a datos de otra institución, incluso si manipula el request

### Logging de seguridad
Loguea los siguientes eventos con nivel `warn` usando el Logger de NestJS:
- Intentos de login fallidos (credenciales incorrectas)
- Intentos de acceso a recursos de otra institución
- Requests con tokens inválidos o expirados
- Intentos de acceso a rutas sin los roles requeridos

Formato de log:
```
[SECURITY] evento | userId: X | institucionId: Y | ip: Z | timestamp
```

### Validaciones generales
- Sanitiza todos los inputs con `class-validator` y `class-transformer`
- Configura `ValidationPipe` globalmente con `whitelist: true` y `forbidNonWhitelisted: true`
- CORS configurado solo para orígenes permitidos, nunca `origin: '*'` en producción
- Passwords con bcrypt, mínimo 10 salt rounds

---

## Frontend — Angular

### Patrones obligatorios
- Usa **standalone components** en todos los componentes nuevos, sin NgModules
- Usa **signals** para estado local del componente
- Los servicios HTTP van en una capa de servicios dedicada (`/services`), nunca en el componente directamente
- Usa **guards de ruta** para proteger rutas por rol antes de renderizar
- Tipado estricto: nunca uses `any`, siempre define interfaces o types

### Estructura por feature
```
feature/
├── components/
├── services/
├── models/
└── feature.routes.ts
```

### Manejo de errores
- Usa un `HttpInterceptor` global para manejar errores 401 (redirigir a login) y 403 (mostrar acceso denegado)
- Nunca expongas mensajes de error internos del backend al usuario final
- Muestra mensajes de error amigables y genéricos en la UI

---

## Módulos del Sistema

Los módulos definidos para SADARA son:
`auth`, `institucion`, `academico`, `inscripcion`, `motor-reglas`, `estudiantes`, `prioridad`, `generador-pdf`

Si necesitas crear un módulo nuevo fuera de esta lista, consúltame primero.

---

## Comandos útiles
```bash
# Backend
npm run start:dev          # levantar backend en modo desarrollo
npx prisma studio          # interfaz visual de la BD (solo lectura durante desarrollo)
npx prisma migrate dev      # SOLO ejecutar si se te pide explícitamente

# Docker
docker-compose up -d       # levantar PostgreSQL local
docker-compose down        # bajar contenedores
```

---

## Fuera de alcance — NO implementar
El sistema NO incluye y no debes agregar lógica para:
- Pagos o aranceles
- Gestión de notas
- Gestión de docentes
- Reportes avanzados o BI
- App móvil

Si una feature solicitada toca estas áreas, detente y consulta antes de continuar.