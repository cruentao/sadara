-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('super_admin', 'admin_institucion', 'estudiante');

-- CreateEnum
CREATE TYPE "TipoInstitucion" AS ENUM ('universidad', 'instituto_tecnico', 'instituto_profesional');

-- CreateEnum
CREATE TYPE "Modalidad" AS ENUM ('presencial', 'online', 'semipresencial');

-- CreateEnum
CREATE TYPE "TipoAsignatura" AS ENUM ('obligatoria', 'electiva', 'libre_eleccion');

-- CreateEnum
CREATE TYPE "EstadoEstudianteCarrera" AS ENUM ('activo', 'egresado', 'suspendido', 'retirado');

-- CreateEnum
CREATE TYPE "EstadoInscripcion" AS ENUM ('inscrito', 'en_curso', 'aprobado', 'reprobado', 'retirado');

-- CreateEnum
CREATE TYPE "TipoRegla" AS ENUM ('MAX_CREDITOS', 'PREREQUISITO_ESTRICTO', 'MAX_ASIGNATURAS', 'CHOQUE_HORARIO');

-- CreateTable
CREATE TABLE "cuenta_usuario" (
    "id" UUID NOT NULL,
    "institucion_id" UUID,
    "correo" TEXT NOT NULL,
    "contrasena_hash" TEXT NOT NULL,
    "rol" "Rol" NOT NULL,
    "esta_activo" BOOLEAN NOT NULL DEFAULT true,
    "ultimo_login" TIMESTAMP(3),
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cuenta_usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refresh_token" (
    "id" UUID NOT NULL,
    "cuenta_usuario_id" UUID NOT NULL,
    "token" TEXT NOT NULL,
    "expira_en" TIMESTAMP(3) NOT NULL,
    "revocado" BOOLEAN NOT NULL DEFAULT false,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refresh_token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "institucion" (
    "id" UUID NOT NULL,
    "nombre" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "tipo" "TipoInstitucion" NOT NULL,
    "logo_url" TEXT,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(3),

    CONSTRAINT "institucion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "facultad" (
    "id" UUID NOT NULL,
    "institucion_id" UUID NOT NULL,
    "nombre" TEXT NOT NULL,
    "area" TEXT,

    CONSTRAINT "facultad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "carrera" (
    "id" UUID NOT NULL,
    "facultad_id" UUID NOT NULL,
    "codigo" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "modalidad" "Modalidad" NOT NULL,
    "total_semestres" INTEGER NOT NULL,
    "total_creditos" INTEGER,
    "esta_activa" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "carrera_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "malla_curricular" (
    "id" UUID NOT NULL,
    "carrera_id" UUID NOT NULL,
    "anio" INTEGER NOT NULL,
    "version" TEXT,
    "esta_activa" BOOLEAN NOT NULL DEFAULT true,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "malla_curricular_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asignatura" (
    "id" UUID NOT NULL,
    "institucion_id" UUID NOT NULL,
    "codigo" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "creditos" INTEGER NOT NULL,
    "horas_teoricas" INTEGER NOT NULL DEFAULT 0,
    "horas_practicas" INTEGER NOT NULL DEFAULT 0,
    "tipo_asignatura" "TipoAsignatura" NOT NULL DEFAULT 'obligatoria',

    CONSTRAINT "asignatura_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "malla_asignatura" (
    "id" UUID NOT NULL,
    "malla_id" UUID NOT NULL,
    "asignatura_id" UUID NOT NULL,
    "numero_semestre" INTEGER NOT NULL,
    "es_obligatoria" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "malla_asignatura_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prerrequisito" (
    "id" UUID NOT NULL,
    "malla_asignatura_id" UUID NOT NULL,
    "asignatura_requerida_id" UUID NOT NULL,
    "grupo_clave" TEXT NOT NULL,

    CONSTRAINT "prerrequisito_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "periodo_academico" (
    "id" UUID NOT NULL,
    "institucion_id" UUID NOT NULL,
    "nombre" TEXT NOT NULL,
    "anio" INTEGER NOT NULL,
    "semestre" INTEGER NOT NULL,
    "fecha_inicio" DATE NOT NULL,
    "fecha_fin" DATE NOT NULL,
    "inicio_inscripcion" DATE,
    "fin_inscripcion" DATE,
    "esta_activo" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "periodo_academico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seccion" (
    "id" UUID NOT NULL,
    "asignatura_id" UUID NOT NULL,
    "periodo_id" UUID NOT NULL,
    "codigo" TEXT NOT NULL,
    "capacidad_maxima" INTEGER NOT NULL,

    CONSTRAINT "seccion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bloque_horario" (
    "id" UUID NOT NULL,
    "seccion_id" UUID NOT NULL,
    "dia_semana" INTEGER NOT NULL,
    "hora_inicio" TIME NOT NULL,
    "hora_fin" TIME NOT NULL,
    "sala" TEXT,

    CONSTRAINT "bloque_horario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "estudiante" (
    "id" UUID NOT NULL,
    "cuenta_usuario_id" UUID NOT NULL,
    "institucion_id" UUID NOT NULL,
    "codigo_estudiante" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "telefono" TEXT,
    "anio_ingreso" INTEGER,
    "esta_activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "estudiante_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "estudiante_carrera" (
    "id" UUID NOT NULL,
    "estudiante_id" UUID NOT NULL,
    "carrera_id" UUID NOT NULL,
    "malla_id" UUID NOT NULL,
    "anio_admision" INTEGER NOT NULL,
    "estado" "EstadoEstudianteCarrera" NOT NULL DEFAULT 'activo',

    CONSTRAINT "estudiante_carrera_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inscripcion" (
    "id" UUID NOT NULL,
    "estudiante_carrera_id" UUID NOT NULL,
    "seccion_id" UUID NOT NULL,
    "periodo_id" UUID NOT NULL,
    "estado" "EstadoInscripcion" NOT NULL DEFAULT 'inscrito',
    "inscrito_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(3),

    CONSTRAINT "inscripcion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prioridad_inscripcion" (
    "id" UUID NOT NULL,
    "estudiante_carrera_id" UUID NOT NULL,
    "periodo_id" UUID NOT NULL,
    "puntaje_prioridad" INTEGER NOT NULL,
    "ventana_inicio" TIMESTAMP(3),
    "ventana_fin" TIMESTAMP(3),

    CONSTRAINT "prioridad_inscripcion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "regla_institucion" (
    "id" UUID NOT NULL,
    "institucion_id" UUID NOT NULL,
    "tipo_regla" "TipoRegla" NOT NULL,
    "configuracion" JSONB NOT NULL,
    "prioridad" INTEGER NOT NULL DEFAULT 0,
    "esta_habilitada" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "regla_institucion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cuenta_usuario_correo_key" ON "cuenta_usuario"("correo");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_token_token_key" ON "refresh_token"("token");

-- CreateIndex
CREATE INDEX "idx_refresh_token_usuario" ON "refresh_token"("cuenta_usuario_id");

-- CreateIndex
CREATE UNIQUE INDEX "institucion_slug_key" ON "institucion"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "facultad_institucion_id_nombre_key" ON "facultad"("institucion_id", "nombre");

-- CreateIndex
CREATE UNIQUE INDEX "carrera_facultad_id_codigo_key" ON "carrera"("facultad_id", "codigo");

-- CreateIndex
CREATE UNIQUE INDEX "malla_curricular_carrera_id_anio_version_key" ON "malla_curricular"("carrera_id", "anio", "version");

-- CreateIndex
CREATE UNIQUE INDEX "asignatura_institucion_id_codigo_key" ON "asignatura"("institucion_id", "codigo");

-- CreateIndex
CREATE UNIQUE INDEX "malla_asignatura_malla_id_asignatura_id_key" ON "malla_asignatura"("malla_id", "asignatura_id");

-- CreateIndex
CREATE UNIQUE INDEX "periodo_academico_institucion_id_anio_semestre_key" ON "periodo_academico"("institucion_id", "anio", "semestre");

-- CreateIndex
CREATE UNIQUE INDEX "seccion_asignatura_id_periodo_id_codigo_key" ON "seccion"("asignatura_id", "periodo_id", "codigo");

-- CreateIndex
CREATE UNIQUE INDEX "estudiante_cuenta_usuario_id_key" ON "estudiante"("cuenta_usuario_id");

-- CreateIndex
CREATE UNIQUE INDEX "estudiante_institucion_id_codigo_estudiante_key" ON "estudiante"("institucion_id", "codigo_estudiante");

-- CreateIndex
CREATE UNIQUE INDEX "estudiante_carrera_estudiante_id_carrera_id_key" ON "estudiante_carrera"("estudiante_id", "carrera_id");

-- CreateIndex
CREATE UNIQUE INDEX "inscripcion_estudiante_carrera_id_seccion_id_key" ON "inscripcion"("estudiante_carrera_id", "seccion_id");

-- CreateIndex
CREATE UNIQUE INDEX "prioridad_inscripcion_estudiante_carrera_id_periodo_id_key" ON "prioridad_inscripcion"("estudiante_carrera_id", "periodo_id");

-- AddForeignKey
ALTER TABLE "cuenta_usuario" ADD CONSTRAINT "cuenta_usuario_institucion_id_fkey" FOREIGN KEY ("institucion_id") REFERENCES "institucion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refresh_token" ADD CONSTRAINT "refresh_token_cuenta_usuario_id_fkey" FOREIGN KEY ("cuenta_usuario_id") REFERENCES "cuenta_usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facultad" ADD CONSTRAINT "facultad_institucion_id_fkey" FOREIGN KEY ("institucion_id") REFERENCES "institucion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carrera" ADD CONSTRAINT "carrera_facultad_id_fkey" FOREIGN KEY ("facultad_id") REFERENCES "facultad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "malla_curricular" ADD CONSTRAINT "malla_curricular_carrera_id_fkey" FOREIGN KEY ("carrera_id") REFERENCES "carrera"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asignatura" ADD CONSTRAINT "asignatura_institucion_id_fkey" FOREIGN KEY ("institucion_id") REFERENCES "institucion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "malla_asignatura" ADD CONSTRAINT "malla_asignatura_malla_id_fkey" FOREIGN KEY ("malla_id") REFERENCES "malla_curricular"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "malla_asignatura" ADD CONSTRAINT "malla_asignatura_asignatura_id_fkey" FOREIGN KEY ("asignatura_id") REFERENCES "asignatura"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prerrequisito" ADD CONSTRAINT "prerrequisito_malla_asignatura_id_fkey" FOREIGN KEY ("malla_asignatura_id") REFERENCES "malla_asignatura"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prerrequisito" ADD CONSTRAINT "prerrequisito_asignatura_requerida_id_fkey" FOREIGN KEY ("asignatura_requerida_id") REFERENCES "asignatura"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "periodo_academico" ADD CONSTRAINT "periodo_academico_institucion_id_fkey" FOREIGN KEY ("institucion_id") REFERENCES "institucion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seccion" ADD CONSTRAINT "seccion_asignatura_id_fkey" FOREIGN KEY ("asignatura_id") REFERENCES "asignatura"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seccion" ADD CONSTRAINT "seccion_periodo_id_fkey" FOREIGN KEY ("periodo_id") REFERENCES "periodo_academico"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bloque_horario" ADD CONSTRAINT "bloque_horario_seccion_id_fkey" FOREIGN KEY ("seccion_id") REFERENCES "seccion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "estudiante" ADD CONSTRAINT "estudiante_cuenta_usuario_id_fkey" FOREIGN KEY ("cuenta_usuario_id") REFERENCES "cuenta_usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "estudiante" ADD CONSTRAINT "estudiante_institucion_id_fkey" FOREIGN KEY ("institucion_id") REFERENCES "institucion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "estudiante_carrera" ADD CONSTRAINT "estudiante_carrera_estudiante_id_fkey" FOREIGN KEY ("estudiante_id") REFERENCES "estudiante"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "estudiante_carrera" ADD CONSTRAINT "estudiante_carrera_carrera_id_fkey" FOREIGN KEY ("carrera_id") REFERENCES "carrera"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "estudiante_carrera" ADD CONSTRAINT "estudiante_carrera_malla_id_fkey" FOREIGN KEY ("malla_id") REFERENCES "malla_curricular"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inscripcion" ADD CONSTRAINT "inscripcion_estudiante_carrera_id_fkey" FOREIGN KEY ("estudiante_carrera_id") REFERENCES "estudiante_carrera"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inscripcion" ADD CONSTRAINT "inscripcion_seccion_id_fkey" FOREIGN KEY ("seccion_id") REFERENCES "seccion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inscripcion" ADD CONSTRAINT "inscripcion_periodo_id_fkey" FOREIGN KEY ("periodo_id") REFERENCES "periodo_academico"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prioridad_inscripcion" ADD CONSTRAINT "prioridad_inscripcion_estudiante_carrera_id_fkey" FOREIGN KEY ("estudiante_carrera_id") REFERENCES "estudiante_carrera"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prioridad_inscripcion" ADD CONSTRAINT "prioridad_inscripcion_periodo_id_fkey" FOREIGN KEY ("periodo_id") REFERENCES "periodo_academico"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "regla_institucion" ADD CONSTRAINT "regla_institucion_institucion_id_fkey" FOREIGN KEY ("institucion_id") REFERENCES "institucion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
