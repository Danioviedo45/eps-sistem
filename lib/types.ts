// Tipos para usuarios
export interface Usuario {
  id: number
  cedula: string
  nombre: string
  apellidos: string
  tipo: "paciente" | "doctor" | "admin"
  usuario: string
  password: string
}

export interface Paciente extends Usuario {
  tipo: "paciente"
  telefono?: string
  direccion?: string
  email?: string
}

export interface Doctor extends Usuario {
  tipo: "doctor"
  especialidad: string
  jornada: "matutina" | "vespertina"
}

// Tipos para citas
export interface Cita {
  id: number
  pacienteId: number
  doctorId: number
  fecha: string // formato YYYY-MM-DD
  hora: string // formato HH:MM
  motivo: string
  estado: "pendiente" | "en_curso" | "completada" | "cancelada"
}

// Tipos para consultas médicas
export interface ConsultaMedica {
  id: number
  citaId: number
  sintomas: string
  diagnostico: string
  tratamiento: string
  observaciones?: string
  fechaCreacion: string // formato YYYY-MM-DD
}
