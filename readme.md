# Sistema de Gestión para EPS

Este es un sistema web desarrollado para facilitar la gestión de citas médicas en una EPS.
Permite agendar, modificar y consultar citas de forma rápida y segura. Está diseñado para pacientes, doctores y personal administrativo, con acceso personalizado según su rol. Todo se gestiona desde una plataforma centralizada, mejorando la eficiencia y reduciendo los tiempos de espera.

## 🚀 Tecnologías utilizadas

- **Next.js** (App Router)
- **Supabase** (Base de datos PostgreSQL + autenticación)
- **Tailwind CSS** (Estilos)
- **TypeScript**
- **Server Actions** (para manejo de formularios y lógica en el servidor)
- 
## ⚙️ Requisitos

> **Nota:** Este proyecto requiere **Node.js v20** o superior.  
> Puedes verificar tu versión con el siguiente comando:

> **Nota:** Este proyecto requiere **pnpm v10** o superior.  
> Puedes verificar tu versión con el siguiente comando:

```bash
node -v
```
```bash
pnpm -v
```

## 🛠️ Instalación local

1. Clona este repositorio:

```bash
git clone https://github.com/HeymerDev/eps-sistem.git
```

2. Instale Dependencias
```bash
pnpm i
```

3. Ejecute en Modo Desarrollo
```bash
pnpm run dev
```

## 👥 Roles del sistema

- **Administrador**
  - CRUD de Pacientes
  - CRUD de Doctores
  - Consultar Historial Medico

- **Paciente**
  - Agendar Cita
  - Ver Citas Anteriores

- **Doctor**
  - Ver Citas
  - Consultar Historial Medico

Cada rol tiene acceso limitado únicamente a los módulos permitidos según sus permisos.

## 🔐 Autenticación

La autenticación está integrada con Supabase. El usuario inicia sesión con correo electrónico y contraseña. El sistema valida el tipo de usuario para redirigir al panel correspondiente.

## 📦 Estructura del proyecto

```plaintext
src/
├── app/
│   ├── admin/            # Módulo para funcionalidades del administrador
│   ├── doctor/           # Módulo para doctores (consultar citas, pacientes, etc.)
│   ├── login/            # Página de inicio de sesión
│   ├── paciente/         # Módulo para pacientes (agendar citas, historial, etc.)
│   ├── signup/           # Página de registro de usuarios
│   ├── globals.css       # Estilos globales de la aplicación
│   ├── layout.tsx        # Layout principal de la aplicación (estructura base)
│   └── page.tsx          # Página principal (landing o redirección)
│
├── components/           # Componentes reutilizables de interfaz
├── hooks/                # Hooks personalizados de React
├── lib/                  # Funciones y lógica reutilizable
├── node_modules/         # Dependencias instaladas del proyecto
├── public/               # Archivos estáticos (imágenes, íconos, etc.)
├── styles/               # Estilos específicos o módulos CSS
└── tsconfig.json         # Configuración de TypeScript (no visible en imagen)
```

##🧪 Funcionalidades clave

- Gestión de usuarios con asignación de roles  
  Administración de usuarios con roles específicos como paciente, doctor y administrador.

- Agendamiento de citas con confirmación automática  
  Permite a los pacientes reservar citas y recibir confirmación inmediata.

- Control de historial clínico y seguimiento de citas  
  Registro y consulta de antecedentes médicos vinculados a cada paciente.
